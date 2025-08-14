import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

/**
 * 角色权限装饰器的元数据键
 */
export const ROLES_KEY = 'roles';

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