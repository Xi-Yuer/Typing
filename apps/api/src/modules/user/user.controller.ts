import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '创建用户成功', type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '查询所有用户' })
  @ApiResponse({ status: 200, description: '返回所有用户', type: [User] })
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: '查询当前用户' })
  @ApiResponse({ status: 200, description: '返回当前用户', type: User })
  @ApiResponse({ status: 404, description: '用户不存在' })
  findMe(@Headers('Authorization') auth: string) {
    return this.userService.findMe(auth);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询用户' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiResponse({ status: 200, description: '返回用户', type: User })
  @ApiResponse({ status: 404, description: '用户不存在' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '根据ID更新用户' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiResponse({ status: 200, description: '更新用户成功', type: User })
  @ApiResponse({ status: 404, description: '用户不存在' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据ID删除用户' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiResponse({ status: 200, description: '删除用户成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
