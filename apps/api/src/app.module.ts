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
        return {
          stores: [createKeyv(process.env.REDIS_URL)],
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
