import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../common/utils/user_info.decorator';
import { parse as uuidParse } from 'uuid';
import { ReportDto } from './dto/report.dto';

import { stringify as uuidStringify } from 'uuid';
import { InterviewService } from '../interview/interview.service';
import { JournalService } from '../journal/journal.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,

    private userService: UserService,
    private interviewService: InterviewService,
    private journalService: JournalService,
  ) {}

  //1. 신고 기록 생성
  public async createReport(userInfo: JwtPayload, reportDto: ReportDto) {
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);
    await this.journalService.getJournalByDateWithoutUserVerify(user, reportDto.journalDate);

    const report = this.reportRepository.create({
      user: user,
      reported_at: new Date(),
      user_defined_reason: reportDto.userDefinedReason,
      journal_date: reportDto.journalDate,
      reason: reportDto.reason,
    });
    await this.reportRepository.save(report);
    return { messaga: 'report was accepted.' };
  }

  //2. 신고목록 열람(관리자 열람용)

  public async getAllReport() {
    const reports = await this.reportRepository.find({ relations: ['user'] });
    const mappedReports = reports.map((report) => ({
      id: report.id,
      user_id: uuidStringify(report.user.user_id),
      reported_at: report.reported_at,
      reason: report.reason,
      user_defined_reason: report.user_defined_reason,
    }));

    return mappedReports;
  }

  //3. 유저별 신고 목록 열람(관리자 열람용)

  public async getUserReport(uuid: string) {
    const uuidBuffer = Buffer.from(uuidParse(uuid) as Uint8Array);
    const user = await this.userService.findUser(uuidBuffer);

    const reports = await this.reportRepository.find({ where: { user }, relations: ['user'] });

    const mappedReports = reports.map((report) => ({
      id: report.id,
      user_id: uuidStringify(report.user.user_id),
      reported_at: report.reported_at,
      reason: report.reason,
      user_defined_reason: report.user_defined_reason,
    }));

    return mappedReports;
  }

  //4. 신고 아이디별 신고 상세 열람(관리자 열람용)

  public async getReportById(id: number) {
    const report = await this.reportRepository.findOne({ where: { id }, relations: ['user'] });
    const interview = await this.interviewService.findInterview(report.user, report.journal_date);
    const journal = await this.journalService.getJournalByDateWithoutUserVerify(
      report.user,
      report.journal_date,
    );

    const organizedInterview = {
      id: interview.id,
      date: interview.date,
      created_at: interview.created_at,
      content: interview.content,
    };

    const organizedJournal = {
      id: journal.id,
      date: journal.date,
      created_at: journal.created_at,
      title: journal.title,
      keyword: journal.keyword,
      content: journal.content,
    };
    const response = {
      id: report.id,
      user_id: uuidStringify(report.user.user_id),
      reported_at: report.reported_at,
      reason: report.reason,
      user_defined_reason: report.user_defined_reason,
      interview: organizedInterview,
      journal: organizedJournal,
    };

    return response;
  }
}
