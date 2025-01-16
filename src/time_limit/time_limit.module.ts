import { Module } from '@nestjs/common';
import { TimeLimitService } from './time_limit.service';

@Module({
  providers: [TimeLimitService]
})
export class TimeLimitModule {}
