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
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID', ''),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET', ''),
      callbackURL: configService.get('GITHUB_CALLBACK_URL', ''),
      scope: ['user:email'],
      passReqToCallback: true
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any
  ): Promise<User | null> {
    const oauthProfile = {
      id: profile.id,
      username: profile.username,
      email: profile.emails?.[0]?.value,
      avatarUrl: profile.photos?.[0]?.value,
      rawData: profile._json
    };

    // 检查是否是绑定流程
    if (req.query.state) {
      try {
        const stateData = JSON.parse(
          Buffer.from(req.query.state, 'base64').toString()
        );
        if (stateData.action === 'bind') {
          // 绑定流程：将OAuth信息附加到req对象，由controller处理
          req.oauthProfile = oauthProfile;
          req.bindingUserId = stateData.userId;
          return null; // 返回null，让controller处理绑定逻辑
        }
      } catch (error) {
        console.error('Failed to parse state:', error);
      }
    }

    // 正常登录流程
    const result = await this.authService.githubLogin(oauthProfile);
    return result.user;
  }
}
