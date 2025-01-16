import { IsNotEmpty, IsString } from 'class-validator';

export class InterviewDto {
  @IsString()
  @IsNotEmpty({ message: '질문을 입력해주세요.' })
  question: string;

  @IsString()
  @IsNotEmpty({ message: '답변을 입력해주세요.' })
  answer: string;
}
