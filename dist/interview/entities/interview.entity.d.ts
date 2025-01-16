import { UserEntitiy } from '../../user/entities/user.entity';
export declare class InterviewEntity {
    id: number;
    content: object[];
    created_at: Date;
    deleted_at: Date;
    user: UserEntitiy;
}
