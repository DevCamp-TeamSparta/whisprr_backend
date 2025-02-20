import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class NicknameDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter nickname' })
  @Length(1, 15, { message: 'The nickname must be between 1 and 15 characters long.' })
  @Matches(/^[A-Za-z]+$/, {
    message: 'The nickname can only contain English letters and cannot include spaces',
  })
  nickname: string;
}
