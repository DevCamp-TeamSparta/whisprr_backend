import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity])],
  providers: [PlanService],
})
export class PlanModule {}
