import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('OtpService', () => {
  let otpService: OtpService;
  let transporterMock: any;

  beforeEach(async () => {
    transporterMock = {
      sendMail: jest.fn().mockResolvedValue({ messageId: '12345' }),
    };
    (nodemailer.createTransport as jest.Mock).mockReturnValue(transporterMock);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'YOUR_EMAIL') return 'test@example.com';
              if (key === 'APP_PASSWORD') return 'password123';
              return null;
            }),
          },
        },
      ],
    }).compile();

    otpService = module.get<OtpService>(OtpService);
  });

  describe('sendVerifyEmail', () => {
    it('should send a verification email and return a message', async () => {
      const email = 'user@example.com';
      const result = await otpService.sendVerifyEmail(email);

      expect(transporterMock.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: '"whisprr" <test@example.com>',
          to: email,
          subject: 'whisprr verify',
        }),
      );
      expect(result).toEqual({ message: 'Verification mail sent!: 12345' });
    });
  });

  describe('generateOTP', () => {
    it('should generate a 6-digit OTP and store it with an expiration time', () => {
      const email = 'user@example.com';
      const otp = otpService.generateOTP(email);

      expect(otp).toHaveLength(6);
      expect(otpService['otpStore'][email]).toBeDefined();
      expect(otpService['otpStore'][email].otp).toBe(otp);
      expect(otpService['otpStore'][email].expiresAt).toBeGreaterThan(Date.now());
    });
  });

  describe('verifyOTP', () => {
    it('should verify a valid OTP and return success', async () => {
      const email = 'user@example.com';
      const otp = await otpService.generateOTP(email);

      const result = otpService.verifyOTP(email, otp);

      expect(result).toEqual({ success: true });
    });

    it('should return an error if OTP does not exist', () => {
      const result = otpService.verifyOTP('nonexistent@example.com', '123456');

      expect(result).toEqual({
        message: 'No OTP found for this email address. Please request a new one.',
      });
    });

    it('should return an error if OTP is expired', () => {
      const email = 'user@example.com';
      otpService['otpStore'][email] = { otp: '123456', expiresAt: Date.now() - 1000 };

      const result = otpService.verifyOTP(email, '123456');

      expect(result).toEqual({ message: 'The OTP has expired. Please request a new one.' });
    });

    it('should return an error if OTP is incorrect', () => {
      const email = 'user@example.com';
      otpService.generateOTP(email);

      const result = otpService.verifyOTP(email, 'wrongOTP');

      expect(result).toEqual({ message: 'Incorrect OTP. Please try again.' });
    });
  });
});
