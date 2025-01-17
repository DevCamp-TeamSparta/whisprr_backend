import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserGuard } from 'src/common/guards/user.guard';
import { JwtPayload, UserInfo } from 'src/common/utils/user_info.decorator';
import { UserService } from 'src/user/user.service';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  @UseGuards(UserGuard)
  @Patch('/nickname')
  async getJournal(@UserInfo() userInfo: JwtPayload, @Body('nickname') nickname: string) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.profileService.changeNickname(user, nickname);
  }

  @UseGuards(UserGuard)
  @Get('/plan')
  async getUserPlan(@UserInfo() userInfo: JwtPayload) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return await this.profileService.getUserPlan(user);
  }

  @UseGuards(UserGuard)
  @Get()
  async getProfile(@UserInfo() userInfo: JwtPayload) {
    const user = await this.userService.findUserInfos(userInfo.uuid);
    return user;
  }
}
