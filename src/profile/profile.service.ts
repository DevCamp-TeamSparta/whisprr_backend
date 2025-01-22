import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { PurchaseStatus } from '../purchase/utils/purchase.status';
import { UserEntity } from '../user/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
  ) {}

  //1. 닉네임 변경
  async changeNickname(user: UserEntity, nickname: string) {
    await this.userRepository.update({ user_id: user.user_id }, { nickname });
    return await this.userRepository.findOne({ where: { user_id: user.user_id } });
  }

  //2. 가입된 플랜 확인(구매 정보 함께 반환)
  async getUserPlan(user: UserEntity) {
    const plan = await this.purchaseRepository.findOne({
      where: {
        user,
        expiration_date: MoreThan(new Date()),
      },
      relations: ['plan'],
    });

    if (!plan) {
      return { message: 'You are not subscribed to any plan currently' };
    }

    return plan;
  }
}
