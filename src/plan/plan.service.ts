import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from './entities/plan.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanEntity)
    private planRepository: Repository<PlanEntity>,
  ) {}

  async findPlan(planId: string) {
    const plan = await this.planRepository.findOne({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      throw new NotFoundException('plan not exist');
    }

    return plan;
  }
}
