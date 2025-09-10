import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 获取当前用户装饰器
 * 在公开接口中，如果用户已登录则返回用户信息，否则返回null
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    // 如果指定了字段名，返回该字段的值
    if (data) {
      return user[data];
    }

    // 否则返回整个用户对象
    return user;
  }
);
