import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email', // 使用email作为用户名字段
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new BadRequestException('邮箱和密码不能为空');
    }
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    return user;
  }
}