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
        password: process.env.REDIS_PASSWORD
      }
    })
  ],
  controllers: [],
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisCacheModule {}
