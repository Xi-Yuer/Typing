import { SetMetadata } from '@nestjs/common';

/**
 * 可选认证装饰器
 * 标记接口为可选认证：如果有token则解析用户信息，没有token也允许访问
 */
export const OPTIONAL_AUTH_KEY = 'optional_auth';
export const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH_KEY, true);
