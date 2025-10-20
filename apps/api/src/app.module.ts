import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { WordsModule } from './modules/words/words.module';
import { SentencesModule } from './modules/sentences/sentences.module';
import { CorpusCategoriesModule } from './modules/corpus-categories/corpus-categories.module';
import { SpeechModule } from './modules/speech/speech.module';
import { WordErrorReportsModule } from './modules/word-errors/word-errors.module';
import { WordErrorRecordsModule } from './modules/word-error-record/word-error-records.module';
import { UserSettingsModule } from './modules/user-settings/user-settings.module';
import { CustomPackagesModule } from './modules/custom-packages/custom-packages.module';
import { CustomCacheInterceptor } from './common/interceptors/cache.interceptor';
import { RedisCacheModule } from './modules/redis/redis.module';
import { ThrottlerModule } from './modules/throttler/throttler.module';
import { CustomThrottlerGuard } from './common/guards/throttle.guard';

@Module({
  imports: [
    RedisCacheModule,
    ThrottlerModule,
    ConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    LanguagesModule,
    CorpusCategoriesModule,
    WordsModule,
    SentencesModule,
    SpeechModule,
    WordErrorReportsModule,
    WordErrorRecordsModule,
    UserSettingsModule,
    CustomPackagesModule,
    CacheModule.registerAsync({
      useFactory: () => {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = process.env.REDIS_PORT || '6379';
        let redisUrl = process.env.REDIS_URL || `redis://${host}:${port}`;

        // 如果提供了密码但 URL 中未包含鉴权信息，则注入密码
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

        return {
          stores: [createKeyv(redisUrl)],
          ttl: 12 * 60 * 1000 // 12分钟
        };
      },
      isGlobal: true
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomCacheInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard
    }
  ]
})
export class AppModule {}
