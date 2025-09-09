import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/premission.decorator';
import { Role } from 'common';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginationResponse
} from '../../common/decorators/api-response.decorator';
import { CorpusCategoriesService } from './corpus-categories.service';
import { CreateCorpusCategoryDto } from './dto/create-corpus-category.dto';
import { UpdateCorpusCategoryDto } from './dto/update-corpus-category.dto';
import { CorpusCategory } from './entities/corpus-category.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('语料库分类管理')
@Controller('corpus-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CorpusCategoriesController {
  constructor(
    private readonly corpusCategoriesService: CorpusCategoriesService
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '创建语料库分类（仅管理员）' })
  @ApiBody({ type: CreateCorpusCategoryDto })
  @ApiCreatedResponse(CorpusCategory, { description: '创建语料库分类成功' })
  create(@Body() createCorpusCategoryDto: CreateCorpusCategoryDto) {
    return this.corpusCategoriesService.create(createCorpusCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有语料库分类' })
  @ApiPaginationResponse(CorpusCategory, {
    description: '获取所有语料库分类成功'
  })
  findAll() {
    return this.corpusCategoriesService.findAll();
  }

  @Get('paginated')
  @Public()
  @ApiOperation({ summary: '分页查询语料库分类' })
  @ApiPaginationResponse(CorpusCategory, {
    description: '分页查询语料库分类成功'
  })
  findAllPaginated(@Query() paginationQuery: PaginationQueryDto) {
    return this.corpusCategoriesService.findAllPaginated(paginationQuery);
  }

  @Get('language/:languageId')
  @Public()
  @ApiOperation({ summary: '根据语言 ID 查询分类' })
  @ApiParam({ name: 'languageId', description: '语言 ID', type: String })
  @ApiPaginationResponse(CorpusCategory, {
    description: '根据语言 ID 查询分类成功'
  })
  findByLanguageId(@Param('languageId') languageId: string) {
    return this.corpusCategoriesService.findByLanguageId(languageId);
  }

  @Get('difficulty/:difficulty')
  @Public()
  @ApiOperation({ summary: '根据难度等级查询分类' })
  @ApiParam({
    name: 'difficulty',
    description: '难度等级（1-5）',
    type: Number
  })
  @ApiPaginationResponse(CorpusCategory, {
    description: '根据难度等级查询分类成功'
  })
  findByDifficulty(@Param('difficulty', ParseIntPipe) difficulty: number) {
    return this.corpusCategoriesService.findByDifficulty(difficulty);
  }

  @Get('language/:languageId/difficulty/:difficulty')
  @Public()
  @ApiOperation({ summary: '根据语言 ID 和难度等级查询分类' })
  @ApiParam({ name: 'languageId', description: '语言 ID', type: String })
  @ApiParam({
    name: 'difficulty',
    description: '难度等级（1-5）',
    type: Number
  })
  @ApiPaginationResponse(CorpusCategory, {
    description: '根据语言 ID 和难度等级查询分类成功'
  })
  findByLanguageAndDifficulty(
    @Param('languageId') languageId: string,
    @Param('difficulty', ParseIntPipe) difficulty: number
  ) {
    return this.corpusCategoriesService.findByLanguageAndDifficulty(
      languageId,
      difficulty
    );
  }

  @Get('stats/difficulty')
  @Public()
  @ApiOperation({ summary: '获取难度等级统计' })
  @ApiSuccessResponse(undefined, { description: '获取难度等级统计成功' })
  getDifficultyStats() {
    return this.corpusCategoriesService.getDifficultyStats();
  }

  @Get('stats/language')
  @Public()
  @ApiOperation({ summary: '获取语言分类数量统计' })
  @ApiSuccessResponse(undefined, { description: '获取语言分类数量统计成功' })
  getLanguageStats() {
    return this.corpusCategoriesService.getLanguageStats();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '根据 ID 查询语料库分类' })
  @ApiParam({ name: 'id', description: '分类 ID', type: String })
  @ApiSuccessResponse(CorpusCategory, { description: '查询语料库分类成功' })
  findOne(@Param('id') id: string) {
    return this.corpusCategoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '更新语料库分类（仅管理员）' })
  @ApiParam({ name: 'id', description: '分类 ID', type: String })
  @ApiBody({ type: UpdateCorpusCategoryDto })
  @ApiSuccessResponse(CorpusCategory, { description: '更新语料库分类成功' })
  update(
    @Param('id') id: string,
    @Body() updateCorpusCategoryDto: UpdateCorpusCategoryDto
  ) {
    return this.corpusCategoriesService.update(id, updateCorpusCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '删除语料库分类（仅管理员）' })
  @ApiParam({ name: 'id', description: '分类 ID', type: String })
  @ApiSuccessResponse(undefined, { description: '删除语料库分类成功' })
  remove(@Param('id') id: string) {
    return this.corpusCategoriesService.remove(id);
  }
}
