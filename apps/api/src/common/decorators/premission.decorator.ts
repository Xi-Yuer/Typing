import { SetMetadata } from '@nestjs/common';
import { Role, UserStatus } from 'common';

/**
 * 角色权限装饰器的元数据键
 */
export const ROLES_KEY = 'roles';

/**
 * 用户状态装饰器的元数据键
 */
export const USER_STATUS_KEY = 'userStatus';

/**
 * 角色权限装饰器
 * 用于标记接口所需的角色权限
 *
 * @param roles 允许访问的角色列表
 * @example
 * ```typescript
 * @Roles(Role.ADMIN, Role.SUPER_ADMIN)
 * @Get('admin-only')
 * adminOnlyEndpoint() {
 *   return 'Only admins can access this';
 * }
 * ```
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

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
