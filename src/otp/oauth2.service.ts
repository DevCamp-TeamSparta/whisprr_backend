import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class OAuth2Service {
  constructor(private configService: ConfigService) {}

  private accessTokenCache: string | null = null;
  private tokenExpiry: number | null = null;

  public async getOauth2Client() {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    const redirectUrl = this.configService.get<string>('REDIRECT_URL');

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

    return oauth2Client;
  }

  public async getAccessToken(): Promise<string> {
    const now = Date.now();

    if (this.accessTokenCache && this.tokenExpiry && now < this.tokenExpiry) {
      console.log('🔄 Using cached access token');
      return this.accessTokenCache;
    }
    const refreshToken = this.configService.get<string>('REFRESH_TOKEN');
    const oauth2Client = await this.getOauth2Client();

    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { token, res } = await oauth2Client.getAccessToken();

    this.accessTokenCache = token;
    this.tokenExpiry = now + (res?.data.expires_in || 3600) * 1000;
    console.log('res?.data.expires_in', res?.data.expires_in);
    return token;
  }
}
