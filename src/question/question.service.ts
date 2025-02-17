import { Injectable } from '@nestjs/common';
import { QuestionEntity } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomQuestionEntity } from './entities/user.custom.question.entity';
import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { CustomQuestionsDto } from './dto/custom.question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    @InjectRepository(CustomQuestionEntity)
    private customQuestionRepository: Repository<CustomQuestionEntity>,
    private userService: UserService,
  ) {}

  // 1. 초기 질문 조회
  async getQuestion(uuid: Buffer) {
    return await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect(
        'question.user_custom_questions',
        'custom_questions',
        'custom_questions.user.user_id = :uuid',
        { uuid },
      )
      .getMany();
  }

  //2. 사용자 커스텀 질문 조회
  async getUserCustomQuestion(userInfo: JwtPayload): Promise<object[]> {
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);
    const customedQuestions = await this.customQuestionRepository.find({
      where: { user: { user_id: user.user_id } },
      relations: ['questions'],
    });

    const mappedCustomQuestions = customedQuestions.map((question) => ({
      id: question.questions.id,
      customed_question: question.customed_question,
    }));
    return mappedCustomQuestions;
  }

  //3.사용자 커스텀 질문 생성
  async createUserCustomQuestion(
    userInfo: JwtPayload,
    customQuestionsDto: CustomQuestionsDto,
  ): Promise<{ message: string }> {
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);

    await this.customQuestionRepository.upsert(
      customQuestionsDto.questions.map((question) => ({
        user: { user_id: user.user_id },
        questions: { id: question.questionNumber },
        customed_question: question.content,
      })),
      ['user', 'questions'],
    );

    return { message: 'User custom questions updated successfully' };
  }

  //4.사용자 커스텀 질문 초기화(삭제)
  async initCustomQuestion(userInfo: JwtPayload): Promise<{ message: string }> {
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);
    await this.customQuestionRepository.delete({ user });

    return { message: 'User custom questions deleted successfully' };
  }
}
