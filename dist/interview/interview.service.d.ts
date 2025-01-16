import { Repository } from 'typeorm';
import { InterviewEntity } from './entities/interview.entity';
import { UserEntitiy } from '../user/entities/user.entity';
export declare class InterviewService {
    private interviewRepository;
    constructor(interviewRepository: Repository<InterviewEntity>);
    startInterview(user: UserEntitiy): Promise<InterviewEntity>;
    updateInterview(id: number, QandAs: object[]): Promise<InterviewEntity>;
    findInterview(id: number): Promise<InterviewEntity>;
}
