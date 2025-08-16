import { Module } from '@nestjs/common';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { WordsModule } from './modules/words/words.module';
import { SentencesModule } from './modules/sentences/sentences.module';
import { CorpusCategoriesModule } from './modules/corpus-categories/corpus-categories.module';

@Module({
  imports: [
    ConfigModule, 
    DatabaseModule, 
    UserModule, 
    AuthModule, 
    LanguagesModule, 
    CorpusCategoriesModule, 
    WordsModule, 
    SentencesModule,
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [createKeyv(process.env.REDIS_URL)],
          ttl: 1000 * 60 * 60 * 24,
          max: 1000,
        };
      },
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
