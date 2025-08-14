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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginationResponse,
} from '@/common/decorators/api-response.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedResponse(User, { description: '创建用户成功' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('paginated')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '分页查询用户' })
  @ApiPaginationResponse(User, { description: '分页查询用户成功' })
  findPaginated(@Query() query: PaginationQueryDto) {
    return this.userService.findPaginated(query);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '查询当前用户' })
  @ApiSuccessResponse<User[]>(User, { description: '返回当前用户' })
  findMe(@Req() req: any) {
    return this.userService.findMe(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询用户' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiSuccessResponse(User, { description: '返回用户' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '根据ID更新用户' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiSuccessResponse(User, { description: '更新用户成功' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据ID删除用户' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiSuccessResponse(undefined, { description: '删除用户成功' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
