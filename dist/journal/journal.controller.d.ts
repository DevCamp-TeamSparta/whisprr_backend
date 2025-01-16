import { JournalService } from './journal.service';
import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { InterviewService } from 'src/interview/interview.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';
export declare class JournalController {
    private journalService;
    private userService;
    private interviewService;
    private openAiService;
    constructor(journalService: JournalService, userService: UserService, interviewService: InterviewService, openAiService: OpenAiService);
    createJournal(userInfo: JwtPayload, interviewId: number): Promise<import("./entities/journal.entity").JournalEntity>;
    getJournalList(userInfo: JwtPayload): Promise<import("./entities/journal.entity").JournalEntity[]>;
    getJournal(userInfo: JwtPayload, id: number): Promise<import("./entities/journal.entity").JournalEntity>;
}
