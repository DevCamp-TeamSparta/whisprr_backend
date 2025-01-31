import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionAnswerDto } from './questionAndAnswer.dto';

export class QuestionAnswerArrayDto {
  @IsArray()
  @IsNotEmpty({ message: '질의 응답을 입력해주세요' })
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  interviews: QuestionAnswerDto[];

  @IsNumber()
  @IsNotEmpty({ message: '완료한 질문의 아이디를 입력해주세요' })
  questionId: number;
}
