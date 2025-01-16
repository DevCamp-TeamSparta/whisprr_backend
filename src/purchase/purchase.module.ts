import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from './entities/purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntity])],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
