import { InterviewEntity } from '../../interview/entities/interview.entity';
import { JournalEntity } from '../../journal/entities/journal.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
export declare class UserEntitiy {
    user_id: string;
    nickname: string;
    trial_status: string;
    writing_count: number;
    created_at: Date;
    deleted_at: Date;
    journals: JournalEntity[];
    interviews: InterviewEntity[];
    purchases: PurchaseEntity[];
}
