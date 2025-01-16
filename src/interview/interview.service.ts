import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterviewEntity } from './entities/interview.entity';
import { UserEntitiy } from '../user/entities/user.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(InterviewEntity)
    private interviewRepository: Repository<InterviewEntity>,
  ) {}
  async startInterview(user: UserEntitiy) {
    const newInterview = this.interviewRepository.create({
      user: user,
      content: [],
      created_at: new Date(),
    });

    await this.interviewRepository.save(newInterview);

    return newInterview;
  }

  async updateInterview(id: number, QandAs: object[]) {
    const interview = await this.findInterview(id);

    const newContent = [...interview.content, ...QandAs];
    await this.interviewRepository.update({ id: interview.id }, { content: newContent });

    const updatedInterview = await this.findInterview(id);

    return updatedInterview;
  }

  async findInterview(id: number) {
    const interview = await this.interviewRepository.findOne({
      where: { id },
    });
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }
    return interview;
  }
}
