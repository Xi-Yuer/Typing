import { ApiProperty } from '@nestjs/swagger';

export class ReportStatsDto {
  @ApiProperty({ description: '总报告数', example: 100 })
  totalReports: number;

  @ApiProperty({ description: '待处理报告数', example: 20 })
  pendingReports: number;

  @ApiProperty({ description: '审核中报告数', example: 15 })
  reviewingReports: number;

  @ApiProperty({ description: '已接受报告数', example: 50 })
  acceptedReports: number;

  @ApiProperty({ description: '已拒绝报告数', example: 15 })
  rejectedReports: number;

  @ApiProperty({
    description: '最近报告统计',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        date: { type: 'string', description: '日期' },
        count: { type: 'number', description: '数量' }
      }
    }
  })
  recentReports: Array<{ date: string; count: number }>;
}
