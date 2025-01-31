import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JournalEntity } from './entities/journal.entity';
import { Between, LessThan, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Journal } from '../open-ai/open-ai.service';
import { ModifyJournalDto } from './dto/modify_journal.dto';
import { UserService } from '../user/user.service';
import { JournalCreationEntity } from './entities/journal.creation.entity';
import { startOfDay, endOfDay } from 'date-fns';

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
  ) {}

  //1. 저널 생성
  async createJournal(
    user: UserEntity,
    journal: Journal,
    date: Date,
  ): Promise<Partial<ReturnedJournal>> {
    await this.cheskJournalExist(user, date);
    const newJournal = this.journalRepository.create({
      user: user,
      title: journal.title,
      keyword: journal.keyword,
      content: journal.content,
      created_at: new Date(),
      date: date,
    });

    await this.journalRepository.save(newJournal);
    const jwtToken = await this.userService.updateWritingCount(user); //UserService 5번
    await this.updatejournalCreation(user, date);

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

  //1.1 저널 생성 기록 생성
  private async updatejournalCreation(user: UserEntity, date: Date): Promise<void> {
    const newRecord = this.journalCreationRepository.create({
      user,
      journal_date: date,
      created_at: new Date(),
    });

    await this.journalCreationRepository.save(newRecord);
  }

  //2. 저널 목록 조회 (lastDate: 이전 요청 저널들 중 마지막 저널의 해당 날짜, limit: 저널 요청 개수)
  async getJournalList(user: UserEntity, lastDate: Date, limit: number): Promise<JournalEntity[]> {
    const journals = await this.journalRepository.find({
      where: {
        user: user,
        date: LessThan(lastDate),
        deleted_at: null,
      },
      order: { date: 'DESC' },
      take: limit,
    });

    return journals;
  }

  //3. 아이디 별 저널 상세 조회
  async getJournal(user: UserEntity, id: number): Promise<JournalEntity> {
    const journal = await this.journalRepository.findOne({
      where: {
        id,
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
  async getJournalByDate(user: UserEntity, date: Date): Promise<JournalEntity> {
    const journal = await this.journalRepository.findOne({
      where: {
        user,
        date,
        deleted_at: null,
      },
    });

    if (!journal) {
      throw new NotFoundException('The journal does not exist.');
    }

    return journal;
  }

  //5. 저널 삭제 (일단 날짜로 식별 후 삭제)
  async deleteJournal(user: UserEntity, date: Date): Promise<object> {
    const journal = await this.getJournalByDate(user, date); //4번
    await this.journalRepository.delete({ user, date });
    return { message: `journal id :${journal.id}, date:${journal.date} removed` };
  }

  //6. 저널 수정 (일단 날짜로 식별 후 수정)
  async updateJournal(
    user: UserEntity,
    date: Date,
    modifyJournalDto: ModifyJournalDto,
  ): Promise<void> {
    await this.getJournalByDate(user, date); //4번
    const updateJournal = {
      title: modifyJournalDto.title,
      keyword: modifyJournalDto.keyword,
      content: modifyJournalDto.content,
      updated_at: new Date(),
    };

    await this.journalRepository.update({ user, date }, { ...updateJournal });
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
  async cheskJournalExist(user: UserEntity, date: Date) {
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
}
