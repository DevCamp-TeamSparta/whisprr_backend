import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserGuard } from '../common/guards/user.guard';
import { JwtPayload, UserInfo } from '../common/utils/user_info.decorator';
import { UserService } from '../user/user.service';
import { NicknameDto } from './dto/create_nickname.dto';
import { PurchaseService } from 'src/purchase/purchase.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly purchaseService: PurchaseService,
  ) {}

  //1.유저 닉네임 변경
  @UseGuards(UserGuard)
  @Patch('/nickname')
  async changeNickname(@UserInfo() userInfo: JwtPayload, @Body() nicknameDto: NicknameDto) {
    const user = await this.userService.findUserByUserInfo(userInfo);
    if ('message' in user) {
      return user;
    }
    return await this.userService.changeNickname(user, nicknameDto.nickname);
  }

  //2.유저 가입 플랜 확인
  @UseGuards(UserGuard)
  @Get('/plan')
  async getUserPlan(@UserInfo() userInfo: JwtPayload) {
    const user = await this.userService.findUserByUserInfo(userInfo);
    if ('message' in user) {
      return user;
    }
    return await this.purchaseService.getUserPlan(user);
  }

  //3. 유저 프로필 확인
  @UseGuards(UserGuard)
  @Get()
  async getProfile(@UserInfo() userInfo: JwtPayload) {
    const user = await this.userService.findUserByUserInfo(userInfo);
    return user;
  }
}
