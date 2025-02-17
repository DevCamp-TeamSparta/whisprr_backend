import { Module } from '@nestjs/common';
import { ParseAfterInterviewEntity } from './entities/parses.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ParseAfterInterviewEntity])],
  providers: [],
  exports: [],
})
export class ParsesModule {}
