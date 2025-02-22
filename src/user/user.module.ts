import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OtpService } from 'src/otp/otp.service';
import { RedisService } from 'src/otp/redis.service';
import { OAuth2Service } from 'src/otp/oAuth2.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UserService, OtpService, JwtService, RedisService, OAuth2Service],
  exports: [UserService],
})
export class UserModule {}
