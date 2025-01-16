import { Module } from '@nestjs/common';
import { InitialController } from './initial.controller';
import { InitialService } from './initial.service';

@Module({
  controllers: [InitialController],
  providers: [InitialService]
})
export class InitialModule {}
