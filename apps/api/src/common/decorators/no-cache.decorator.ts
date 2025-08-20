import { SetMetadata } from '@nestjs/common';

/**
 * 禁用缓存装饰器
 * 用于标记不需要缓存的控制器方法
 */
export const NO_CACHE_KEY = 'no_cache';
export const NoCache = () => SetMetadata(NO_CACHE_KEY, true);
