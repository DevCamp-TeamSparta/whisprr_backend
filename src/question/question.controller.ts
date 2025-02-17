import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { JwtPayload, UserInfo } from 'src/common/utils/user_info.decorator';
import { CustomQuestionsDto } from './dto/custom.question.dto';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @UseGuards(UserGuard)
  @Get()
  async getUserCustomQuestion(@UserInfo() userInfo: JwtPayload): Promise<object[]> {
    const customedQuestion = await this.questionService.getUserCustomQuestion(userInfo);
    return customedQuestion;
  }

  @UseGuards(UserGuard)
  @Post()
  async createUserCustomQuestion(
    @UserInfo() userInfo: JwtPayload,
    @Body() customQuestionsDto: CustomQuestionsDto,
  ): Promise<{ message: string }> {
    const response = await this.questionService.createUserCustomQuestion(
      userInfo,
      customQuestionsDto,
    );
    return response;
  }

  @UseGuards(UserGuard)
  @Delete()
  async initCustomQuestion(@UserInfo() userInfo: JwtPayload): Promise<{ message: string }> {
    const response = await this.questionService.initCustomQuestion(userInfo);
    return response;
  }
}
