# 缓存控制装饰器使用示例

## @NoCache 装饰器

### 在方法级别使用

```typescript
import { Controller, Get } from '@nestjs/common';
import { NoCache } from '../decorators/no-cache.decorator';

@Controller('api')
export class ExampleController {
  
  @Get('cached-data')
  getCachedData() {
    // 这个方法会被缓存
    return { data: 'cached' };
  }

  @Get('real-time-data')
  @NoCache() // 这个方法不会被缓存
  getRealTimeData() {
    return { data: 'real-time', timestamp: Date.now() };
  }

  @Get('user-notifications')
  @NoCache() // 用户通知应该是实时的
  getUserNotifications() {
    return { notifications: [] };
  }
}
```

### 在控制器级别使用

```typescript
import { Controller, Get } from '@nestjs/common';
import { NoCache } from '../decorators/no-cache.decorator';

@Controller('real-time')
@NoCache() // 整个控制器的所有方法都不会被缓存
export class RealTimeController {
  
  @Get('status')
  getStatus() {
    return { status: 'online', timestamp: Date.now() };
  }

  @Get('metrics')
  getMetrics() {
    return { cpu: '50%', memory: '60%' };
  }
}
```

## 其他缓存控制方法

### 使用查询参数

```typescript
// 在URL中添加查询参数来跳过缓存
GET /api/data?nocache=true
GET /api/data?realtime=true
```

### 使用 @CacheTTL 设置缓存时间

```typescript
import { CacheTTL } from '@nestjs/cache-manager';

@Get('short-cache')
@CacheTTL(30) // 缓存30秒
getShortCacheData() {
  return { data: 'short cache' };
}

@Get('no-cache-ttl')
@CacheTTL(0) // 设置为0禁用缓存
getNoCacheData() {
  return { data: 'no cache' };
}
```

## 配置说明

当前的 `CustomCacheInterceptor` 支持以下缓存排除规则：

1. **装饰器优先级最高**：使用 `@NoCache` 装饰器的方法或控制器
2. **路径模式匹配**：配置的排除路径模式
3. **HTTP方法过滤**：非GET请求
4. **查询参数控制**：包含 `nocache=true` 或 `realtime=true` 的请求