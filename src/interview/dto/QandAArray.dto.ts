import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionAnswerDto } from './questionAndAnswer.dto';

export class QuestionAnswerArrayDto {
  @IsArray()
  @IsNotEmpty({ message: '질의 응답을 입력해주세요' })
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  interviews: QuestionAnswerDto[];
}
