import { UserEntitiy } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
export declare class UserService {
    private userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<UserEntitiy>, jwtService: JwtService);
    findUserInfos(user_id: string): Promise<UserEntitiy>;
    createUser(): Promise<string>;
    changeNickname(uuid: string, newNickname: string): Promise<UserEntitiy>;
    getUserTocken(uuid: string): Promise<string>;
    private checkFreetrial;
    private checkPlanActive;
}
