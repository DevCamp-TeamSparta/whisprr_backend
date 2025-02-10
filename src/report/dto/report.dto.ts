import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from '../report.reasons';

export class ReportDto {
  @IsArray({ message: 'Please select a valid report reason category' })
  @IsNotEmpty({ message: 'please insert Report reason' })
  reason?: Category[];

  @IsString()
  @IsOptional()
  userDefinedReason?: string;

  @IsString()
  @IsNotEmpty({ message: 'Please insert the corresponding journal date' })
  journalDate: Date;
}
