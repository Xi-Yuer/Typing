import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'common';
import { User } from '@/modules/user/entities/user.entity';

/**
 * 自己或管理员守卫
 * 允许用户修改自己的信息，或者管理员修改任何用户的信息
 */
@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const targetUserId = parseInt(request.params?.id);

    if (!targetUserId) {
      throw new BadRequestException('用户ID参数缺失');
    }

    if (!user) {
      throw new UnauthorizedException('用户未认证');
    }

    // 如果是管理员或超级管理员，允许访问
    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
      return true;
    }

    // 如果是用户自己，允许访问
    if (user.id === targetUserId) {
      return true;
    }

    throw new ForbiddenException('非法操作');
  }
}