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
import { TrialAndPlanGuard } from '../common/guards/trialAndPlan.guard';
import { JwtPayload, UserInfo } from '../common/utils/user_info.decorator';
import { UserService } from '../user/user.service';
import { InterviewService } from '../interview/interview.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { JournalDto } from './dto/create_jornal.dto';
import { ModifyJournalDto } from './dto/modify_journal.dto';
import { UserGuard } from '../common/guards/user.guard';
import { InstructionService } from '../instruction/instruction.service';

@Controller('journal')
export class JournalController {
  constructor(
    private journalService: JournalService,
    private userService: UserService,
    private interviewService: InterviewService,
    private openAiService: OpenAiService,
    private instructionService: InstructionService,
  ) {}

  //1. 저널 생성(무료 체험판, 플랜 가입 여부 확인)
  @UseGuards(TrialAndPlanGuard)
  @Post()
  async createJournal(@UserInfo() userInfo: JwtPayload, @Body() jornalDto: JournalDto) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    const interview = await this.interviewService.findInterview(user, jornalDto.date);
    const instruction = await this.instructionService.getInstruction('journal');
    const journal = await this.openAiService.getJournalByAI(interview.content, instruction.content);
    return await this.journalService.createJournal(user, journal, jornalDto.date);
  }

  //2. 저널 목록 조회(무료 사용자  이용 가능 서비스)
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

  //3. 아이디별 저널 상세 조회(무료 사용자  이용 가능 서비스)
  @UseGuards(UserGuard)
  @Get('details/:id')
  async getJournal(@UserInfo() userInfo: JwtPayload, @Param('id') id: number) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.journalService.getJournal(user, id);
  }

  //4. 날짜별 저널 상세 조회(무료 사용자  이용 가능 서비스)
  @UseGuards(UserGuard)
  @Get(':date')
  async getJournalByDate(@UserInfo() userInfo: JwtPayload, @Param('date') date: Date) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.journalService.getJournalByDate(user, date);
  }

  //5. 날짜별 저널 삭제(무료 사용자  이용 가능 서비스)
  @UseGuards(UserGuard)
  @Delete(':date')
  async deleteJournal(@UserInfo() userInfo: JwtPayload, @Param('date') date: Date) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.journalService.deleteJournal(user, date);
  }

  //6. 날짜별 저널 수정(무료 체험판, 플랜 가입 여부 확인)
  @UseGuards(TrialAndPlanGuard)
  @Patch(':date')
  async updateJournal(
    @UserInfo() userInfo: JwtPayload,
    @Param('date') date: Date,

    @Body() modifyJournalDto: ModifyJournalDto,
  ) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    await this.journalService.updateJournal(user, date, modifyJournalDto);
    return await this.journalService.getJournalByDate(user, date);
  }
}
