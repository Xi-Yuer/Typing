// redis.module.ts
import { Module, Global } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
      options: {
        retryStrategy: times => {
          return Math.min(times * 50, 1000);
        }
      }
    })
  ],
  controllers: [],
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisCacheModule {}
