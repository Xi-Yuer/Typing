import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';
import { EnvironmentVariables } from 'src/modules/config/env.interface';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID', ''),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET', ''),
      callbackURL: configService.get('GITHUB_CALLBACK_URL', ''),
      scope: ['user:email'],
      passReqToCallback: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<User> {
    const oauthProfile = {
      id: profile.id,
      username: profile.username,
      email: profile.emails?.[0]?.value,
      avatarUrl: profile.photos?.[0]?.value,
      rawData: profile._json,
    };

    const result = await this.authService.githubLogin(oauthProfile);
    return result.user;
  }
}