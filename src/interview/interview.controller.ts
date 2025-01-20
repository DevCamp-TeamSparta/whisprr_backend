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

  //1. 회고 시작 시 인터뷰 칼럼 생성
  @UseGuards(TrialAndPlanGuard)
  @Post()
  async startInterview(@UserInfo() userInfo: JwtPayload, @Body() InterviewDto: InterviewDto) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return this.interviewService.startInterview(user, InterviewDto.date);
  }

  //2. 1단위 질문마다 인터뷰 업데이트

  @UseGuards(TrialAndPlanGuard)
  @Patch(':id')
  async updateInterview(@Param('id') id: number, @Body() QandADto: QuestionAnswerArrayDto) {
    const QandAs = QandADto.interviews;
    return this.interviewService.updateInterview(id, QandAs);
  }
}
