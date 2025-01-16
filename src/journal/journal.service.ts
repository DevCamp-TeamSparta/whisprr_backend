import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JournalEntity } from './entities/journal.entity';
import { Repository } from 'typeorm';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { Journal } from 'src/open-ai/open-ai.service';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntity)
    private journalRepository: Repository<JournalEntity>,
  ) {}

  async createJournal(user: UserEntitiy, journal: Journal) {
    const newJournal = this.journalRepository.create({
      user: user,
      title: journal.title,
      keyword: journal.keyword,
      content: journal.content,
      created_at: new Date(),
    });

    await this.journalRepository.save(newJournal);

    return newJournal;
  }

  async getJournalList(user: UserEntitiy) {
    const journals = await this.journalRepository.find({
      where: {
        user: user,
      },
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
}
