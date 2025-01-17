import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class JournalDto {
  @IsNumber()
  @IsNotEmpty({ message: '인터뷰 아이디를 입력해주세요' })
  interviewId: number;

  @IsString()
  @IsNotEmpty({ message: '일기를 작성할 날짜를 입력해주세요' })
  date: Date;
}
