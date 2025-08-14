import { OmitType } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class UserResponseDto extends OmitType(User, ['password'] as const) {
  static fromUser(user: User): UserResponseDto {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponseDto;
  }
}
