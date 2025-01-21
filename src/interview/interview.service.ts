import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  //1. 회고 시작 시 인터뷰 기록 생성
  async startInterview(user: UserEntitiy, date: Date) {
    await this.findInterviewAlready(user, date);
    const newInterview = this.interviewRepository.create({
      user: user,
      content: [],
      created_at: new Date(),
      date,
    });

    await this.interviewRepository.save(newInterview);

    return newInterview;
  }

  //1.1 회고 시작 시 해당 날짜에 이미 생성된 인터뷰 기록 있는 지 확인
  private async findInterviewAlready(user: UserEntitiy, date: Date) {
    const interview = await this.interviewRepository.findOne({ where: { user, date } });

    if (interview) {
      await this.restartInterview(user, date);
    } else {
      return;
    }
  }

  //1.2 만약 해당 날짜에 인터뷰 기록이 있다면 비우고 다시 시작
  private async restartInterview(user: UserEntitiy, date: Date) {
    await this.interviewRepository.update({ user, date }, { content: [] });
    const interview = await this.findInterview(user, date);
    return interview;
  }

  //2. 회고 질문 1단위 질문 시 마다 인터뷰 내용 업데이트
  async updateInterview(user: UserEntitiy, date: Date, QandAs: object[]) {
    const interview = await this.findInterview(user, date);

    const newContent = [...interview.content, ...QandAs];
    await this.interviewRepository.update({ date }, { content: newContent });

    const updatedInterview = await this.findInterview(user, date);

    return updatedInterview;
  }

  // 1.3. & 2.1. 인터뷰 업데이트 전 해당 날찌의 인터뷰 기록 존재 여부 확인
  async findInterview(user: UserEntitiy, date: Date) {
    const interview = await this.interviewRepository.findOne({
      where: { user, date },
    });
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }
    return interview;
  }

  // // 3. 저널 생성 전 아이디로 인터뷰 조회 (필요 없을 시 삭제)
  // async findInterviewById(id: number) {
  //   const interview = await this.interviewRepository.findOne({
  //     where: { id },
  //   });
  //   if (!interview) {
  //     throw new NotFoundException('Interview not found');
  //   }
  //   return interview;
  // }
}
