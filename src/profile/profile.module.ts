import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { PurchaseEntity } from 'src/purchase/entities/purchase.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntitiy, PurchaseEntity])],
  controllers: [ProfileController],
  providers: [ProfileService, UserService, JwtService],
})
export class ProfileModule {}
