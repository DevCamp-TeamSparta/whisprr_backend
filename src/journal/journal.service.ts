import { Injectable } from '@nestjs/common';
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
    await this.userService.updateWritingCount(user);
    return newJournal;
  }

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

  async getJournal(user: UserEntitiy, id: number) {
    const journal = await this.journalRepository.findOne({
      where: {
        id,
        user,
        deleted_at: null,
      },
    });

    return journal;
  }

  async getJournalByDate(user: UserEntitiy, date: Date) {
    const journal = await this.journalRepository.findOne({
      where: {
        user,
        date,
      },
    });

    return journal;
  }

  async deleteJournal(user: UserEntitiy, id: number) {
    await this.journalRepository.delete({ user, id });
  }

  async updateJournal(user: UserEntitiy, id: number, modifyJournalDto: ModifyJournalDto) {
    const updateJournal = {
      title: modifyJournalDto.title,
      keyword: modifyJournalDto.keyword,
      content: modifyJournalDto.content,
      updated_at: new Date(),
    };

    await this.journalRepository.update({ id, user: user }, { ...updateJournal });
  }
}
