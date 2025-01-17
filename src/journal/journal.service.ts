import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JournalEntity } from './entities/journal.entity';
import { LessThan, Repository } from 'typeorm';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { Journal } from 'src/open-ai/open-ai.service';
import { ModifyJournalDto } from './dto/modify_journal.dto';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntity)
    private journalRepository: Repository<JournalEntity>,
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

    return newJournal;
  }

  async getJournalList(user: UserEntitiy, lastDate: string, limit: number) {
    const parsedDate = new Date(lastDate);
    const journals = await this.journalRepository.find({
      where: {
        user: user,
        date: LessThan(parsedDate),
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
