import { JournalEntity } from './entities/journal.entity';
import { Repository } from 'typeorm';
import { UserEntitiy } from 'src/user/entities/user.entity';
import { Journal } from 'src/open-ai/open-ai.service';
import { ModifyJournalDto } from './dto/modify_journal.dto';
export declare class JournalService {
    private journalRepository;
    constructor(journalRepository: Repository<JournalEntity>);
    createJournal(user: UserEntitiy, journal: Journal, date: Date): Promise<JournalEntity>;
    getJournalList(user: UserEntitiy, lastDate: string, limit: number): Promise<JournalEntity[]>;
    getJournal(user: UserEntitiy, id: number): Promise<JournalEntity>;
    getJournalByDate(user: UserEntitiy, date: Date): Promise<JournalEntity>;
    deleteJournal(user: UserEntitiy, id: number): Promise<void>;
    updateJournal(user: UserEntitiy, id: number, modifyJournalDto: ModifyJournalDto): Promise<void>;
}
