import { Injectable } from '@nestjs/common';
import { QuestionEntity } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
  ) {}
  async getQuestion() {
    return await this.questionRepository.find();
  }
}
