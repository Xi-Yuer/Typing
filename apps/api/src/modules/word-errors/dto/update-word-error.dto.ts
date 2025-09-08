import { PartialType } from '@nestjs/swagger';
import { CreateWordErrorReportDto } from './create-word-error-report.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';

export class UpdateWordErrorReportDto extends PartialType(
  CreateWordErrorReportDto
) {
  @ApiProperty({
    description: '处理状态',
    example: 'accepted',
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    required: false
  })
  @IsOptional()
  @IsEnum(['pending', 'reviewing', 'accepted', 'rejected'])
  status?: 'pending' | 'reviewing' | 'accepted' | 'rejected';

  @ApiProperty({
    description: '管理员处理备注',
    example: '已确认错误，已修正',
    required: false
  })
  @IsOptional()
  @IsString()
  adminNote?: string;
}
