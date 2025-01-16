import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';

@Module({
  controllers: [],
  providers: [QuestionService]
})
export class QuestionModule {}
