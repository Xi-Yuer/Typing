import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWordErrorReportDto {
  @ApiProperty({ description: '被报告的单词 ID', example: '1' })
  @IsString()
  @IsNotEmpty()
  wordId: string;

  @ApiProperty({ description: '错误描述', example: '这个单词的发音标注有误' })
  @IsString()
  @IsNotEmpty()
  errorDescription: string;
}
