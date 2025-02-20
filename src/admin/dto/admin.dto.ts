import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AdminDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Please insert email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please insert password' })
  @Length(1, 15, { message: 'The password must be between 1 and 15 characters long.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Please insert confirmedPassword' })
  confirmedPassword: string;
}
