import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
  constructor(private configService: ConfigService) {}
  private otpStore: Record<string, { otp: string; expiresAt: number }> = {};

  public async sendVerifyEmail(email: string): Promise<{ message: string }> {
    const OTPCode = this.generateOTP(email);
    const message = this.writeEmailHtml(OTPCode);
    const emailAdress = this.configService.get<string>('YOUR_EMAIL');
    const appPassword = this.configService.get<string>('APP_PASSWORD');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailAdress,
        pass: appPassword,
      },
    });

    const info = await transporter.sendMail({
      from: '"whisprr" <your-email@gmail.com>',
      to: email,
      subject: 'whisprr verify',
      text: 'welcome!',
      html: message,
    });

    return { message: `Verification mail sent!: ${info.messageId}` };
  }

  public generateOTP(email: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 2 * 60 * 1000;
    this.otpStore[email] = { otp, expiresAt };
    console.log(`Generated OTP for ${email}: ${otp}`);

    return otp;
  }

  public verifyOTP(email: string, OTPCode: string): boolean {
    const storedOtp = this.otpStore[email];
    if (!storedOtp) {
      console.log('No OTP found for this email.');
      return false;
    }

    if (Date.now() > storedOtp.expiresAt) {
      console.log('OTP has expired.');
      delete this.otpStore[email];
      return false;
    }

    if (storedOtp.otp !== OTPCode) {
      console.log('Incorrect OTP.');
      return false;
    }

    console.log('OTP verified successfully.');
    delete this.otpStore[email];
    return true;
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
