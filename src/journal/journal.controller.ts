import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JournalService } from './journal.service';
import { TrialAndPlanGuard } from 'src/common/guards/trialAndPlan.guard';
import { JwtPayload, UserInfo } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { InterviewService } from 'src/interview/interview.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { JournalEntity } from './entities/journal.entity';
import { JournalDto } from './dto/create_jornal.dto';
import { ModifyJournalDto } from './dto/modify_journal.dto';
import { UserGuard } from 'src/common/guards/user.guard';

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
  async createJournal(@UserInfo() userInfo: JwtPayload, @Body() jornalDto: JournalDto) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    const interview = await this.interviewService.findInterview(jornalDto.interviewId);
    const journal = await this.openAiService.getJournalByAI(interview.content);
    return await this.journalService.createJournal(user, journal, jornalDto.date);
  }

  //일기 리스트 조회 가드 수정 필요
  @UseGuards(UserGuard)
  @Get()
  async getJournalList(
    @UserInfo() userInfo: JwtPayload,
    @Query('lastDate') lastDate?: string,
    @Query('limit') limit: number = 5,
  ) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    const effectiveLastDate = lastDate ? new Date(lastDate) : new Date();

    return await this.journalService.getJournalList(user, effectiveLastDate, limit);
  }

  //일기 조회 가드 수정 필요
  @UseGuards(UserGuard)
  @Get('details/:id')
  async getJournal(@UserInfo() userInfo: JwtPayload, @Param('id') id: number) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.journalService.getJournal(user, id);
  }

  //날짜별 일기 조회 가드 수정 필요
  @UseGuards(UserGuard)
  @Get(':date')
  async getJournalByDate(@UserInfo() userInfo: JwtPayload, @Param('date') date: Date) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.journalService.getJournalByDate(user, date);
  }

  @UseGuards(TrialAndPlanGuard)
  @Delete(':id')
  async deleteJournal(@UserInfo() userInfo: JwtPayload, @Param('id') id: number) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.journalService.deleteJournal(user, id);
  }

  @UseGuards(TrialAndPlanGuard)
  @Patch(':id')
  async updateJournal(
    @UserInfo() userInfo: JwtPayload,
    @Param('id') id: number,
    @Body() modifyJournalDto: ModifyJournalDto,
  ) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.journalService.updateJournal(user, id, modifyJournalDto);
  }
}
