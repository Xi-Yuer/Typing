import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

/**
 * 跳过速率限制装饰器 - 用于不需要限制的接口
 */
export const SkipThrottle = () => SetMetadata('skipThrottle', true);

/**
 * 自定义速率限制装饰器
 * @param limit 限制次数
 * @param ttl 时间窗口（毫秒）
 */
export const ThrottleLimit = (limit: number, ttl: number) => {
  return applyDecorators(
    SetMetadata('throttle:limit', limit),
    SetMetadata('throttle:ttl', ttl),
    Throttle({ default: { limit, ttl } })
  );
};

/**
 * 严格速率限制 - 1分钟内200次请求（用于敏感操作）
 */
export const ThrottleStrict = () => ThrottleLimit(200, 60000);

/**
 * 登录速率限制 - 1分钟内5次登录尝试
 */
export const ThrottleLogin = () => ThrottleLimit(5, 60000);

/**
 * 注册速率限制 - 1小时内10次注册尝试
 */
export const ThrottleRegister = () => ThrottleLimit(10, 3600000);

/**
 * 文件上传速率限制 - 1分钟内10次上传
 */
export const ThrottleUpload = () => ThrottleLimit(10, 60000);

/**
 * 宽松速率限制 - 1分钟内500次请求（用于高频接口）
 */
export const ThrottleLoose = () => ThrottleLimit(500, 60000);
