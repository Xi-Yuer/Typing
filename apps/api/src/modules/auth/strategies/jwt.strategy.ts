import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService, JwtPayload } from '../auth.service';
import { User } from 'src/modules/user/entities/user.entity';
import { EnvironmentVariables } from 'src/modules/config/env.interface';
import { UserStatus } from 'common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', '')
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    try {
      const user = await this.authService.validateUserByJwt(payload);
      // 即使 token 有效，也可以在这里拒绝访问：
      // 1. 用户被禁用
      if (user.status === UserStatus.DISABLED) {
        throw new UnauthorizedException('账户已被禁用');
      }

      // 2. 用户被删除
      if (user.status === UserStatus.DELETED) {
        throw new UnauthorizedException('账户不存在');
      }
      return user;
    } catch {
      throw new UnauthorizedException('无效的令牌');
    }
  }
}
