import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { USER_STATUS_KEY } from '@/common/decorators/user-status.decorator';
import { Role, UserStatus } from 'common';
import { User } from '@/modules/user/entities/user.entity';

/**
 * 角色权限守卫
 * 用于验证用户的角色权限和状态
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    const requiredStatuses = this.reflector.getAllAndOverride<UserStatus[]>(USER_STATUS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有设置角色或状态要求，则允许访问
    if (!requiredRoles && !requiredStatuses) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new UnauthorizedException('用户未认证');
    }

    // 检查用户状态
    if (requiredStatuses && requiredStatuses.length > 0) {
      if (!user.status || !requiredStatuses.includes(user.status)) {
        throw new ForbiddenException('用户状态不符合要求');
      }
    }

    // 检查用户角色
    if (requiredRoles && requiredRoles.length > 0) {
      if (!user.role || !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('用户权限不足');
      }
    }

    return true;
  }
}