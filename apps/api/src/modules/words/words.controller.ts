import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/premission.decorator';
import { Role } from 'common';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginationResponse
} from '../../common/decorators/api-response.decorator';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './entities/word.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { NoCache } from '@/common/decorators/no-cache.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OptionalAuth } from '@/common/decorators/optional-auth.decorator';
import {
  GetCategoryStatusDto,
  GetLanguageStatusDto
} from './dto/getlanguage-status.dto';
import { GetUserWordsProgressDto } from './dto/get-user-words-progress.dto';

@ApiTags('单词管理')
@Controller('words')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '创建单词（仅管理员）' })
  @ApiCreatedResponse(Word, { description: '创建单词成功' })
  create(@Body() createWordDto: CreateWordDto) {
    return this.wordsService.create(createWordDto);
  }

  @Get('paginated')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '分页查询单词（仅管理员）' })
  @ApiPaginationResponse<Word>(Word, {
    description: '分页查询单词成功'
  })
  findAllPaginated(@Query() paginationQuery: PaginationQueryDto) {
    return this.wordsService.findAllPaginated(paginationQuery);
  }

  @Get('language/:languageId')
  @OptionalAuth()
  @ApiOperation({ summary: '根据语言 ID 查询单词' })
  @ApiParam({ name: 'languageId', description: '语言 ID', type: String })
  @ApiPaginationResponse<Word>(Word, {
    description: '根据语言 ID 查询单词成功'
  })
  findByLanguageId(
    @Param('languageId') languageId: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    return this.wordsService.findByLanguageId(languageId, paginationQuery);
  }

  @Get('category/:categoryId')
  @OptionalAuth()
  @ApiOperation({ summary: '根据分类 ID 查询单词' })
  @ApiParam({ name: 'categoryId', description: '分类 ID', type: String })
  @ApiPaginationResponse<Word>(Word, {
    description: '根据分类 ID 查询单词成功'
  })
  findByCategoryId(
    @Param('categoryId') categoryId: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    return this.wordsService.findByCategoryId(categoryId, paginationQuery);
  }

  @Get('user/progress')
  @OptionalAuth()
  @ApiOperation({ summary: '获取用户分页查询单词的进度' })
  @ApiQuery({ name: 'languageId', description: '语言 ID', type: String })
  @ApiQuery({ name: 'categoryId', description: '分类 ID', type: String })
  @NoCache()
  @ApiSuccessResponse<GetUserWordsProgressDto>(GetUserWordsProgressDto, {
    description: '获取用户分页查询单词的进度成功'
  })
  getUserWordsProgress(
    @Query('languageId') languageId: string,
    @Query('categoryId') categoryId: string,
    @Req() req?: any
  ) {
    return this.wordsService.getUserWordsProgress(
      languageId,
      categoryId,
      req.user?.id
    );
  }

  @Get('language/:languageId/category/:categoryId')
  @OptionalAuth()
  @ApiOperation({ summary: '根据语言和分类查询单词' })
  @ApiParam({ name: 'languageId', description: '语言 ID', type: String })
  @ApiParam({ name: 'categoryId', description: '分类 ID', type: String })
  @ApiPaginationResponse<Word>(Word, {
    description: '根据语言和分类查询单词成功'
  })
  findByLanguageAndCategory(
    @Query() paginationQuery: PaginationQueryDto,
    @Param('languageId') languageId: string,
    @Param('categoryId') categoryId: string,
    @Req() req: any
  ) {
    // 将空字符串转换为 undefined
    const normalizedLanguageId =
      languageId && languageId.trim() !== '' ? languageId : undefined;
    const normalizedCategoryId =
      categoryId && categoryId.trim() !== '' ? categoryId : undefined;

    return this.wordsService.findByLanguageAndCategory(
      paginationQuery,
      normalizedLanguageId,
      normalizedCategoryId,
      req.user
    );
  }

  @Get('search')
  @OptionalAuth()
  @ApiOperation({ summary: '搜索单词' })
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
  @ApiSuccessResponse<Word>(Word, { description: '搜索单词成功' })
  searchWords(
    @Query('keyword') keyword: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Query('languageId') languageId?: string,
    @Query('categoryId') categoryId?: string
  ) {
    return this.wordsService.searchWords(
      keyword,
      paginationQuery,
      languageId,
      categoryId
    );
  }

  @Get('search/paginated')
  @OptionalAuth()
  @ApiOperation({ summary: '分页搜索单词' })
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
  @ApiPaginationResponse<Word>(Word, {
    description: '分页搜索单词成功'
  })
  searchWordsPaginated(
    @Query('keyword') keyword: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Query('languageId') languageId?: string,
    @Query('categoryId') categoryId?: string
  ) {
    return this.wordsService.searchWordsPaginated(
      keyword,
      paginationQuery,
      languageId,
      categoryId
    );
  }

  @Get('random')
  @NoCache()
  @ApiOperation({ summary: '随机获取单词（用于练习）' })
  @ApiQuery({
    name: 'count',
    description: '单词数量',
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
  @ApiSuccessResponse<Word>(Word, { description: '随机获取单词成功' })
  getRandomWords(
    @Query('count') count?: number,
    @Query('languageId') languageId?: string,
    @Query('categoryId') categoryId?: string
  ) {
    return this.wordsService.getRandomWords(count, languageId, categoryId);
  }

  @Get('stats/language')
  @OptionalAuth()
  @ApiOperation({ summary: '获取语言统计信息' })
  @ApiSuccessResponse<GetLanguageStatusDto>(GetLanguageStatusDto, {
    description: '获取语言统计信息成功'
  })
  getLanguageStats() {
    return this.wordsService.getLanguageStats();
  }

  @Get('stats/category')
  @OptionalAuth()
  @ApiOperation({ summary: '获取分类统计信息' })
  @ApiSuccessResponse<GetCategoryStatusDto>(GetCategoryStatusDto, {
    description: '获取分类统计信息成功'
  })
  getCategoryStats() {
    return this.wordsService.getCategoryStats();
  }

  @Get(':id')
  @OptionalAuth()
  @ApiOperation({ summary: '根据 ID 查询单词详情' })
  @ApiParam({ name: 'id', description: '单词 ID', type: String })
  @ApiSuccessResponse(Word, { description: '查询单词详情成功' })
  findOne(@Param('id') id: string) {
    return this.wordsService.findOne(id);
  }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '更新单词（仅管理员）' })
  @ApiParam({ name: 'id', description: '单词 ID', type: String })
  @ApiSuccessResponse(Word, { description: '更新单词成功' })
  update(@Param('id') id: string, @Body() updateWordDto: UpdateWordDto) {
    return this.wordsService.update(id, updateWordDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '删除单词（仅管理员）' })
  @ApiParam({ name: 'id', description: '单词 ID', type: String })
  @ApiSuccessResponse<Word>(Word, { description: '删除单词成功' })
  remove(@Param('id') id: string) {
    return this.wordsService.remove(id);
  }
}
