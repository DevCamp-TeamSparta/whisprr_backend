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
import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { PlanService } from 'src/plan/plan.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
    private configService: ConfigService,
    private userService: UserService,
    private planService: PlanService,
  ) {}

  //0.구매 검증
  public async verifyPurchase(userInfo: JwtPayload, purchaseToken: string, productId: string) {
    const plan = await this.planService.findPlan(productId);
    const user = await this.userService.findUserByUserInfo(userInfo);
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

  //1.1 구글 크레덴셜 로그인 클라이언트 생성
  async getAndroidPublisherClient() {
    const keyFile = this.configService.get<string>('GOOGLE_KEY_FILE');
    const auth = new GoogleAuth({
      keyFilename: keyFile,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });
    const authClient = (await auth.getClient()) as OAuth2Client;

    const result = androidpublisher({
      version: 'v3',
      auth: authClient,
    });

    return result;
  }

  //1.2 구매 상태 업데이트
  async updatePurchaseRecord(user: UserEntity, purchaseToken: string, plan: PlanEntity) {
    const client = await this.getAndroidPublisherClient();
    const purchaseResponse = await client.purchases.subscriptions.get({
      packageName: this.configService.get<string>('PACKAGE_NAME'),
      subscriptionId: plan.id,
      token: purchaseToken,
    });

    const queryRunner = this.purchaseRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (purchaseResponse.data.linkedPurchaseToken) {
        console.log(`🔄 linkedPurchaseToken 존재: ${purchaseResponse.data.linkedPurchaseToken}`);

        await queryRunner.manager.delete(PurchaseEntity, {
          purchase_token: purchaseResponse.data.linkedPurchaseToken,
        });
      }

      let result = PurchaseStatus.active;
      if (purchaseResponse.data.cancelReason !== undefined) {
        result = PurchaseStatus.inactive;
      }

      const newRecord = {
        plan,
        purchase_token: purchaseToken,
        purchase_date: new Date(Number(purchaseResponse.data.startTimeMillis)),
        expiration_date: new Date(Number(purchaseResponse.data.expiryTimeMillis)),
        status: result,
      };

      const existingPurchase = await queryRunner.manager.findOne(PurchaseEntity, {
        where: { user },
      });

      if (existingPurchase) {
        await queryRunner.manager.update(PurchaseEntity, { user }, newRecord);
      } else {
        const newPurchase = queryRunner.manager.create(PurchaseEntity, { user, ...newRecord });
        await queryRunner.manager.save(newPurchase);
      }

      if (purchaseResponse.data.acknowledgementState === 0) {
        await client.purchases.subscriptions.acknowledge({
          packageName: this.configService.get<string>('PACKAGE_NAME'),
          subscriptionId: plan.id,
          token: purchaseToken,
          requestBody: { developerPayload: 'Acknowledged by server' },
        });

        console.log(`✅ 구독 확인 완료: ${purchaseToken}`);
      }

      await queryRunner.commitTransaction();
      return newRecord;
    } catch (error) {
      console.error(`⛔ 트랜잭션 롤백 발생: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //2. 알림 수신 시 구매 상태 업데이트
  async updatePurchaseTable(message) {
    const decodedData = JSON.parse(Buffer.from(message.data, 'base64').toString('utf-8'));

    console.log('📢 RTDN 수신:', decodedData);
    const notificationType = decodedData.subscriptionNotification?.notificationType;
    const purchaseToken = decodedData.subscriptionNotification?.purchaseToken;

    if (!notificationType || !purchaseToken) {
      console.log('⛔️ 알림 데이터 부족 - 처리 불가');
      return;
    }

    const queryRunner = this.purchaseRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const purchaseStatus = await this.checkStatus(notificationType);
      const purchaseWithUser = await this.findUserByPurchaseToken(purchaseToken);
      if (!purchaseWithUser) {
        throw new Error('User or purchase token not found');
      }
      if (purchaseStatus.status === PurchaseStatus.active) {
        console.log('🔄 Active 상태 감지! 구독 검증 실행 중...');
        const verifyInfo = await this.updatePurchaseRecord(
          purchaseWithUser.user,
          purchaseToken,
          purchaseWithUser.plan,
        );

        console.log('✅ 구독 검증 완료:', verifyInfo);
      } else {
        await queryRunner.manager.update(
          PurchaseEntity,
          { purchase_token: purchaseToken },
          { ...purchaseStatus },
        );

        await this.userService.updateTokenVersion(purchaseWithUser.user.user_id);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      console.error(`⛔ 트랜잭션 롤백 발생: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //2.1 알림 타입 별 구매 상태 분류
  private async checkStatus(notificationType: number) {
    const activeNotifications = [
      1, // SUBSCRIPTION_RECOVERED
      2, // SUBSCRIPTION_RENEWED
      4, // SUBSCRIPTION_PURCHASED
      6, // SUBSCRIPTION_IN_GRACE_PERIOD
      7, // SUBSCRIPTION_RESTARTED
      8, // SUBSCRIPTION_PRICE_CHANGE_CONFIRMED
      9, // SUBSCRIPTION_DEFERRED
    ];

    const inactiveNotifications = [
      3, // SUBSCRIPTION_CANCELED
      5, // SUBSCRIPTION_ON_HOLD
      10, // SUBSCRIPTION_PAUSED
      11, // SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED
      13, // SUBSCRIPTION_EXPIRED
      20, // SUBSCRIPTION_PENDING_PURCHASE_CANCELED
    ];

    const immeditelyInactiveNotification = [
      12, // SUBSCRIPTION_REVOKED -> 즉시 취소로 서비스 만료처리 필요
    ];

    if (activeNotifications.includes(notificationType)) {
      return { status: PurchaseStatus.active };
    } else if (inactiveNotifications.includes(notificationType)) {
      return { status: PurchaseStatus.inactive };
    } else if (immeditelyInactiveNotification.includes(notificationType)) {
      return {
        status: PurchaseStatus.inactive,
        expiration_date: new Date(),
      };
    }
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

  //6.유저 구독제 및 구매 정보 반환
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
