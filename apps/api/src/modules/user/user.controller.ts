import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/update-user.dto';
import {
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginationResponse
} from '@/common/decorators/api-response.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Roles } from '@/common/decorators/premission.decorator';
import { RequireUserStatus } from '@/common/decorators/premission.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role, UserStatus } from 'common';
import { SelfOrAdminGuard } from '@/common/guards/self-or-admin.guard';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireUserStatus(UserStatus.ACTIVE)
@ApiBearerAuth()
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '创建用户（仅管理员）' })
  @ApiCreatedResponse(User, { description: '创建用户成功' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('paginated')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '分页查询用户（仅管理员）' })
  @ApiPaginationResponse(User, { description: '分页查询用户成功' })
  findPaginated(@Query() query: PaginationQueryDto) {
    return this.userService.findPaginated(query);
  }

  @Get('me')
  @ApiOperation({ summary: '根据用户 Token 查询当前用户' })
  @ApiSuccessResponse(User, { description: '根据用户 Token 查询当前用户成功' })
  findMe(@Req() req: any) {
    return this.userService.findMe(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询用户' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiSuccessResponse<User>(User, { description: '返回用户' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(SelfOrAdminGuard)
  @ApiOperation({
    summary: '根据ID更新用户（用户可修改自己，管理员可修改任何用户）'
  })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiSuccessResponse(User, { description: '更新用户成功' })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch(':id/admin')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: '根据ID更新用户（仅管理员）' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiSuccessResponse(User, { description: '更新用户成功' })
  @ApiBody({ type: AdminUpdateUserDto })
  adminUpdate(
    @Param('id') id: string,
    @Body() adminUpdateUserDto: AdminUpdateUserDto
  ) {
    return this.userService.adminUpdate(+id, adminUpdateUserDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: '根据ID删除用户（仅超级管理员）' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiSuccessResponse(undefined, { description: '删除用户成功' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
