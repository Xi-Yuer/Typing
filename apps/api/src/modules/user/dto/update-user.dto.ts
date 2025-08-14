import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// 普通用户更新 DTO，排除密码字段
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email','isActive','role'] as const)
) {}

// 管理员更新用户 DTO，包含基本字段和管理员特有字段，但排除密码
export class AdminUpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const)
) {}
