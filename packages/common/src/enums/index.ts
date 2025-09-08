/**
 * 用户角色枚举
 */
export enum Role {
  /** 超级管理员 */
  SUPER_ADMIN = 'super_admin',
  /** 管理员 */
  ADMIN = 'admin',
  /** 普通用户 */
  USER = 'user',
  /** 访客 */
  GUEST = 'guest'
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  /** 正常 */
  ACTIVE = 'active',
  /** 禁用 */
  DISABLED = 'disabled',
  /** 待激活 */
  PENDING = 'pending',
  /** 已删除 */
  DELETED = 'deleted'
}
