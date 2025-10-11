# 速率限制使用指南

## 概述

本系统已集成全局速率限制功能，用于防止恶意攻击和数据盗刷。系统使用 Redis 存储速率限制数据，支持多种限制策略。

## 默认配置

- **全局默认限制**: 1分钟内100次请求
- **存储方式**: Redis
- **追踪方式**: IP地址 + 用户ID + User-Agent

## 装饰器使用

### 1. 跳过速率限制

对于不需要限制的接口，使用 `@SkipThrottle()` 装饰器：

```typescript
import { SkipThrottle } from '@/common/decorators/throttle.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @SkipThrottle() // 跳过速率限制
  check() {
    return { status: 'ok' };
  }
}
```

### 2. 自定义速率限制

对于需要特殊限制的接口，使用相应的装饰器：

```typescript
import {
  ThrottleLogin,
  ThrottleRegister,
  ThrottleStrict,
  ThrottleLoose,
  ThrottleUpload
} from '@/common/decorators/throttle.decorator';

@Controller('auth')
export class AuthController {
  @Post('login')
  @ThrottleLogin() // 1分钟内5次登录尝试
  async login() {
    // 登录逻辑
  }

  @Post('register')
  @ThrottleRegister() // 1小时内10次注册尝试
  async register() {
    // 注册逻辑
  }
}

@Controller('upload')
export class UploadController {
  @Post('file')
  @ThrottleUpload() // 1分钟内10次上传
  async uploadFile() {
    // 上传逻辑
  }
}

@Controller('api')
export class ApiController {
  @Get('data')
  @ThrottleLoose() // 1分钟内500次请求（高频接口）
  async getData() {
    // 获取数据逻辑
  }

  @Post('sensitive')
  @ThrottleStrict() // 1分钟内20次请求（敏感操作）
  async sensitiveOperation() {
    // 敏感操作逻辑
  }
}
```

## 可用的装饰器

| 装饰器                       | 限制   | 时间窗口 | 适用场景           |
| ---------------------------- | ------ | -------- | ------------------ |
| `@SkipThrottle()`            | 无限制 | -        | 健康检查、静态资源 |
| `@ThrottleLogin()`           | 5次    | 1分钟    | 登录接口           |
| `@ThrottleRegister()`        | 10次   | 1小时    | 注册接口           |
| `@ThrottleUpload()`          | 10次   | 1分钟    | 文件上传           |
| `@ThrottleStrict()`          | 20次   | 1分钟    | 敏感操作           |
| `@ThrottleLoose()`           | 500次  | 1分钟    | 高频接口           |
| `@ThrottleLimit(limit, ttl)` | 自定义 | 自定义   | 特殊需求           |

## 响应头

当请求被限制时，系统会返回以下响应头：

- `X-RateLimit-Limit`: 限制次数
- `X-RateLimit-Remaining`: 剩余次数
- `X-RateLimit-Reset`: 重置时间

## 错误响应

当超过速率限制时，系统会返回 429 状态码和错误信息：

```json
{
  "statusCode": 429,
  "message": "请求过于频繁，请稍后再试。限制：100次/60秒",
  "error": "Too Many Requests"
}
```

## 配置说明

### Redis 配置

确保 Redis 服务正常运行，并在环境变量中设置 `REDIS_URL`：

```bash
REDIS_URL=redis://localhost:6379
```

### 自定义配置

如需修改默认限制，可以在 `throttler.module.ts` 中调整：

```typescript
throttlers: [
  {
    name: 'default',
    ttl: 60000, // 时间窗口（毫秒）
    limit: 100, // 限制次数
  },
],
```

## 最佳实践

1. **登录/注册接口**: 使用 `@ThrottleLogin()` 和 `@ThrottleRegister()`
2. **文件上传**: 使用 `@ThrottleUpload()`
3. **高频查询**: 使用 `@ThrottleLoose()`
4. **敏感操作**: 使用 `@ThrottleStrict()`
5. **健康检查**: 使用 `@SkipThrottle()`
6. **静态资源**: 使用 `@SkipThrottle()`

## 监控和调试

### 查看 Redis 中的限制数据

```bash
# 连接到 Redis
redis-cli

# 查看所有限制键
KEYS throttler:*

# 查看特定键的值
GET throttler:default:127.0.0.1:anonymous:Mozilla/5.0
```

### 日志监控

系统会在控制台输出速率限制相关的日志，包括：

- 超过限制的请求
- Redis 连接状态
- 限制器配置信息

## 故障排除

### 常见问题

1. **Redis 连接失败**
   - 检查 Redis 服务是否运行
   - 验证 `REDIS_URL` 环境变量

2. **限制不生效**
   - 检查装饰器是否正确导入
   - 确认守卫已正确注册

3. **性能问题**
   - 考虑调整限制参数
   - 检查 Redis 性能

### 测试速率限制

可以使用以下命令测试速率限制：

```bash
# 快速发送多个请求
for i in {1..110}; do
  curl -X GET http://localhost:3001/api/your-endpoint
done
```

第101个请求应该返回 429 状态码。
