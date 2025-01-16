import { InterviewService } from './interview.service';
import { JwtPayload } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { QuestionAnswerArrayDto } from './dto/QandAArray.dto';
export declare class InterviewController {
    private readonly interviewService;
    private readonly userService;
    constructor(interviewService: InterviewService, userService: UserService);
    startInterview(userInfo: JwtPayload): Promise<import("./entities/interview.entity").InterviewEntity>;
    updateInterview(id: number, QandADto: QuestionAnswerArrayDto): Promise<import("./entities/interview.entity").InterviewEntity>;
}
