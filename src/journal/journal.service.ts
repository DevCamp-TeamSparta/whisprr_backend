import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JournalEntity } from './entities/journal.entity';
import { LessThan, Repository } from 'typeorm';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { Journal } from 'src/open-ai/open-ai.service';
import { ModifyJournalDto } from './dto/modify_journal.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntity)
    private journalRepository: Repository<JournalEntity>,
    private userService: UserService,
  ) {}

  //1. 저널 생성
  async createJournal(user: UserEntitiy, journal: Journal, date: Date) {
    const newJournal = this.journalRepository.create({
      user: user,
      title: journal.title,
      keyword: journal.keyword,
      content: journal.content,
      created_at: new Date(),
      date: date,
    });

    await this.journalRepository.save(newJournal);
    await this.userService.updateWritingCount(user); //UserService 5번
    return newJournal;
  }

  //2. 저널 목록 조회 (lastDate: 이전 요청 저널들 중 마지막 저널의 해당 날짜, limit: 저널 요청 개수)
  async getJournalList(user: UserEntitiy, lastDate: Date, limit: number) {
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
  async getJournal(user: UserEntitiy, id: number) {
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
  async getJournalByDate(user: UserEntitiy, date: Date) {
    const journal = await this.journalRepository.findOne({
      where: {
        user,
        date,
      },
    });

    if (!journal) {
      throw new NotFoundException('The journal does not exist.');
    }

    return journal;
  }

  //5. 저널 삭제 (일단 날짜로 식별 후 삭제)
  async deleteJournal(user: UserEntitiy, date: Date) {
    const journal = await this.getJournalByDate(user, date); //4번
    await this.journalRepository.softDelete({ user, date });
    return { message: `journal id :${journal.id}, date:${journal.date} removed` };
  }

  //6. 저널 수정 (일단 날짜로 식별 후 수정)
  async updateJournal(user: UserEntitiy, date: Date, modifyJournalDto: ModifyJournalDto) {
    await this.getJournalByDate(user, date); //4번
    const updateJournal = {
      title: modifyJournalDto.title,
      keyword: modifyJournalDto.keyword,
      content: modifyJournalDto.content,
      updated_at: new Date(),
    };

    await this.journalRepository.update({ user, date }, { ...updateJournal });
  }
}
