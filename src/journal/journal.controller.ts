import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JournalService } from './journal.service';
import { TrialAndPlanGuard } from 'src/common/guards/trialAndPlan.guard';
import { JwtPayload, UserInfo } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { InterviewService } from 'src/interview/interview.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';

@Controller('journal')
export class JournalController {
  constructor(
    private journalService: JournalService,
    private userService: UserService,
    private interviewService: InterviewService,
    private openAiService: OpenAiService,
  ) {}

  @UseGuards(TrialAndPlanGuard)
  @Post()
  async createJournal(@UserInfo() userInfo: JwtPayload, @Body('interviewId') interviewId: number) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    const interview = await this.interviewService.findInterview(interviewId);
    const journal = await this.openAiService.getJournalByAI(interview.content);
    return await this.journalService.createJournal(user, journal);
  }

  @UseGuards(TrialAndPlanGuard)
  @Get()
  async getJournalList(@UserInfo() userInfo: JwtPayload) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.journalService.getJournalList(user);
  }

  @UseGuards(TrialAndPlanGuard)
  @Get(':id')
  async getJournal(@UserInfo() userInfo: JwtPayload, @Param('id') id: number) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.journalService.getJournal(user, id);
  }
}
