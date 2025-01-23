import { IsNotEmpty, IsString } from 'class-validator';

export class InterviewDto {
  @IsString()
  @IsNotEmpty({ message: '일기를 작성할 날짜를 입력해주세요' })
  date: Date;
}
