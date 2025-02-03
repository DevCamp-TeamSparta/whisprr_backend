import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserGuard } from '../common/guards/user.guard';
import { JwtPayload, UserInfo } from '../common/utils/user_info.decorator';
import { UserService } from '../user/user.service';
import { NicknameDto } from './dto/create_nickname.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  //1.유저 닉네임 변경
  @UseGuards(UserGuard)
  @Patch('/nickname')
  async changeNickname(@UserInfo() userInfo: JwtPayload, @Body() nicknameDto: NicknameDto) {
    return await this.profileService.changeNickname(userInfo, nicknameDto.nickname);
  }

  //2.유저 가입 플랜 확인
  @UseGuards(UserGuard)
  @Get('/plan')
  async getUserPlan(@UserInfo() userInfo: JwtPayload) {
    return await this.profileService.getUserPlan(userInfo);
  }

  //3. 유저 프로필 확인
  @UseGuards(UserGuard)
  @Get()
  async getProfile(@UserInfo() userInfo: JwtPayload) {
    const user = await this.userService.findUserByUserInfo(userInfo);
    return user;
  }
}
