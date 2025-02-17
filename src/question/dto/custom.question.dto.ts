import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';

export class CustomQuestionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomQuestionDto)
  @IsNotEmpty({ message: 'Please insert at least one question' })
  questions: CustomQuestionDto[];
}

export class CustomQuestionDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Please insert question_number' })
  @Min(1, { message: 'questionNumber must be at least 1' })
  @Max(4, { message: 'questionNumber cannot be greater than 4' })
  questionNumber: number;

  @IsString()
  @IsNotEmpty({ message: 'Please insert question content' })
  content: string;
}
