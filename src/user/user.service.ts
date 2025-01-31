import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/utils/user_info.decorator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  //1.1 토큰으로 유저 정보 조회 및 토큰 버젼 일치 검사
  async findUserByUserInfo(
    userInfo: JwtPayload,
  ): Promise<UserEntity | { message: string; newToken: string }> {
    const user = await this.userRepository.findOne({
      where: {
        user_id: userInfo.uuid,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.token_version !== userInfo.tokenVersion) {
      const newToken = await this.getUserTocken(user.user_id);
      return {
        message: 'A new token has been issued due to expiration. Please retry',
        newToken,
      };
    }
    return user;
  }

  //1.2 uuid 만으로 유저 정보 조회 메소드
  async findUser(uuid: string) {
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
  async createUser() {
    const newUser = this.userRepository.create({
      user_id: uuidv4(),
      nickname: '무명',
      created_at: new Date(),
    });

    await this.userRepository.save(newUser);

    return { uuid: newUser.user_id };
  }

  //3.유저 닉네임 변경 메소드
  async changeNickname(userInfo: JwtPayload, newNickname: string) {
    await this.findUserByUserInfo(userInfo);

    await this.userRepository.update({ user_id: userInfo.uuid }, { nickname: newNickname });

    return await this.findUser(userInfo.uuid);
  }

  //4. 유저토큰 발급 메소드
  async getUserTocken(uuid: string) {
    await this.updateTokenVersion(uuid);

    const { freeTrialStatus, tokenVersion } = await this.checkFreetrial(uuid);
    const planStatus = await this.checkPlanActive(uuid);

    const payload = { uuid, freeTrialStatus, tokenVersion, planStatus };
    const token = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET_KEY });
    return token;
  }

  //4.1 유저 토큰 발급 전 토큰 버젼 업데이트
  async updateTokenVersion(uuid: string) {
    await this.userRepository.increment({ user_id: uuid }, 'token_version', 1);
  }

  //4.2 유저 토큰 발급 전 무료 체험판 만료 여부 확인 및 토큰 버젼 저장
  private async checkFreetrial(uuid: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: uuid },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let trialStatus = 'non-available';
    if (user.trial_status === 'active') {
      trialStatus = 'available';
    }

    return { freeTrialStatus: trialStatus, tokenVersion: user.token_version };
  }

  //4.3 유저 토큰 발급 전 플랜 만료 확인
  private async checkPlanActive(uuid: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: uuid },
      relations: ['purchases'],
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const purchase = user.purchases;

    if (purchase) {
      const isNotExpired = purchase.expiration_date > new Date(); // 만료 여부 확인

      if (isNotExpired) {
        return 'available';
      }
    }

    // 구매 내역이 없거나 비활성화된 경우
    return 'non-available';
  }

  //5. 저널 생성 시 작성 횟수 업데이트
  async updateWritingCount(user: UserEntity) {
    await this.userRepository.increment({ user_id: user.user_id }, 'writing_count', 1);

    return await this.updateUserTrialStatus(user);
  }

  //5.1 저널 생성 시 작성 횟 수 3회 이상 시 무료 체험판 종료
  private async updateUserTrialStatus(user: UserEntity) {
    const updatedUser = await this.findUser(user.user_id);

    if (updatedUser.writing_count >= 3 && updatedUser.trial_status !== 'expired') {
      await this.userRepository.update({ user_id: user.user_id }, { trial_status: 'expired' });
      return await this.getUserTocken(user.user_id);
    }

    return undefined;
  }
}
