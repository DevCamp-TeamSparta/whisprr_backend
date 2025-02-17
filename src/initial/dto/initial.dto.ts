import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InitialDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Please insert email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please insert verification code' })
  verifyCode: string;
}
