import { PartialType } from '@nestjs/swagger';
import { CreateWordErrorRecordDto } from './create-word-error-record.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class UpdateWordErrorRecordDto extends PartialType(
  CreateWordErrorRecordDto
) {
  @ApiProperty({ description: '错误次数', example: 3, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  errorCount?: number;

  @ApiProperty({ description: '是否已练习过', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPracticed?: boolean;

  @ApiProperty({ description: '练习次数', example: 2, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  practiceCount?: number;
}
