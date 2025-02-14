import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { UserGuard } from '../common/guards/user.guard';
import { JwtPayload, UserInfo } from '../common/utils/user_info.decorator';
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

  //2. 신고목록 열람(관리자 열람용)
  @Get('/all')
  async getAllReport() {
    return await this.reportService.getAllReport();
  }

  //3. 유저별 신고 목록 열람(관리자 열람용)
  @Get('/user/:uuid')
  async getUserReport(@Param('uuid') uuid: string) {
    return await this.reportService.getUserReport(uuid);
  }

  //4. 신고 아이디별 신고 상세 열람(관리자 열람용)
  @Get('/:id')
  async getReportById(@Param('id') id: number) {
    return await this.reportService.getReportById(id);
  }
}
