import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserGuard } from 'src/common/guards/user.guard';
import { JwtPayload, UserInfo } from 'src/common/utils/user_info.decorator';
import { ReportService } from './report.service';
import { ReportDto } from './dto/report.dto';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  //1. 신고 생성(일반 유저 사용 가능)
  @UseGuards(UserGuard)
  @Post()
  async createReport(@UserInfo() userInfo: JwtPayload, @Body() reportDto: ReportDto) {
    return await this.reportService.createReport(userInfo, reportDto);
  }
}
