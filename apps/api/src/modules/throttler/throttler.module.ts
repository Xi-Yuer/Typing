import { Module } from '@nestjs/common';
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler';
import { Redis } from 'ioredis';

@Module({
  imports: [
    NestThrottlerModule.forRootAsync({
      useFactory: () => {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = process.env.REDIS_PORT || '6379';
        let redisUrl = process.env.REDIS_URL || `redis://${host}:${port}`;
        const password = process.env.REDIS_PASSWORD;
        if (password) {
          const hasAuth = /^redis(s)?:\/\/[^@]+@/.test(redisUrl);
          if (!hasAuth) {
            const scheme = redisUrl.startsWith('rediss://')
              ? 'rediss://'
              : 'redis://';
            const rest = redisUrl.replace(/^redis(s)?:\/\//, '');
            redisUrl = `${scheme}:${password}@${rest}`;
          }
        }

        const redis = new Redis(redisUrl);

        return {
          throttlers: [
            {
              name: 'default',
              ttl: 60000, // 1分钟
              limit: 500 // 500次请求 - 全局默认限制
            }
          ],
          storage: {
            async getRecord(key: string) {
              const result = await redis.get(`throttler:${key}`);
              return result
                ? JSON.parse(result)
                : { totalHits: 0, timeToExpire: 0 };
            },
            async addRecord(key: string, ttl: number) {
              const record = { totalHits: 1, timeToExpire: Date.now() + ttl };
              await redis.setex(
                `throttler:${key}`,
                Math.ceil(ttl / 1000),
                JSON.stringify(record)
              );
              return record;
            },
            async increment(key: string, ttl: number) {
              const existing = await redis.get(`throttler:${key}`);
              if (existing) {
                const record = JSON.parse(existing);
                record.totalHits += 1;
                await redis.setex(
                  `throttler:${key}`,
                  Math.ceil(ttl / 1000),
                  JSON.stringify(record)
                );
                return record;
              } else {
                return this.addRecord(key, ttl);
              }
            }
          },
          errorMessage: '请求过于频繁，请稍后再试',
          generateKey: context => {
            const request = context.switchToHttp().getRequest();
            const ip = request.ip || request.connection.remoteAddress;
            const userAgent = request.headers['user-agent'] || 'unknown';
            const userId = request.user?.id || 'anonymous';

            // 根据不同的限制类型生成不同的key
            return `default:${ip}:${userId}:${userAgent}`;
          }
        };
      }
    })
  ],
  exports: [NestThrottlerModule]
})
export class ThrottlerModule {}
