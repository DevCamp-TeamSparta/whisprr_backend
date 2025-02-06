import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from './entities/purchase.entity';
import { MoreThan, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { androidpublisher } from '@googleapis/androidpublisher';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import { PurchaseStatus } from './utils/purchase.status';
import { UserEntity } from '../user/entities/user.entity';
import { PlanEntity } from '../plan/entities/plan.entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../common/utils/user_info.decorator';
import { PlanService } from '../plan/plan.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
    private configService: ConfigService,
    private userService: UserService,
    private planService: PlanService,
  ) {}

  //1.구매 검증
  public async verifyPurchase(userInfo: JwtPayload, purchaseToken: string, productId: string) {
    const plan = await this.planService.findPlan(productId);
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);
    if ('message' in user) {
      return user;
    }
    const verifyInfo = await this.updatePurchaseRecord(user, purchaseToken, plan);
    const token = await this.userService.getUserToken(user.user_id);

    return {
      ...verifyInfo,
      new_token: token,
    };
  }

  //2. RTDN 수신 시 google developer api 호출
  async reciveRTDN(message) {
    const decodedData = JSON.parse(Buffer.from(message.data, 'base64').toString('utf-8'));

    console.log('📢 RTDN 수신:', decodedData);
    const notificationType = decodedData.subscriptionNotification?.notificationType;
    const purchaseToken = decodedData.subscriptionNotification?.purchaseToken;

    if (!notificationType || !purchaseToken) {
      console.log('⛔️ none purchase notification');
      return;
    }

    const purchaseWithUser = await this.findUserByPurchaseToken(purchaseToken);
    if (!purchaseWithUser) {
      console.log('User or purchase token not found.');
      return;
    } //purchase 토큰으로 유저 조회 불가 시 첫구매로 간주하고 클라이언트가 집접 구매 검증 요청 해야함

    await this.updatePurchaseRecord(purchaseWithUser.user, purchaseToken, purchaseWithUser.plan);
    await this.userService.updateTokenVersion(purchaseWithUser.user.user_id);
  }

  //1.1 + 2.1.  google developer api 요청 및 구매 상태 업데이트
  async updatePurchaseRecord(user: UserEntity, purchaseToken: string, plan: PlanEntity) {
    const purchaseResponse = await this.androidDepeloverAPI(purchaseToken);
    console.log(purchaseResponse.data);

    const queryRunner = this.purchaseRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (purchaseResponse.data.linkedPurchaseToken) {
        console.log(`🔄 linkedPurchaseToken : ${purchaseResponse.data.linkedPurchaseToken}`);

        await queryRunner.manager.delete(PurchaseEntity, {
          purchase_token: purchaseResponse.data.linkedPurchaseToken,
        });
      }

      const subscriptionState = purchaseResponse.data.subscriptionState;

      const activeState = ['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD'];

      let result = PurchaseStatus.active;
      if (
        purchaseResponse.data.canceledStateContext !== undefined &&
        !activeState.includes(subscriptionState)
      ) {
        result = PurchaseStatus.inactive;
      }

      const newRecord = {
        plan,
        purchase_token: purchaseToken,
        purchase_date: new Date(purchaseResponse.data.startTime),
        expiration_date: new Date(purchaseResponse.data.lineItems[0].expiryTime),
        status: result,
      };

      const existingPurchase = await queryRunner.manager.findOne(PurchaseEntity, {
        where: { user: { user_id: user.user_id } },
        lock: { mode: 'pessimistic_write' },
      });

      if (existingPurchase) {
        await queryRunner.manager.update(
          PurchaseEntity,
          { id: existingPurchase.id },
          { ...newRecord },
        );
      } else {
        const newPurchase = queryRunner.manager.create(PurchaseEntity, { user, ...newRecord });
        await queryRunner.manager.save(newPurchase);
      }

      await queryRunner.commitTransaction();
      return newRecord;
    } catch (error) {
      console.error(`⛔ transaction rollback: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //1.1.1 developer api 요청
  private async androidDepeloverAPI(purchaseToken: string) {
    const client = await this.getAndroidPublisherClient();
    const purchaseResponse = await client.purchases.subscriptionsv2.get({
      packageName: this.configService.get<string>('PACKAGE_NAME'),
      token: purchaseToken,
    });

    return purchaseResponse;
  }

  //1.1.1.1 구글 크레덴셜 로그인 클라이언트 생성
  private async getAndroidPublisherClient() {
    const keyFile = this.configService.get<string>('GOOGLE_KEY_FILE');
    const auth = new GoogleAuth({
      keyFilename: keyFile,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });
    const authClient = (await auth.getClient()) as OAuth2Client;

    const client = androidpublisher({
      version: 'v3',
      auth: authClient,
    });

    return client;
  }

  //3. 구매 토큰으로 유저 조회(복원)
  async findUserByPurchaseToken(purchaseToken: string) {
    const purchase = await this.purchaseRepository.findOne({
      where: { purchase_token: purchaseToken },
      relations: ['user', 'plan'],
    });

    if (!purchase) {
      return null;
    }

    return purchase;
  }

  //4.유저 구독제 및 구매 정보 반환
  public async getUserPlan(user: UserEntity) {
    const plan = await this.purchaseRepository.findOne({
      where: {
        user,
        expiration_date: MoreThan(new Date()),
      },
      relations: ['plan'],
    });

    if (!plan) {
      return { message: 'You are not subscribed to any plan currently' };
    }

    return plan;
  }
}
