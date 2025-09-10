import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { OPTIONAL_AUTH_KEY } from '../decorators/optional-auth.decorator';

/**
 * JWT认证守卫
 * 支持 @OptionalAuth装饰器来进行可选认证
 * 对于公开接口，如果有token则解析用户信息，没有token也允许访问
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否使用了 @OptionalAuth 装饰器
    const isOptionalAuth = this.reflector.getAllAndOverride<boolean>(
      OPTIONAL_AUTH_KEY,
      [context.getHandler(), context.getClass()]
    );

    // 如果是公开接口或可选认证接口，尝试解析token但不强制要求
    if (isOptionalAuth) {
      try {
        // 尝试执行JWT认证，如果成功则解析用户信息
        await super.canActivate(context);
        return true; // 无论是否解析成功都允许访问
      } catch {
        // 如果没有token或token无效，也允许访问公开接口
        return true;
      }
    }

    // 否则执行JWT认证（强制要求）
    const result = await super.canActivate(context);
    return result as boolean;
  }
}
