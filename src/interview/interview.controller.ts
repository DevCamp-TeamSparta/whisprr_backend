import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { JwtPayload, UserInfo } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { TrialAndPlanGuard } from 'src/common/guards/trialAndPlan.guard';
import { QuestionAnswerArrayDto } from './dto/QandAArray.dto';
import { InterviewDto } from './dto/start.interview.dto';

@Controller('interview')
export class InterviewController {
  constructor(
    private readonly interviewService: InterviewService,
    private readonly userService: UserService,
  ) {}

  //1. 회고 시작 시 인터뷰 칼럼 생성(회고 재시작 시 인터뷰 기록 비우고 재시작)
  @UseGuards(TrialAndPlanGuard)
  @Post()
  async startInterview(@UserInfo() userInfo: JwtPayload, @Body() InterviewDto: InterviewDto) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return this.interviewService.startInterview(user, InterviewDto.date);
  }

  //2. 1단위 질문마다 인터뷰 업데이트

  @UseGuards(TrialAndPlanGuard)
  @Patch(':date')
  async updateInterview(
    @UserInfo() userInfo: JwtPayload,
    @Param('date') date: Date,
    @Body() QandADto: QuestionAnswerArrayDto,
  ) {
    const QandAs = QandADto.interviews;
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return this.interviewService.updateInterview(user, date, QandAs);
  }
}
