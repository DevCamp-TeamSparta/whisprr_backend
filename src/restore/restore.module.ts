import { Module } from '@nestjs/common';
import { RestoreController } from './restore.controller';
import { PurchaseService } from 'src/purchase/purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from 'src/purchase/entities/purchase.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PlanService } from 'src/plan/plan.service';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { OtpService } from 'src/otp/otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntity, UserEntity, PlanEntity])],

  controllers: [RestoreController],
  providers: [PurchaseService, UserService, JwtService, PlanService, OtpService],
})
export class RestoreModule {}
