import { QuestionEntity } from './entities/question.entity';
import { Repository } from 'typeorm';
export declare class QuestionService {
    private questionRepository;
    constructor(questionRepository: Repository<QuestionEntity>);
    getQuestion(): Promise<QuestionEntity[]>;
}
