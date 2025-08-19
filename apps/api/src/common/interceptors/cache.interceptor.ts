import { CacheInterceptor } from '@nestjs/cache-manager';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NO_CACHE_KEY } from '../decorators/no-cache.decorator';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  constructor(
    cacheManager: any,
    public reflector: Reflector
  ) {
    super(cacheManager, reflector);
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    // 检查是否使用了 @NoCache 装饰器
    const isNoCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isNoCache) {
      return false;
    }
    const request = context.switchToHttp().getRequest();

    // 排除特定HTTP方法
    if (request.method.toLowerCase() !== 'get') {
      return false;
    }

    return super.isRequestCacheable(context);
  }
}
