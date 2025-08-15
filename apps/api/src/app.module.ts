import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { WordsModule } from './modules/words/words.module';
import { SentencesModule } from './modules/sentences/sentences.module';
import { CorpusCategoriesModule } from './modules/corpus-categories/corpus-categories.module';

@Module({
  imports: [ConfigModule, DatabaseModule, UserModule, AuthModule, LanguagesModule, CorpusCategoriesModule, WordsModule, SentencesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
