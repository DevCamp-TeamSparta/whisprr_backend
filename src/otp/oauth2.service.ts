import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { google } from 'googleapis';

@Injectable()
export class OAuth2Service {
  constructor(private configService: ConfigService) {}

  //   public async getOauth2Client() {
  //     const clientId = this.configService.get<string>('CLIENT_ID');
  //     const clientSecret = this.configService.get<string>('CLIENT_SECRET');

  //     const redirectUrl = this.configService.get<string>('REDIRECT_URL');

  //     const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

  //     return oauth2Client;
  //   }

  //   public async getAccessToken() {
  //     const refreshToken = this.configService.get<string>('REFRESH_TOKEN');

  //     const oauth2Client = await this.getOauth2Client();

  //     oauth2Client.setCredentials({ refresh_token: refreshToken });
  //     const { token } = await oauth2Client.getAccessToken();
  //     return token;
  //   }
}
