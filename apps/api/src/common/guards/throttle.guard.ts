import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(options: any, storageService: any, reflector: Reflector) {
    super(options, storageService, reflector);
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    // 检查是否设置了跳过速率限制的元数据
    const skipThrottle = this.reflector.getAllAndOverride<boolean>(
      'skipThrottle',
      [context.getHandler(), context.getClass()]
    );

    return skipThrottle || false;
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // 获取客户端IP地址
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';

    // 获取用户ID（如果已认证）
    const userId = req.user?.id || 'anonymous';

    // 获取User-Agent
    const userAgent = req.headers['user-agent'] || 'unknown';

    // 生成更精确的追踪键
    return `${ip}:${userId}:${userAgent}`;
  }

  protected async handleRequest(requestProps: any): Promise<boolean> {
    const { context, limit, ttl } = requestProps;
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // 获取追踪键
    const key = await this.getTracker(request);
    const totalHits = await this.storageService.increment(
      key,
      ttl,
      limit,
      ttl,
      'default'
    );

    // 设置响应头
    response.header('X-RateLimit-Limit', limit);
    response.header(
      'X-RateLimit-Remaining',
      Math.max(0, limit - totalHits.totalHits)
    );
    response.header(
      'X-RateLimit-Reset',
      new Date(totalHits.timeToExpire).toISOString()
    );

    // 检查是否超过限制
    if (totalHits.totalHits > limit) {
      throw new ThrottlerException(
        `请求过于频繁，请稍后再试。限制：${limit}次/${Math.ceil(ttl / 1000)}秒`
      );
    }

    return true;
  }

  protected getRequestResponse(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return { req: request, res: response };
  }
}
