import { IsNotEmpty, IsString, Length } from 'class-validator';

export class NicknameDto {
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @Length(1, 15, { message: '닉네임은 1자에서 15자 사이여야 합니다' })
  nickname: string;
}
