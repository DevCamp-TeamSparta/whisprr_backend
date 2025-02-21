import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { parse as uuidParse } from 'uuid';
import { stringify as uuidStringify } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { OtpService } from 'src/otp/otp.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly configService: ConfigService,
  ) {}

  //1. 토큰으로 유저 정보 조회 및 토큰 버젼 일치 검사
  public async findUserByUserInfo(
    userInfo: JwtPayload,
  ): Promise<UserEntity | { message: string; newToken: string }> {
    const user = await this.findUserByUserInfoWhitoutTokenVerify(userInfo);

    if (user.token_version !== userInfo.tokenVersion) {
      const newToken = await this.getUserToken(user.user_id);
      return {
        message: 'A new token has been issued due to expiration. Please retry',
        newToken,
      };
    }
    return user;
  }

  //1.1 토큰으로 유저 정보 조회
  public async findUserByUserInfoWhitoutTokenVerify(userInfo: JwtPayload): Promise<UserEntity> {
    const uuidBuffer = Buffer.from(uuidParse(userInfo.uuid) as Uint8Array);

    const user = await this.userRepository.findOne({
      where: {
        user_id: uuidBuffer,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  //1.2 uuid 만으로 유저 정보 조회 메소드
  public async findUser(uuid: Buffer) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: uuid,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  //2. 유저 생성 메소드
  private async createUser(email: string): Promise<{ uuid: string; message: string }> {
    const uuid = uuidv4();
    const uuidBuffer = Buffer.from(uuidParse(uuid) as Uint8Array);
    const newUser = this.userRepository.create({
      email,
      user_id: uuidBuffer,
      nickname: 'Unnamed user',
      created_at: new Date(),
    });

    await this.userRepository.save(newUser);

    return { uuid: uuid, message: `it's new user` };
  }

  //3.유저 닉네임 변경 메소드
  public async changeNickname(user: UserEntity, newNickname: string) {
    await this.userRepository.update({ user_id: user.user_id }, { nickname: newNickname });

    return await this.findUser(user.user_id);
  }

  //4. 유저토큰 발급 메소드
  public async getUserToken(Bufferuuid: Buffer) {
    const uuid = uuidStringify(Bufferuuid);

    await this.updateTokenVersion(Bufferuuid);

    const { freeTrialStatus, tokenVersion, planStatus } =
      await this.checkFreetrialAndPlanActive(Bufferuuid);

    const payload = { uuid, freeTrialStatus, tokenVersion, planStatus };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });
    return token;
  }

  //4.1 유저 토큰 발급 전 토큰 버젼 업데이트
  public async updateTokenVersion(uuid: Buffer) {
    await this.userRepository.increment({ user_id: uuid }, 'token_version', 1);
  }

  //4.2 유저 토큰 발급 전 무료 체험판 및 플랜 만료 여부 확인 및 토큰 버젼 저장
  private async checkFreetrialAndPlanActive(uuid: Buffer) {
    const user = await this.userRepository.findOne({
      where: { user_id: uuid },
      relations: ['purchases'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const purchase = user.purchases;
    let planStatus = 'non-available';
    if (purchase) {
      const isNotExpired = purchase.expiration_date > new Date(); // 만료 여부 확인
      if (isNotExpired) {
        planStatus = 'available';
      }
    }

    let trialStatus = 'non-available';
    if (user.trial_status === 'active') {
      trialStatus = 'available';
    }

    return { freeTrialStatus: trialStatus, tokenVersion: user.token_version, planStatus };
  }

  //5. 저널 생성 시 작성 횟수 업데이트

  public async updateWritingCount(user: UserEntity) {
    await this.userRepository.increment({ user_id: user.user_id }, 'writing_count', 1);

    return await this.updateUserTrialStatus(user);
  }

  //5.1 저널 생성 시 작성 횟 수 3회 이상 시 무료 체험판 종료
  private async updateUserTrialStatus(user: UserEntity) {
    const updatedUser = await this.findUser(user.user_id);

    if (updatedUser.writing_count >= 3 && updatedUser.trial_status !== 'expired') {
      await this.userRepository.update({ user_id: user.user_id }, { trial_status: 'expired' });
      return await this.getUserToken(user.user_id);
    }

    return undefined;
  }

  //6.email로 사용자 조회
  public async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  //7.email로 초기 사용자 생성 or 기존 사용자 반환
  public async createOrfindUserByEmail(
    email: string,
    verifyCode: string,
  ): Promise<{ uuid: string } | { message: string } | { uuid: string; message: string }> {
    await this.otpService.verifyOTP(email, verifyCode);

    const user = await this.findUserByEmail(email);
    if (user) {
      return { uuid: uuidStringify(user.user_id) };
    }
    const { uuid, message } = await this.createUser(email);
    return { uuid, message };
  }

  //8. email 로 user 계정 삭제
  public async deleteUserAccount(email: string): Promise<{ message: string }> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete({ email });
    return { message: `User ${email} account was deleted!` };
  }
}
