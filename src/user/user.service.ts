import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntitiy } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntitiy)
    private userRepository: Repository<UserEntitiy>,
    private readonly jwtService: JwtService,
  ) {}

  //1. 유저 정보 조회 메소드
  async findUserInfos(user_id: string) {
    const user = await this.userRepository.findOne({
      where: {
        user_id,
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

    return newUser.user_id;
  }

  //3.유저 닉네임 변경 메소드
  async changeNickname(uuid: string, newNickname: string) {
    await this.findUserInfos(uuid);

    await this.userRepository.update({ user_id: uuid }, { nickname: newNickname });

    return await this.findUserInfos(uuid);
  }

  //4. 유저토큰 발급 메소드
  async getUserTocken(uuid: string) {
    const freeTrialStatus = await this.checkFreetrial(uuid);
    const planStatus = await this.checkPlanActive(uuid);

    const payload = { uuid, sub: { uuid, freeTrialStatus, planStatus } };
    const token = this.jwtService.sign(payload);
    return token;
  }

  //4.1 유저 토큰 발급 전 무료 체험판 여부 확인
  private async checkFreetrial(uuid: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: uuid },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.trial_status === 'active' ? 'available' : 'non-available';
  }

  //4.2 유저 토큰 발급 전 플랜 만료 확인
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
  async updateWritingCount(user: UserEntitiy) {
    await this.userRepository.increment({ user_id: user.user_id }, 'writing_count', 1);

    this.updateUserTrialStatus(user);
  }

  //5.1 저널 생성 시 작성 횟 수 3회 이상 시 무료 체험판 종료
  private async updateUserTrialStatus(user: UserEntitiy) {
    const updatedUser = await this.findUserInfos(user.user_id);

    if (updatedUser.writing_count >= 3) {
      await this.userRepository.update({ user_id: user.user_id }, { trial_status: 'expired' });
    }
  }
}
