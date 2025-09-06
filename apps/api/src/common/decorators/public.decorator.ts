import { SetMetadata } from '@nestjs/common';

/**
 * 公开访问装饰器的元数据键
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 公开访问装饰器
 * 用于标记不需要JWT认证的接口
 *
 * @example
 * ```typescript
 * @Public()
 * @Get('public-endpoint')
 * publicEndpoint() {
 *   return 'This endpoint is public';
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
