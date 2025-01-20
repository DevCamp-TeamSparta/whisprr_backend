import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from './entities/purchase.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { androidpublisher } from '@googleapis/androidpublisher';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
    private configService: ConfigService,
  ) {}

  async verifyPurchaseToken(productId: string, purchaseToken: string) {
    const keyFile = this.configService.get<string>('GOOGLE_KEY_FILE');
    const auth = new GoogleAuth({
      keyFilename: keyFile,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

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
      subscriptionId: productId,
      token: purchaseToken,
    });

    return response.data;
  }
}
