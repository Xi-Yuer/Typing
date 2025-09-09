import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class AuthResponseDto {
  @ApiProperty({ description: '用户信息', type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ description: 'JWT访问令牌' })
  accessToken: string;

  constructor(user: UserResponseDto, accessToken: string) {
    this.user = user;
    this.accessToken = accessToken;
  }
}
