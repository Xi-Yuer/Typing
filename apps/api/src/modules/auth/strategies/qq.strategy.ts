import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-qq';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';
import { EnvironmentVariables } from 'src/modules/config/env.interface';

@Injectable()
export class QQStrategy extends PassportStrategy(Strategy, 'qq') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      clientID: configService.get('QQ_CLIENT_ID', ''),
      clientSecret: configService.get('QQ_CLIENT_SECRET', ''),
      callbackURL: configService.get('QQ_CALLBACK_URL', ''),
      scope: ['get_user_info'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<User> {
    const oauthProfile = {
      id: profile.id,
      username: profile.nickname || profile.displayName,
      email: profile.email,
      avatarUrl: profile.figureurl_qq_1 || profile.figureurl_1,
      rawData: profile._json,
    };

    // 检查是否是绑定流程
    if (req.query.state) {
      try {
        const state = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
        if (state.action === 'bind') {
          const result = await this.authService.qqLogin(oauthProfile);
          return result.user;
        }
      } catch (error) {
        // 如果state解析失败，继续正常登录流程
      }
    }

    const result = await this.authService.qqLogin(oauthProfile);
    return result.user;
  }
}