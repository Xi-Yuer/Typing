import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { UserModule } from '../user/user.module';
import { UserOAuth } from '../user/entities/user-oauth.entity';
import { EnvironmentVariables } from '../config/env.interface';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<EnvironmentVariables>) => ({
        secret: configService.get('JWT_SECRET', ''),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserOAuth]),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, GitHubStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, GitHubStrategy],
})
export class AuthModule {}
