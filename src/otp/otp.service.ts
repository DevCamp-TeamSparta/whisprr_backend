import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { RedisService } from './redis.service';
import { OAuth2Service } from './oAuth2.service';

@Injectable()
export class OtpService {
  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
    private oauth2Service: OAuth2Service,
  ) {}

  private transporter: nodemailer.Transporter;

  //1. OTP 레디스 저장 메서드
  private async storeOTP(email: string, otp: string): Promise<void> {
    const redis = this.redisService.getClient();
    await redis.set(`otp:${email}`, otp, 'EX', 120);
  }

  //2. OTP 레디스에서 조회 메서드
  private async getOTP(email: string): Promise<string | null> {
    const redis = this.redisService.getClient();
    return await redis.get(`otp:${email}`);
  }

  //3. OTP 레디스에서 삭제 메서드
  private async deleteOTP(email: string): Promise<void> {
    const redis = this.redisService.getClient();
    await redis.del(`otp:${email}`);
  }

  //4. 인증 번호 이메일 발송 메서드
  public async sendVerifyEmail(email: string): Promise<{ message: string }> {
    const OTPCode = await this.generateOTP(email);
    const message = this.writeEmailHtml(OTPCode);
    const transporter = await this.createTransporter();
    const emailAdress = this.getEmailAddress();

    const info = await transporter.sendMail({
      from: `"Whisprr" <${emailAdress}>`,
      to: email,
      subject: '[Whisprr] Email Verification Code',
      text: 'welcome!',
      html: message,
    });

    return { message: `Verification mail sent!: ${info.messageId}` };
  }

  //4.1 nodemailer transporter 생성 메서드
  public async createTransporter() {
    const emailAdress = this.getEmailAddress();

    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');
    const accessToken = await this.oauth2Service.getAccessToken();

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        user: emailAdress,
        clientId: clientId,
        clientSecret: clientSecret,
        accessToken: accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
    });
    return this.transporter;
  }

  //4.1.1 관리자 이메일 로드 메서드
  private getEmailAddress(): string {
    return this.configService.get<string>('YOUR_EMAIL');
  }

  //4.2 OTP 생성 및 redis 저장 메서드
  public async generateOTP(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.storeOTP(email, otp);
    console.log(`Generated OTP for ${email}: ${otp}`);

    return otp;
  }

  //5. OTP 인증 메서드
  public async verifyOTP(email: string, OTPCode: string): Promise<object | { message: string }> {
    const storedOtp = await this.getOTP(email);
    if (!storedOtp) {
      throw new UnauthorizedException('The OTP has expired. Please request a new one.');
    }

    if (storedOtp !== OTPCode) {
      throw new UnauthorizedException('Incorrect OTP. Please try again.');
    }

    console.log('OTP verified successfully.');
    await this.deleteOTP(email);
    return { success: true };
  }

  //6. 메일 양식
  public writeEmailHtml(verifyCode: string): string {
    return `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h1 style="color: #333;">Welcome to Whisprr</h1>
            <p style="font-size: 16px; color: #666;">Your verification code is:</p>
            <p style="font-size: 36px; color:rgba(0, 123, 255, 0.45); font-weight: bold;">${verifyCode}</p> 
            <p style="font-size: 14px; color: #999;">Please enter this code to verify your email.</p>
          </div>
        `;
  }
}
