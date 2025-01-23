import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class NicknameDto {
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @Length(1, 15, { message: '닉네임은 1자에서 15자 사이여야 합니다' })
  @Matches(/^[A-Za-z]+$/, {
    message: '닉네임은 영어만 입력 가능하며, 띄어쓰기를 포함할 수 없습니다',
  })
  nickname: string;
}
