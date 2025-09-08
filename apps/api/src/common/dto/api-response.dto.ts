import { ApiProperty } from '@nestjs/swagger';

/**
 * 统一API响应格式
 */
export class ApiResponseDto<T> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '响应消息', example: '操作成功' })
  message: string;

  @ApiProperty({ description: '响应数据' })
  data: T;

  @ApiProperty({ description: '时间戳', example: 1640995200000 })
  timestamp: number;

  @ApiProperty({ description: '请求路径', example: '/api/users' })
  path: string;

  constructor(data: T, message = '操作成功', code = 200, path = '') {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
    this.path = path;
  }

  /**
   * 创建成功响应
   */
  static success<T>(
    data: T,
    message = '操作成功',
    path = ''
  ): ApiResponseDto<T> {
    return new ApiResponseDto(data, message, 200, path);
  }

  /**
   * 创建错误响应
   */
  static error(
    message = '操作失败',
    code = 500,
    path = ''
  ): ApiResponseDto<null> {
    return new ApiResponseDto(null, message, code, path);
  }
}

/**
 * 分页响应数据
 */
export class PaginationDto<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;

  constructor(list: T[], total: number, page: number, pageSize: number) {
    this.list = list;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize);
  }
}

/**
 * 分页响应格式
 */
export class PaginationResponseDto<T = any> extends ApiResponseDto<
  PaginationDto<T>
> {
  data: PaginationDto<T>;

  constructor(
    list: T[],
    total: number,
    page: number,
    pageSize: number,
    message = '查询成功',
    path = ''
  ) {
    const paginationData = new PaginationDto(list, total, page, pageSize);
    super(paginationData, message, 200, path);
    this.data = paginationData;
  }
}

/**
 * 用户分页响应格式
 */
export class UserPaginationResponseDto extends ApiResponseDto<{
  list: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  @ApiProperty({
    description: '分页数据',
    type: 'object',
    properties: {
      list: {
        type: 'array',
        items: { $ref: '#/components/schemas/User' }
      },
      total: { type: 'number', description: '总数量' },
      page: { type: 'number', description: '当前页码' },
      pageSize: { type: 'number', description: '每页数量' },
      totalPages: { type: 'number', description: '总页数' }
    }
  })
  data: {
    list: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };

  constructor(
    list: any[],
    total: number,
    page: number,
    pageSize: number,
    message = '查询成功',
    path = ''
  ) {
    const paginationData = {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
    super(paginationData, message, 200, path);
    this.data = paginationData;
  }
}
