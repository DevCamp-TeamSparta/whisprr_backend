import { Module } from '@nestjs/common';
import { RestoreController } from './restore.controller';
import { RestoreService } from './restore.service';
import { PurchaseService } from 'src/purchase/purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from 'src/purchase/entities/purchase.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntity, UserEntity])],

  controllers: [RestoreController],
  providers: [RestoreService, PurchaseService, UserService, JwtService],
})
export class RestoreModule {}
