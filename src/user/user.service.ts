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

  private async checkFreetrial(uuid: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: uuid },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.trial_status === 'active' ? 'available' : 'non-available';
  }

  private async checkPlanActive(uuid: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: uuid },
      relations: ['purchases'],
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let hasActivePlan = 'inactive';
    if (user.purchases) {
      hasActivePlan = user.purchases.status;
    }

    return hasActivePlan;
  }
}
