import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { mockReportRepository } from './mocks/report.service.mocks';
import { UserService } from '../user/user.service';
import { mockUserService } from '../user/mocks/mock.user.service';
import { InterviewService } from '../interview/interview.service';
import { JournalService } from '../journal/journal.service';
import { mockJournalService } from '../journal/mocks/journal.service.mock';
import { mockInterviewService } from '../interview/mocks/interview.service.mock';

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: getRepositoryToken(ReportEntity), useValue: mockReportRepository },
        { provide: UserService, useValue: mockUserService },
        { provide: InterviewService, useValue: mockInterviewService },
        { provide: JournalService, useValue: mockJournalService },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
