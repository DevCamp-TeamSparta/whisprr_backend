import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { RedisService } from './redis.service';

@Injectable()
export class OAuth2Service {
  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async storeAccessToken(token: string, expiresIn: number): Promise<void> {
    const redis = this.redisService.getClient();
    await redis.set(`oauth2_access_token`, token, 'EX', expiresIn);
  }

  async getAccessTokenfromRedis(): Promise<string | null> {
    const redis = this.redisService.getClient();
    return await redis.get(`oauth2_access_token`);
  }
  public async getOauth2Client() {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');
    const redirectUrl = this.configService.get<string>('REDIRECT_URL');

    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

    return oauth2Client;
  }

  public async getAccessToken(): Promise<string> {
    const cachedToken = await this.getAccessTokenfromRedis();

    if (cachedToken) {
      console.log('🔄 Using cached access token');
      return cachedToken;
    }
    const refreshToken = this.configService.get<string>('REFRESH_TOKEN');
    const oauth2Client = await this.getOauth2Client();

    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { token } = await oauth2Client.getAccessToken();

    const expiresIn = 3600;
    await this.storeAccessToken(token, expiresIn);
    return token;
  }
}
