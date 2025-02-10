import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category, Reason } from '../report.reasons';

export class ReportDto {
  @IsEnum(Reason, { message: 'Please select a valid report reason' })
  @IsNotEmpty({ message: 'please insert Report reason' })
  reason: Reason;

  @IsArray({ message: 'Please select a valid report reason category' })
  @IsOptional()
  category?: Category[];

  @IsString()
  @IsOptional()
  userDefinedReason?: string;

  @IsString()
  @IsNotEmpty({ message: 'Please insert the corresponding journal date' })
  journalDate: Date;
}
