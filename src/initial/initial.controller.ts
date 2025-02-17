import { UserService } from '../user/user.service';
import { BadRequestException, Controller, Get, Headers, Post } from '@nestjs/common';
import { QuestionService } from '../question/question.service';
import { InstructionService } from '../instruction/instruction.service';
import { ConfigService } from '@nestjs/config';
import { parse as uuidParse } from 'uuid';
import { ParsesService } from 'src/parses/parses.service';

@Controller('initial')
export class InitialController {
  constructor(
    private readonly userService: UserService,
    private readonly questionService: QuestionService,
    private readonly instructionService: InstructionService,
    private readonly configService: ConfigService,
    private readonly parseService: ParsesService,
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
      throw new BadRequestException('UUID is missing in the headers');
    }
    const pareduuid = Buffer.from(uuidParse(uuid));
    const token = await this.userService.getUserToken(pareduuid);
    const questions = await this.questionService.getQuestion();
    const limits = Number(this.configService.get<number>('TIMELIMIT'));
    const instruction = await this.instructionService.getInstruction('interview');
    const parses = await this.parseService.getParses();

    const response = {
      bearer_token: token,
      questions,
      limits,
      instruction,
      parses,
    };

    return response;
  }
}
