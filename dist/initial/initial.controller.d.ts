import { UserService } from 'src/user/user.service';
import { QuestionService } from 'src/question/question.service';
import { TimeLimitService } from 'src/time_limit/time_limit.service';
import { InstructionService } from 'src/instruction/instruction.service';
export declare class InitialController {
    private readonly userService;
    private readonly questionService;
    private readonly timeLimitService;
    private readonly instructionService;
    constructor(userService: UserService, questionService: QuestionService, timeLimitService: TimeLimitService, instructionService: InstructionService);
    createNewUuid(): Promise<string>;
    sendInitialSetting(uuid: string): Promise<{
        bearer_token: string;
        questions: import("../question/entities/question.entity").QuestionEntity[];
        limits: import("../time_limit/entities/time_limit.entity").TimeLimitEntity[];
        instruction: import("../instruction/entities/instruction.entity").InstructionEntity;
    }>;
}
