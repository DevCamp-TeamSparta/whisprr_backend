import { Injectable, NotFoundException } from '@nestjs/common';
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
    const verifyInfo = await this.verifyPurchaseToken(plan, user, purchaseToken);
    const token = await this.userService.getUserToken(user.user_id);

    return {
      ...verifyInfo,
      new_token: token,
    };
  }

  //1.구매 토큰 검증
  async verifyPurchaseToken(plan: PlanEntity, user: UserEntity, purchaseToken: string) {
    const client = await this.getAndroidPublisherClient();
    const response = await client.purchases.subscriptions.get({
      packageName: this.configService.get<string>('PACKAGE_NAME'),
      subscriptionId: plan.id,
      token: purchaseToken,
    });

    return await this.updatePurchaseRecord(response.data, user, purchaseToken, plan);
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
  async updatePurchaseRecord(response, user: UserEntity, purchaseToken: string, plan: PlanEntity) {
    let result = PurchaseStatus.inactive;
    if (!response.cancelReason == null) {
      result = PurchaseStatus.active;
    }

    const newRecord = {
      plan,
      purchase_token: purchaseToken,
      purchase_date: new Date(Number(response.startTimeMillis)),
      expiration_date: new Date(Number(response.expiryTimeMillis)),
      status: result,
    };

    if (await this.findUserPurchaseRecord(user)) {
      await this.purchaseRepository.update({ user }, { ...newRecord });
    } else {
      const newPurchase = this.purchaseRepository.create({
        user,
        ...newRecord,
      });

      await this.purchaseRepository.save(newPurchase);
    }

    return newRecord;
  }

  //1.2.1 이전 구매 기록 있는 지 확인
  private async findUserPurchaseRecord(user: UserEntity) {
    const record = await this.purchaseRepository.findOne({ where: { user } });
    return record;
  }

  //2. 알림 수신 시 구매 상태 업데이트
  async updatePurchaseTable(message) {
    const decodedData = JSON.parse(Buffer.from(message.data, 'base64').toString('utf-8'));

    console.log('Decoded Data:', decodedData);
    const notificationType = decodedData.subscriptionNotification?.notificationType;

    if (!notificationType) {
      console.log('notificationType이 없습니다. 테스트용 알림이거나 잘못된 데이터입니다.');
      return;
    }
    const purchaeStatus = await this.checkStatus(
      decodedData.subscriptionNotification.notificationType,
    );
    const purchaseToken = decodedData.subscriptionNotification.purchaseToken;

    await this.purchaseRepository.update(
      {
        purchase_token: purchaseToken,
      },
      { ...purchaeStatus },
    );

    const purchaseWithUser = await this.findUserByPurchaseToken(purchaseToken);

    await this.userService.updateTokenVersion(purchaseWithUser.user.user_id);
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
      relations: ['user'],
    });

    if (!purchase) {
      throw new NotFoundException('the user is not exist');
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
