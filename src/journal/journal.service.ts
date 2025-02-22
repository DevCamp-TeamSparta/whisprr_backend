import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JournalEntity } from './entities/journal.entity';
import { Between, LessThan, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Journal, OpenAiService } from '../open-ai/open-ai.service';
import { ModifyJournalDto } from './dto/modify_journal.dto';
import { UserService } from '../user/user.service';
import { JournalCreationEntity } from './entities/journal.creation.entity';
import { startOfDay, endOfDay } from 'date-fns';
import { JwtPayload } from '../common/utils/user_info.decorator';
import { JournalDto } from './dto/create_jornal.dto';
import { InterviewService } from '../interview/interview.service';
import { InstructionService } from '../instruction/instruction.service';
import { OriginalJournalEntity } from './entities/original.jounal.entity';

interface ReturnedJournal extends JournalEntity {
  jwtToken: string;
}

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntity)
    private journalRepository: Repository<JournalEntity>,
    @InjectRepository(JournalCreationEntity)
    private journalCreationRepository: Repository<JournalCreationEntity>,
    private userService: UserService,
    @Inject(forwardRef(() => InterviewService))
    private interviewService: InterviewService,
    private instructionService: InstructionService,
    private openAiService: OpenAiService,
    @InjectRepository(OriginalJournalEntity)
    private originalJournalRepository: Repository<OriginalJournalEntity>,
  ) {}

  //1. 저널 생성
  public async createJournal(
    userInfo: JwtPayload,
    jornalDto: JournalDto,
  ): Promise<Partial<ReturnedJournal> | { message: string; newToken: string }> {
    const user = await this.userService.findUserByUserInfo(userInfo);
    if ('message' in user) {
      return user;
    }
    await this.checkJournalExist(user, jornalDto.date);

    const interview = await this.interviewService.findInterview(user, jornalDto.date);
    const instruction = await this.instructionService.getInstruction('journal');
    const journal = await this.openAiService.getJournalByAI(interview.content, instruction.content);
    return await this.createJournalData(user, journal, jornalDto.date);
  }

  //1.1 저널 생성 메소드
  async createJournalData(
    user: UserEntity,
    journal: Journal,
    date: Date,
  ): Promise<Partial<ReturnedJournal>> {
    const journalRecord = {
      title: journal.title,
      keyword: journal.keyword,
      content: journal.content,
    };

    const newJournal = this.journalRepository.create({
      user: user,
      ...journalRecord,
      created_at: new Date(),
      date: date,
    });

    await this.journalRepository.save(newJournal);

    const original = this.originalJournalRepository.create({
      ...journalRecord,
      journal: newJournal,
    });

    await this.originalJournalRepository.save(original);

    await this.updatejournalCreation(user, date);

    const jwtToken = await this.userService.updateWritingCount(user); //UserService 5번

    const returndJournal: Partial<ReturnedJournal> = {
      title: newJournal.title,
      keyword: newJournal.keyword,
      content: newJournal.content,
      date: newJournal.date,
      created_at: newJournal.created_at,
      jwtToken,
    };
    return returndJournal;
  }

  //1.2 저널 생성 기록 생성

  private async updatejournalCreation(user: UserEntity, date: Date): Promise<void> {
    const newRecord = this.journalCreationRepository.create({
      user,
      journal_date: date,
      created_at: new Date(),
    });

    await this.journalCreationRepository.save(newRecord);
  }

  //2. 저널 목록 조회 (lastDate: 이전 요청 저널들 중 마지막 저널의 해당 날짜, limit: 저널 요청 개수)
  async getJournalList(
    userInfo: JwtPayload,
    lastDate: Date,
    limit: number,
  ): Promise<JournalEntity[]> {
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);

    const journals = await this.journalRepository.find({
      where: {
        user: user,
        date: LessThan(lastDate),
        deleted_at: null,
      },
      order: { date: 'DESC' },
      ...(limit ? { take: limit } : {}),
    });

    return journals;
  }

  //3. 유저, 날짜별 저널 상세 조회(유저 토큰 검증 x)
  async getJournalByDateWithoutUserVerify(user: UserEntity, date: Date): Promise<JournalEntity> {
    const journal = await this.journalRepository.findOne({
      where: {
        date,
        user,
        deleted_at: null,
      },
    });

    if (!journal) {
      throw new NotFoundException('The journal does not exist.');
    }

    return journal;
  }

  //4. 날짜별 저널 상세 조회
  async getJournalByDate(
    userInfo: JwtPayload,
    date: Date,
  ): Promise<{
    journalData: JournalEntity | null;
    questionIds: number[];
    message?: string;
  }> {
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);

    const journal = await this.journalRepository.findOne({
      where: {
        user,
        date,
        deleted_at: null,
      },
    });

    const interview = await this.interviewService.findInterview(user, date);

    const journalAndInterviewIds = {
      journalData: journal ?? null,
      questionIds: interview.question_id,
      message: journal ? undefined : "The journal doesn't exist on this date",
    };

    return journalAndInterviewIds;
  }

  //5. 저널 삭제 (일단 날짜로 식별 후 삭제)
  async deleteJournal(userInfo: JwtPayload, date: Date): Promise<{ message: string }> {
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);

    const journal = await this.getJournalByDateWithoutUserVerify(user, date);

    await this.journalRepository.delete({ user, date });

    await this.interviewService.resetInterview(user, date);
    return {
      message: `journal id :${journal.id}, date:${journal.date} removed`,
    };
  }

  //6. 저널 수정 (일단 날짜로 식별 후 수정)
  async updateJournal(
    userInfo: JwtPayload,
    date: Date,
    modifyJournalDto: ModifyJournalDto,
  ): Promise<JournalEntity | { message: string; newToken: string }> {
    const user = await this.userService.findUserByUserInfoWhitoutTokenVerify(userInfo);

    await this.getJournalByDateWithoutUserVerify(user, date);

    const updateJournal = {
      title: modifyJournalDto.title,
      keyword: modifyJournalDto.keyword,
      content: modifyJournalDto.content,
      updated_at: new Date(),
    };

    await this.journalRepository.update({ user, date }, { ...updateJournal });
    return await this.getJournalByDateWithoutUserVerify(user, date);
  }

  //7. 당일 저널 생성 횟수 초과 확인
  async checkJournalCreationAvailbility(user: UserEntity, journalDate: Date): Promise<void> {
    const startDate = startOfDay(new Date());
    const endDate = endOfDay(new Date());
    const journalCount = await this.journalCreationRepository.count({
      where: {
        user,
        journal_date: journalDate,
        created_at: Between(startDate, endDate),
      },
    });

    if (journalCount >= 3) {
      throw new ConflictException(
        'The number of journal creations for the specified date has exceeded the limit of 3. Please try again tomorrow',
      );
    }
    return;
  }
  //8. 회고 시작 시 저널 존재 여부 확인
  async checkJournalExist(user: UserEntity, date: Date): Promise<void> {
    const isExistJornal = await this.journalRepository.findOne({
      where: {
        user,
        date,
      },
    });

    if (isExistJornal) {
      throw new ConflictException('the journal already exist');
    }
  }

  //9. 유저, 날짜별 저널 + 원본 조회
  public async findJournalWithOriginal(user: UserEntity, date: Date) {
    const journal = await this.journalRepository.findOne({
      where: {
        date,
        user,
        deleted_at: null,
      },
    });

    if (!journal) {
      throw new NotFoundException('The journal does not exist.');
    }

    const original = await this.originalJournalRepository.findOne({
      where: { journal: { id: journal.id } },
    });

    return { ...journal, original };
  }
}
