# 统一响应格式使用指南

本项目已实现统一的API响应格式，包括成功响应和错误响应的标准化处理。

## 响应格式

### 成功响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    // 实际数据
  },
  "timestamp": 1640995200000,
  "path": "/api/users"
}
```

### 错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": {
    // 错误详情（可选）
  },
  "timestamp": 1640995200000,
  "path": "/api/users"
}
```

### 分页响应格式

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "items": [
      // 数据列表
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  },
  "timestamp": 1640995200000,
  "path": "/api/users"
}
```

## 自动处理机制

### 响应拦截器

项目已配置全局响应拦截器 `ResponseInterceptor`，会自动将控制器返回的数据包装成统一格式。

### 异常过滤器

项目已配置全局异常过滤器 `HttpExceptionFilter`，会自动处理所有异常并返回统一的错误格式。

## 在控制器中使用

### 1. 使用响应装饰器

```typescript
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginationResponse,
  ApiCommonErrorResponses,
} from '../../common/decorators/api-response.decorator';

@ApiTags('用户管理')
@Controller('user')
@ApiCommonErrorResponses() // 自动添加常用错误响应文档
export class UserController {
  
  @Get()
  @ApiOperation({ summary: '查询所有用户' })
  @ApiSuccessResponse([User], { description: '返回所有用户' })
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedResponse(User, { description: '创建用户成功' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('paginated')
  @ApiOperation({ summary: '分页查询用户' })
  @ApiPaginationResponse(User, { description: '分页查询成功' })
  findPaginated(@Query() query: PaginationQueryDto) {
    return this.userService.findPaginated(query);
  }
}
```

### 2. 直接返回数据

控制器方法可以直接返回数据，响应拦截器会自动包装：

```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  // 直接返回用户对象，会被自动包装成统一格式
  return this.userService.findOne(+id);
}
```

### 3. 手动构造响应

如果需要自定义响应消息，可以手动构造：

```typescript
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@Post('custom')
customAction(@Body() data: any) {
  const result = this.userService.customAction(data);
  return ApiResponseDto.success(result, '自定义操作成功');
}
```

### 4. 跳过响应包装

某些特殊接口（如文件下载、重定向等）可能需要跳过响应包装：

```typescript
import { SkipResponseWrapper } from '../../common/interceptors/response.interceptor';

@Get('download')
@SkipResponseWrapper()
downloadFile(@Res() res: Response) {
  // 直接操作响应对象，不会被包装
  res.download('file.pdf');
}
```

## 分页查询实现

### 1. 创建分页查询DTO

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  pageSize?: number = 10;
}
```

### 2. 在服务中实现分页

```typescript
import { PaginationResponseDto } from '../../common/dto/api-response.dto';

async findPaginated(query: PaginationQueryDto): Promise<PaginationResponseDto<User>> {
  const { page = 1, pageSize = 10 } = query;
  const skip = (page - 1) * pageSize;
  
  const [items, total] = await this.userRepository.findAndCount({
    where: { isActive: true },
    skip,
    take: pageSize,
    order: { createTime: 'DESC' },
  });
  
  return new PaginationResponseDto(items, total, page, pageSize);
}
```

## 错误处理

### 1. 抛出HTTP异常

```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

async findOne(id: number): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id } });
  
  if (!user) {
    throw new NotFoundException(`用户 ID ${id} 不存在`);
  }
  
  return user;
}
```

### 2. 自定义错误响应

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

async customValidation(data: any) {
  if (!this.isValid(data)) {
    throw new HttpException(
      {
        message: '数据验证失败',
        details: ['字段A不能为空', '字段B格式错误']
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
```

## 最佳实践

### 1. 统一使用响应装饰器

- 所有控制器都应该使用 `@ApiCommonErrorResponses()` 装饰器
- 根据接口类型选择合适的响应装饰器
- 为每个响应提供清晰的描述

### 2. 合理的错误处理

- 使用合适的HTTP状态码
- 提供有意义的错误消息
- 对于验证错误，提供详细的错误信息

### 3. 分页查询规范

- 统一使用 `page` 和 `pageSize` 参数
- 提供合理的默认值
- 返回完整的分页信息

### 4. 文档完整性

- 为所有接口添加 `@ApiOperation` 描述
- 使用响应装饰器生成准确的文档
- 保持Swagger文档的完整性和准确性

## 迁移现有代码

对于现有的控制器，按以下步骤迁移：

1. 导入响应装饰器
2. 替换 `@ApiResponse` 为对应的响应装饰器
3. 添加 `@ApiCommonErrorResponses()` 到控制器类
4. 移除手动的响应包装代码
5. 测试接口确保响应格式正确

通过以上配置，项目的所有API接口都将返回统一的响应格式，提升前端开发体验和接口的一致性。