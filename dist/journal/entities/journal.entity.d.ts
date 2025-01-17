import { UserEntitiy } from '../../user/entities/user.entity';
export declare class JournalEntity {
    id: number;
    title: string;
    keyword: string[];
    content: string;
    date: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    user: UserEntitiy;
}
