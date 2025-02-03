import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterviewEntity } from './entities/interview.entity';
import { UserEntity } from '../user/entities/user.entity';
import { QuestionAnswerDto } from './dto/questionAndAnswer.dto';
import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { JournalService } from 'src/journal/journal.service';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(InterviewEntity)
    private interviewRepository: Repository<InterviewEntity>,
    private userService: UserService,
    @Inject(forwardRef(() => JournalService))
    private journalService: JournalService,
  ) {}

  //1. 회고 시작 시 인터뷰 기록 생성
  async startInterview(userInfo: JwtPayload, date: Date) {
    const user = await this.userService.findUserByUserInfo(userInfo);
    if ('message' in user) {
      return user;
    }

    await this.journalService.cheskJournalExist(user, date);
    await this.journalService.checkJournalCreationAvailbility(user, date);
    const existingInterview = await this.findInterviewAlready(user, date);

    if (existingInterview) {
      return existingInterview;
    }

    const newInterview = this.interviewRepository.create({
      user: user,
      content: [],
      created_at: new Date(),
      date,
    });

    await this.interviewRepository.save(newInterview);

    const Interview = {
      id: newInterview.id,
      content: newInterview.content,
      date: newInterview.date,
      question_id: newInterview.question_id,
      created_at: newInterview.created_at,
      deleted_at: newInterview.deleted_at,
    };
    return Interview;
  }

  //1.1 회고 시작 시 해당 날짜에 이미 생성된 인터뷰 기록 있는 지 확인
  private async findInterviewAlready(user: UserEntity, date: Date) {
    const interview = await this.interviewRepository.findOne({ where: { user, date } });

    if (interview) {
      return interview;
    } else {
      return null;
    }
  }

  //2. 회고 질문 1단위 질문 시 마다 인터뷰 내용 업데이트
  async updateInterview(
    userInfo: JwtPayload,
    date: Date,
    QandAs: QuestionAnswerDto[],
    questionId: number,
  ) {
    const user = await this.userService.findUserByUserInfo(userInfo);
    if ('message' in user) {
      return user;
    }
    const interview = await this.findInterview(user, date);

    const existingContent = interview.content.map((item) =>
      typeof item === 'string' ? JSON.parse(item) : item,
    );

    const newContent = [...existingContent, ...QandAs];
    const questionIds = Array.isArray(interview.question_id)
      ? [...interview.question_id, questionId]
      : [interview.question_id, questionId].filter((id) => id !== null);

    const serializedContent = newContent.map((item) => JSON.stringify(item));

    await this.interviewRepository.update(
      { date },
      { content: serializedContent, question_id: questionIds },
    );

    const updatedInterview = await this.findInterview(user, date);

    return updatedInterview;
  }

  // 1.3. & 2.1. 인터뷰 업데이트 전 해당 날찌의 인터뷰 기록 존재 여부 확인
  async findInterview(user: UserEntity, date: Date) {
    const interview = await this.interviewRepository.findOne({
      where: { user, date },
    });
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }
    return interview;
  }

  //3. 만약 해당 날짜에 인터뷰 기록이 있다면 비우고 다시 시작
  async resetInterview(user: UserEntity, date: Date) {
    await this.interviewRepository.update({ user, date }, { content: [], question_id: null });
  }
}
