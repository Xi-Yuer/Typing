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
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginationResponse,
} from '@/common/decorators/api-response.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { RequireUserStatus } from '@/common/decorators/user-status.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role, UserStatus } from 'common';

@ApiTags('用户管理')
@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequireUserStatus(UserStatus.ACTIVE)
  @ApiOperation({ summary: '创建用户（仅管理员）' })
  @ApiCreatedResponse(User, { description: '创建用户成功' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('paginated')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequireUserStatus(UserStatus.ACTIVE)
  @ApiOperation({ summary: '分页查询用户（仅管理员）' })
  @ApiPaginationResponse(User, { description: '分页查询用户成功' })
  findPaginated(@Query() query: PaginationQueryDto) {
    return this.userService.findPaginated(query);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequireUserStatus(UserStatus.ACTIVE)
  @ApiOperation({ summary: '查询所有用户（已废弃，请使用分页查询，仅管理员）' })
  @ApiSuccessResponse([User], { description: '返回所有用户' })
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @RequireUserStatus(UserStatus.ACTIVE)
  @ApiOperation({ summary: '查询当前用户' })
  @ApiSuccessResponse(User, { description: '返回当前用户' })
  findMe(@Req() req: any) {
    return this.userService.findMe(req.user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequireUserStatus(UserStatus.ACTIVE)
  @ApiOperation({ summary: '根据ID查询用户（仅管理员）' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiSuccessResponse(User, { description: '返回用户' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequireUserStatus(UserStatus.ACTIVE)
  @ApiOperation({ summary: '根据ID更新用户（仅管理员）' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiSuccessResponse(User, { description: '更新用户成功' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @RequireUserStatus(UserStatus.ACTIVE)
  @ApiOperation({ summary: '根据ID删除用户（仅超级管理员）' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiSuccessResponse(undefined, { description: '删除用户成功' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
