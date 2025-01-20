import { Module } from '@nestjs/common';
import { RestoreController } from './restore.controller';
import { RestoreService } from './restore.service';
import { PurchaseService } from 'src/purchase/purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from 'src/purchase/entities/purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntity])],

  controllers: [RestoreController],
  providers: [RestoreService, PurchaseService],
})
export class RestoreModule {}
