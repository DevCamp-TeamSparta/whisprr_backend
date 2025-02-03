import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { JwtPayload, UserInfo } from '../common/utils/user_info.decorator';
import { TrialAndPlanGuard } from '../common/guards/trialAndPlan.guard';
import { QuestionAnswerArrayDto } from './dto/QandAArray.dto';
import { InterviewDto } from './dto/start.interview.dto';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  //1. 회고 시작 시 인터뷰 칼럼 생성(회고 재시작 시 인터뷰 기록 비우고 재시작)
  @UseGuards(TrialAndPlanGuard)
  @Post()
  async startInterview(@UserInfo() userInfo: JwtPayload, @Body() InterviewDto: InterviewDto) {
    return this.interviewService.startInterview(userInfo, InterviewDto.date);
  }

  //2. 1단위 질문마다 인터뷰 업데이트

  @UseGuards(TrialAndPlanGuard)
  @Patch(':date')
  async updateInterview(
    @UserInfo() userInfo: JwtPayload,
    @Param('date') date: Date,
    @Body() QandADto: QuestionAnswerArrayDto,
  ) {
    return this.interviewService.updateInterview(
      userInfo,
      date,
      QandADto.interviews,
      QandADto.questionId,
    );
  }
}
