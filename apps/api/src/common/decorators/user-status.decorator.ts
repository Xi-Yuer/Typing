import { SetMetadata } from '@nestjs/common';
import { UserStatus } from 'common';

/**
 * 用户状态装饰器的元数据键
 */
export const USER_STATUS_KEY = 'userStatus';

/**
 * 用户状态装饰器
 * 用于标记接口所需的用户状态
 * 
 * @param statuses 允许访问的用户状态列表
 * @example
 * ```typescript
 * @RequireUserStatus(UserStatus.ACTIVE)
 * @Get('active-only')
 * activeOnlyEndpoint() {
 *   return 'Only active users can access this';
 * }
 * ```
 */
export const RequireUserStatus = (...statuses: UserStatus[]) => 
  SetMetadata(USER_STATUS_KEY, statuses);