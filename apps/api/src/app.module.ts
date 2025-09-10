import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
import { CustomCacheInterceptor } from './common/interceptors/cache.interceptor';
import { RedisCacheModule } from './modules/redis/redis.module';

@Module({
  imports: [
    RedisCacheModule,
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
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 })
            }),
            createKeyv(process.env.REDIS_URL)
          ],
          ttl: 1000 * 60 * 60 * 24
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
    }
  ]
})
export class AppModule {}
