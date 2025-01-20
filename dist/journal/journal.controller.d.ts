import { JournalService } from './journal.service';
import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { InterviewService } from 'src/interview/interview.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { JournalEntity } from './entities/journal.entity';
import { JournalDto } from './dto/create_jornal.dto';
import { ModifyJournalDto } from './dto/modify_journal.dto';
export declare class JournalController {
    private journalService;
    private userService;
    private interviewService;
    private openAiService;
    constructor(journalService: JournalService, userService: UserService, interviewService: InterviewService, openAiService: OpenAiService);
    createJournal(userInfo: JwtPayload, jornalDto: JournalDto): Promise<JournalEntity>;
    getJournalList(userInfo: JwtPayload, lastDate?: string, limit?: number): Promise<JournalEntity[]>;
    getJournal(userInfo: JwtPayload, id: number): Promise<JournalEntity>;
    getJournalByDate(userInfo: JwtPayload, date: Date): Promise<JournalEntity>;
    deleteJournal(userInfo: JwtPayload, id: number): Promise<void>;
    updateJournal(userInfo: JwtPayload, id: number, modifyJournalDto: ModifyJournalDto): Promise<void>;
}
