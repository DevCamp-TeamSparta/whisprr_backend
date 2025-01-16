import { UserEntitiy } from '../../user/entities/user.entity';
export declare class InterviewEntity {
    id: number;
    content: string[];
    created_at: Date;
    deleted_at: Date;
    user: UserEntitiy;
}
