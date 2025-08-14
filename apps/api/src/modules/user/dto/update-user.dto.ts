import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiExtraModels } from '@nestjs/swagger';

// 普通用户更新 DTO
@ApiExtraModels(CreateUserDto)
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email','isActive','role'])
) {}

// 管理员更新用户 DTO，包含基本字段和管理员特有字段，但排除密码
@ApiExtraModels(CreateUserDto)
export class AdminUpdateUserDto extends PartialType(  
  OmitType(CreateUserDto, ['password'])
) {}
