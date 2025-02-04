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
import { JournalDto } from './dto/create_jornal.dto';
import { ModifyJournalDto } from './dto/modify_journal.dto';
import { UserGuard } from '../common/guards/user.guard';
import { JournalEntity } from './entities/journal.entity';
interface ReturnedJournal extends JournalEntity {
  jwtToken: string;
}

@Controller('journal')
export class JournalController {
  constructor(private journalService: JournalService) {}

  //1. 저널 생성(무료 체험판, 플랜 가입 여부 확인)
  @UseGuards(TrialAndPlanGuard)
  @Post()
  async createJournal(
    @UserInfo() userInfo: JwtPayload,
    @Body() journalDto: JournalDto,
  ): Promise<Partial<ReturnedJournal> | { message: string; newToken: string }> {
    return await this.journalService.createJournal(userInfo, journalDto);
  }

  //2. 저널 목록 조회(무료 사용자  이용 가능 서비스)
  @UseGuards(UserGuard)
  @Get()
  async getJournalList(
    @UserInfo() userInfo: JwtPayload,
    @Query('lastDate') lastDate?: string,
    @Query('limit') limit: number = 5,
  ): Promise<JournalEntity[] | { message: string; newToken: string }> {
    const effectiveLastDate = lastDate ? new Date(lastDate) : new Date();
    return await this.journalService.getJournalList(userInfo, effectiveLastDate, limit);
  }

  //3. 날짜별 저널 상세 조회(무료 사용자  이용 가능 서비스)
  @UseGuards(UserGuard)
  @Get(':date')
  async getJournalByDate(
    @UserInfo() userInfo: JwtPayload,
    @Param('date') date: Date,
  ): Promise<
    | {
        journalData: JournalEntity | null;
        questionIds: number[];
        message?: string;
      }
    | { message: string }
  > {
    return await this.journalService.getJournalByDate(userInfo, date);
  }

  //4. 날짜별 저널 삭제(무료 사용자  이용 가능 서비스)
  @UseGuards(UserGuard)
  @Delete(':date')
  async deleteJournal(
    @UserInfo() userInfo: JwtPayload,
    @Param('date') date: Date,
  ): Promise<{ message: string }> {
    return await this.journalService.deleteJournal(userInfo, date);
  }

  //5. 날짜별 저널 수정(무료 체험판, 플랜 가입 여부 확인)
  @UseGuards(TrialAndPlanGuard)
  @Patch(':date')
  async updateJournal(
    @UserInfo() userInfo: JwtPayload,
    @Param('date') date: Date,

    @Body() modifyJournalDto: ModifyJournalDto,
  ): Promise<JournalEntity | { message: string; newToken: string }> {
    return await this.journalService.updateJournal(userInfo, date, modifyJournalDto);
  }
}
