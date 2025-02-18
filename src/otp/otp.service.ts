import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { OAuth2Service } from './oauth2.service';

@Injectable()
export class OtpService {
  constructor(
    private configService: ConfigService,
    private oauth2Service: OAuth2Service,
  ) {}
  private otpStore: Record<string, { otp: string; expiresAt: number }> = {};

  public async sendVerifyEmail(email: string): Promise<{ message: string }> {
    const OTPCode = this.generateOTP(email);
    const message = this.writeEmailHtml(OTPCode);
    const transporter = await this.createTransporter();
    const emailAdress = this.getEmailAddress();

    const info = await transporter.sendMail({
      from: `"whisprr" <${emailAdress}>`,
      to: email,
      subject: 'whisprr verify',
      text: 'welcome!',
      html: message,
    });

    return { message: `Verification mail sent!: ${info.messageId}` };
  }

  public async createTransporter() {
    const emailAdress = this.getEmailAddress();

    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');
    const refreshToken = this.configService.get<string>('REFRESH_TOKEN');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        user: emailAdress,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
    });
    return transporter;
  }

  private getEmailAddress(): string {
    return this.configService.get<string>('YOUR_EMAIL');
  }

  public generateOTP(email: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 2 * 60 * 1000;
    this.otpStore[email] = { otp, expiresAt };
    console.log(`Generated OTP for ${email}: ${otp}`);

    return otp;
  }

  public verifyOTP(email: string, OTPCode: string): object | { message: string } {
    const storedOtp = this.otpStore[email];
    if (!storedOtp) {
      throw new BadRequestException(
        'No OTP found for this email address. Please request a new one.',
      );
    }

    if (Date.now() > storedOtp.expiresAt) {
      delete this.otpStore[email];

      throw new UnauthorizedException('The OTP has expired. Please request a new one.');
    }

    if (storedOtp.otp !== OTPCode) {
      throw new UnauthorizedException('Incorrect OTP. Please try again.');
    }

    console.log('OTP verified successfully.');
    return { success: true };
  }

  public writeEmailHtml(verifyCode: string): string {
    return `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h1 style="color: #333;">Welcome to Whisprr</h1>
            <p style="font-size: 16px; color: #666;">Your verification code is:</p>
            <p style="font-size: 36px; color: #007BFF; font-weight: bold;">${verifyCode}</p> 
            <p style="font-size: 14px; color: #999;">Please enter this code to verify your email.</p>
          </div>
        `;
  }
}
