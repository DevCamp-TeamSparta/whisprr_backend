import { JournalEntity } from './entities/journal.entity';
import { Repository } from 'typeorm';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { Journal } from 'src/open-ai/open-ai.service';
export declare class JournalService {
    private journalRepository;
    constructor(journalRepository: Repository<JournalEntity>);
    createJournal(user: UserEntitiy, journal: Journal): Promise<JournalEntity>;
    getJournalList(user: UserEntitiy): Promise<JournalEntity[]>;
    getJournal(user: UserEntitiy, id: number): Promise<JournalEntity>;
}
