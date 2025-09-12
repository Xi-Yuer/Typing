import { ApiProperty } from '@nestjs/swagger';

export class RankingItemDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  userId: number;

  @ApiProperty({ description: '用户名', example: '张三' })
  userName: string;

  @ApiProperty({ description: '用户邮箱', example: 'zhangsan@example.com' })
  userEmail: string;

  @ApiProperty({ description: '分数', example: 100 })
  score: number;

  @ApiProperty({ description: '排名', example: 1 })
  rank: number;
}

export class RankingResponseDto {
  @ApiProperty({ description: '排行榜类型', example: 'total' })
  type: 'total' | 'daily' | 'weekly';

  @ApiProperty({ description: '排行榜数据', type: [RankingItemDto] })
  rankings: RankingItemDto[];

  @ApiProperty({ description: '当前用户排名', example: 5, required: false })
  currentUserRank?: number;

  @ApiProperty({ description: '当前用户分数', example: 80, required: false })
  currentUserScore?: number;
}
