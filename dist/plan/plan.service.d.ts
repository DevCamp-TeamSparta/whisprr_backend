import { Repository } from 'typeorm';
import { PlanEntity } from './entities/plan.entity';
export declare class PlanService {
    private planRepository;
    constructor(planRepository: Repository<PlanEntity>);
    findPlan(planId: string): Promise<PlanEntity>;
}
