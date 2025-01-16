import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class ModifyJournalDto {
  @IsNumber()
  @IsNotEmpty({ message: '일기 아이디를 입력해주세요.' })
  journalId: number;

  @IsString()
  @IsNotEmpty({ message: '일기 제목을 입력해주세요' })
  title: string;

  @IsArray()
  @IsNotEmpty({ message: '키워드를 입력해주세요' })
  keyword: string[];

  @IsString()
  @IsNotEmpty({ message: '일기 본문을 입력해주세요.' })
  text: string;
}
