import { Module } from '@nestjs/common';
import { TimeLimitService } from './time_limit.service';
import { TimeLimitEntity } from './entities/time_limit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TimeLimitEntity])],
  providers: [TimeLimitService],
  exports: [TimeLimitService],
})
export class TimeLimitModule {}
