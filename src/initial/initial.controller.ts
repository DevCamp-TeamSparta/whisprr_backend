import { UserService } from '../user/user.service';
import { BadRequestException, Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { QuestionService } from '../question/question.service';
import { InstructionService } from '../instruction/instruction.service';
import { ConfigService } from '@nestjs/config';
import { parse as uuidParse } from 'uuid';
import { InitialDto } from './dto/initial.dto';
import { OtpService } from 'src/otp/otp.service';

@Controller('initial')
export class InitialController {
  constructor(
    private readonly userService: UserService,
    private readonly questionService: QuestionService,
    private readonly instructionService: InstructionService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  @Post('/verify')
  async sendVerifyEmail(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is missing in the body');
    }
    return await this.otpService.sendVerifyEmail(email);
  }

  //2. 어플 설치 시 최초 1회 uuid 생성 요청
  @Post()
  async createOrRestoreUser(
    @Body() initialDto: InitialDto,
  ): Promise<{ uuid: string } | { message: string } | { uuid: string; message: string }> {
    return await this.userService.createOrfindUserByEmail(initialDto.email, initialDto.verifyCode);
  }

  //3.어플 구동 시 질문, 발언 제한 시간, 인터뷰 지시사항 정보 요청
  @Get()
  async sendInitialSetting(@Headers('uuid') uuid: string) {
    if (!uuid) {
      throw new BadRequestException('UUID is missing in the headers');
    }
    const pareduuid = Buffer.from(uuidParse(uuid));
    const token = await this.userService.getUserToken(pareduuid);
    const questions = await this.questionService.getQuestion(pareduuid);
    const limits = Number(this.configService.get<number>('TIMELIMIT'));
    const instruction = await this.instructionService.getInstruction('interview');

    const response = {
      bearer_token: token,
      questions,
      limits,
      instruction,
    };

    return response;
  }
}
