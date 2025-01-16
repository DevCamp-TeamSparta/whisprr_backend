import { TimeLimitEntity } from './entities/time_limit.entity';
import { Repository } from 'typeorm';
export declare class TimeLimitService {
    private timeLimitRepository;
    constructor(timeLimitRepository: Repository<TimeLimitEntity>);
    getTimeLimit(): Promise<TimeLimitEntity[]>;
}
