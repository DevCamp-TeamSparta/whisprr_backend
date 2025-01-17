import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from 'src/purchase/entities/purchase.entity';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntitiy)
    private userRepository: Repository<UserEntitiy>,
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
  ) {}
  async changeNickname(user: UserEntitiy, nickname: string) {
    return await this.userRepository.update({ user_id: user.user_id }, { nickname });
  }

  async getUserPlan(user: UserEntitiy) {
    return await this.purchaseRepository.find({
      where: {
        user,
      },
      relations: ['plan'],
    });
  }
}
