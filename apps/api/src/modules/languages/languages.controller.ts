import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language } from './entities/language.entity';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginationResponse,
} from '@/common/decorators/api-response.decorator';
import { Roles } from '@/common/decorators/premission.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from 'common';

@ApiTags('语言管理')
@Controller('languages')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '创建语言' })
  @ApiBody({ type: CreateLanguageDto })
  @ApiCreatedResponse(Language, { description: '创建语言成功' })
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.create(createLanguageDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有语言列表' })
  @ApiSuccessResponse([Language], { description: '获取语言列表成功' })
  findAll() {
    return this.languagesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: '获取所有启用的语言列表' })
  @ApiSuccessResponse([Language], { description: '获取启用语言列表成功' })
  findAllActive() {
    return this.languagesService.findAllActive();
  }

  @Get('paginated')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '分页查询语言（仅管理员）' })
  @ApiPaginationResponse(Language, { description: '分页查询语言成功' })
  findAllPaginated(@Query() paginationQuery: PaginationQueryDto) {
    return this.languagesService.findAllPaginated(paginationQuery);
  }

  @Get('code/:code')
  @ApiOperation({ summary: '根据语言代码查询语言' })
  @ApiParam({ name: 'code', description: '语言代码', type: String })
  @ApiSuccessResponse(Language, { description: '查询语言成功' })
  findByCode(@Param('code') code: string) {
    return this.languagesService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询语言' })
  @ApiParam({ name: 'id', description: '语言ID', type: Number })
  @ApiSuccessResponse(Language, { description: '查询语言成功' })
  findOne(@Param('id') id: string) {
    return this.languagesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '更新语言信息' })
  @ApiParam({ name: 'id', description: '语言ID', type: Number })
  @ApiBody({ type: UpdateLanguageDto })
  @ApiSuccessResponse(Language, { description: '更新语言成功' })
  update(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languagesService.update(+id, updateLanguageDto);
  }

  @Patch(':id/toggle-active')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '切换语言启用状态' })
  @ApiParam({ name: 'id', description: '语言ID', type: Number })
  @ApiSuccessResponse(Language, { description: '切换语言状态成功' })
  toggleActive(@Param('id') id: string) {
    return this.languagesService.toggleActive(+id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '删除语言' })
  @ApiParam({ name: 'id', description: '语言ID', type: Number })
  @ApiSuccessResponse(undefined, { description: '删除语言成功' })
  remove(@Param('id') id: string) {
    return this.languagesService.remove(+id);
  }
}
