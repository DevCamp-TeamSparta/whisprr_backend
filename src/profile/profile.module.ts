import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { PurchaseEntity } from 'src/purchase/entities/purchase.entity';
import { JwtService } from '@nestjs/jwt';
import { PurchaseService } from 'src/purchase/purchase.service';
import { PlanService } from 'src/plan/plan.service';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PurchaseEntity, PlanEntity])],
  controllers: [ProfileController],
  providers: [PurchaseService, UserService, JwtService, PlanService, ProfileService],
})
export class ProfileModule {}
