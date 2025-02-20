import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ReportService } from 'src/report/report.service';
import { AdminService } from './admin.service';
import { AdminDto } from './dto/admin.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UserService } from 'src/user/user.service';

@Controller('admin')
export class AdminController {
  constructor(
    private reportService: ReportService,
    private adminService: AdminService,
    private userService: UserService,
  ) {}

  //1. 관리자 계정 생성
  @Post()
  async createAdminAccount(@Body() adminDto: AdminDto): Promise<{ message: string }> {
    return await this.adminService.createAdminAccount(adminDto);
  }

  //2. 관리자 계정 로그인
  @Post('/login')
  async loginAdminAccount(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ token: string }> {
    return await this.adminService.loginAdminAccount(email, password);
  }

  //3. 신고목록 열람(관리자 열람용)
  @UseGuards(AdminGuard)
  @Get('/all')
  async getAllReport() {
    return await this.reportService.getAllReport();
  }

  //4. 유저별 신고 목록 열람(관리자 열람용)
  @UseGuards(AdminGuard)
  @Get('/user')
  async getUserReport(@Query('email') email: string) {
    return await this.reportService.getUserReport(email);
  }

  //5. 신고 아이디별 신고 상세 열람(관리자 열람용)
  @UseGuards(AdminGuard)
  @Get('/:id')
  async getReportById(@Param('id') id: number) {
    return await this.reportService.getReportById(id);
  }

  //6. 사용자의 계정 삭제
  @UseGuards(AdminGuard)
  @Delete('/user')
  async deleteUserAccount(@Query('email') email: string): Promise<{ message: string }> {
    return await this.userService.deleteUserAccount(email);
  }
}
