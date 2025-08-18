import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['.env', '.env.dev', '.env.prod'],
      isGlobal: true
    })
  ],
  providers: [],
  exports: []
})
export class ConfigModule {}
