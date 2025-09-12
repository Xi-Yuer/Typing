import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateCorrectDto {
  @ApiProperty({ description: '单词 ID', example: '1' })
  @IsNumberString({}, { message: '语言 ID 必须是数字字符串' })
  @IsNotEmpty()
  id: string;
}
