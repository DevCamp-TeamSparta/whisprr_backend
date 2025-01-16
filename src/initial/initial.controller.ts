import { UserService } from 'src/user/user.service';
import { InitialService } from './initial.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';
import { TimeLimitService } from 'src/time_limit/time_limit.service';
import { InstructionService } from 'src/instruction/instruction.service';

@Controller('initial')
export class InitialController {
  constructor(
    private readonly userService: UserService,
    private readonly questionService: QuestionService,
    private readonly timeLimitService: TimeLimitService,
    private readonly instructionService: InstructionService,
  ) {}

  //1. 어플 설치 시 최초 1회 uuid 생성 요청
  @Post()
  async createNewUuid() {
    return await this.userService.createUser();
  }

  //2.어플 구동 시 질문, 발언 제한 시간, 인터뷰 지시사항 정보 요청
  @Get()
  async sendInitialSetting(@Headers('uuid') uuid: string) {
    if (!uuid) {
      throw new Error('UUID is missing in the headers');
    }
    const tocken = await this.userService.getUserTocken(uuid);
    const questions = await this.questionService.getQuestion();
    const limits = await this.timeLimitService.getTimeLimit();
    const instruction = await this.instructionService.getInterviewInstruction();

    const response = {
      bearer_token: tocken,
      questions,
      limits,
      instruction,
    };

    return response;
  }
}
