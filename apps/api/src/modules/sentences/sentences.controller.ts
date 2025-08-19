import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth
} from '@nestjs/swagger';
import { SentencesService } from './sentences.service';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { UpdateSentenceDto } from './dto/update-sentence.dto';
import { Sentence } from './entities/sentence.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/premission.decorator';
import { Role } from 'common';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginationResponse
} from '../../common/decorators/api-response.decorator';
import { CacheTTL } from '@nestjs/cache-manager';
import { NoCache } from '@/common/decorators/no-cache.decorator';

@ApiTags('句子管理')
@Controller('sentences')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class SentencesController {
  constructor(private readonly sentencesService: SentencesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '创建句子（仅管理员）' })
  @ApiCreatedResponse(Sentence, { description: '创建句子成功' })
  create(@Body() createSentenceDto: CreateSentenceDto) {
    return this.sentencesService.create(createSentenceDto);
  }

  @Get('paginated')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '分页查询句子（仅管理员）' })
  @ApiPaginationResponse(Sentence, { description: '分页查询句子成功' })
  findAllPaginated(@Query() paginationQuery: PaginationQueryDto) {
    return this.sentencesService.findAllPaginated(paginationQuery);
  }

  @Get('language/:languageId')
  @ApiOperation({ summary: '根据语言 ID 查询句子' })
  @ApiParam({ name: 'languageId', description: '语言 ID', type: String })
  @ApiPaginationResponse(Sentence, { description: '根据语言 ID 查询句子成功' })
  findByLanguageId(
    @Param('languageId') languageId: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    return this.sentencesService.findByLanguageId(languageId, paginationQuery);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: '根据分类 ID 查询句子' })
  @ApiParam({ name: 'categoryId', description: '分类 ID', type: String })
  @ApiPaginationResponse(Sentence, { description: '根据分类 ID 查询句子成功' })
  findByCategoryId(
    @Param('categoryId') categoryId: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    return this.sentencesService.findByCategoryId(categoryId, paginationQuery);
  }

  @Get('language/:languageId/category/:categoryId')
  @ApiOperation({ summary: '根据语言 ID 和分类 ID 查询句子' })
  @ApiParam({ name: 'languageId', description: '语言 ID', type: String })
  @ApiParam({ name: 'categoryId', description: '分类 ID', type: String })
  @ApiPaginationResponse(Sentence, {
    description: '根据语言和分类查询句子成功'
  })
  findByLanguageAndCategory(
    @Param('languageId') languageId: string,
    @Param('categoryId') categoryId: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    return this.sentencesService.findByLanguageAndCategory(
      languageId,
      categoryId,
      paginationQuery
    );
  }

  @Get('search')
  @ApiOperation({ summary: '搜索句子' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', type: String })
  @ApiQuery({
    name: 'languageId',
    description: '语言 ID',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'categoryId',
    description: '分类 ID',
    type: String,
    required: false
  })
  @ApiSuccessResponse([Sentence], { description: '搜索句子成功' })
  searchSentences(
    @Query('keyword') keyword: string,
    @Query('languageId') languageId?: string,
    @Query('categoryId') categoryId?: string
  ) {
    return this.sentencesService.searchSentences(
      keyword,
      languageId,
      categoryId
    );
  }

  @Get('search/paginated')
  @ApiOperation({ summary: '分页搜索句子' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', type: String })
  @ApiQuery({
    name: 'languageId',
    description: '语言 ID',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'categoryId',
    description: '分类 ID',
    type: String,
    required: false
  })
  @ApiPaginationResponse(Sentence, { description: '分页搜索句子成功' })
  searchSentencesPaginated(
    @Query('keyword') keyword: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Query('languageId') languageId?: string,
    @Query('categoryId') categoryId?: string
  ) {
    return this.sentencesService.searchSentencesPaginated(
      keyword,
      paginationQuery,
      languageId,
      categoryId
    );
  }

  @Get('random')
  @NoCache()
  @ApiOperation({ summary: '获取随机句子' })
  @ApiQuery({
    name: 'count',
    description: '数量',
    type: Number,
    required: false
  })
  @ApiQuery({
    name: 'languageId',
    description: '语言 ID',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'categoryId',
    description: '分类 ID',
    type: String,
    required: false
  })
  @ApiSuccessResponse([Sentence], { description: '获取随机句子成功' })
  getRandomSentences(
    @Query('count') count?: number,
    @Query('languageId') languageId?: string,
    @Query('categoryId') categoryId?: string
  ) {
    return this.sentencesService.getRandomSentences(
      count,
      languageId,
      categoryId
    );
  }

  @Get('stats/language')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '获取语言统计信息（仅管理员）' })
  @ApiSuccessResponse(Object, { description: '获取语言统计信息成功' })
  getLanguageStats() {
    return this.sentencesService.getLanguageStats();
  }

  @Get('stats/category')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '获取分类统计信息（仅管理员）' })
  @ApiSuccessResponse(Object, { description: '获取分类统计信息成功' })
  getCategoryStats() {
    return this.sentencesService.getCategoryStats();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 ID 查询句子详情' })
  @ApiParam({ name: 'id', description: '句子 ID', type: String })
  @ApiSuccessResponse(Sentence, { description: '查询句子详情成功' })
  findOne(@Param('id') id: string) {
    return this.sentencesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '更新句子（仅管理员）' })
  @ApiParam({ name: 'id', description: '句子 ID', type: String })
  @ApiSuccessResponse(Sentence, { description: '更新句子成功' })
  update(
    @Param('id') id: string,
    @Body() updateSentenceDto: UpdateSentenceDto
  ) {
    return this.sentencesService.update(id, updateSentenceDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '删除句子（仅管理员）' })
  @ApiParam({ name: 'id', description: '句子 ID', type: String })
  @ApiSuccessResponse(Object, { description: '删除句子成功' })
  remove(@Param('id') id: string) {
    return this.sentencesService.remove(id);
  }
}
