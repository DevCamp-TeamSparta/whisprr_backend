import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from './entities/purchase.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { androidpublisher } from '@googleapis/androidpublisher';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import { PurchaseStatus } from './utils/purchase.status';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
    private configService: ConfigService,
  ) {}

  async verifyPurchaseToken(plan: PlanEntity, user: UserEntitiy, purchaseToken: string) {
    const keyFile = this.configService.get<string>('GOOGLE_KEY_FILE');
    const auth = new GoogleAuth({
      keyFilename: keyFile,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

    console.log(1, keyFile);

    const getAndroidPublisherClient = async () => {
      const authClient = (await auth.getClient()) as OAuth2Client;
      return androidpublisher({
        version: 'v3',
        auth: authClient,
      });
    };

    const client = await getAndroidPublisherClient();
    const response = await client.purchases.subscriptions.get({
      packageName: this.configService.get<string>('PACKAGE_NAME'),
      subscriptionId: plan.id,
      token: purchaseToken,
    });

    return await this.updatePurchaseRecord(response.data, user, purchaseToken, plan);
  }

  async updatePurchaseRecord(response, user: UserEntitiy, purchaseToken: string, plan: PlanEntity) {
    console.log(response);
    let result = PurchaseStatus.inactive;
    if (response.cancelReason || this.checkExpiration(response)) {
      result = PurchaseStatus.inactive;
    } else {
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

  private async findUserPurchaseRecord(user: UserEntitiy) {
    const record = await this.purchaseRepository.findOne({ where: { user } });
    return record;
  }

  private checkExpiration(response) {
    return new Date(Number(response.expiryTimeMillis)) < new Date();
  }

  async updatePurchaseTable(message) {
    const status = await this.checkStatus(message.SubscriptionNotification.notificationType);
    const purchaseToken = message.subscriptionNotification.purchaseToken;

    const result = await this.purchaseRepository.update(
      {
        purchase_token: purchaseToken,
      },
      { status },
    );
  }

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
      12, // SUBSCRIPTION_REVOKED
      13, // SUBSCRIPTION_EXPIRED
      20, // SUBSCRIPTION_PENDING_PURCHASE_CANCELED
    ];

    if (activeNotifications.includes(notificationType)) {
      return PurchaseStatus.active;
    } else if (inactiveNotifications.includes(notificationType)) {
      return PurchaseStatus.inactive;
    }
  }

  async findUserByPurchaseToken(purchaseToken: string) {
    const purchase = await this.purchaseRepository.findOne({
      where: { purchase_token: purchaseToken },
      relations: ['user'],
    });

    return purchase.user;
  }
}
