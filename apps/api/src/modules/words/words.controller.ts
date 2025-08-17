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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/premission.decorator';
import { Role } from 'common';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginationResponse,
} from '../../common/decorators/api-response.decorator';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './entities/word.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('单词管理')
@Controller('words')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
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
  @ApiPaginationResponse(Word, { description: '分页查询单词成功' })
  findAllPaginated(@Query() paginationQuery: PaginationQueryDto) {
    return this.wordsService.findAllPaginated(paginationQuery);
  }

  @Get('language/:languageId')
  @ApiOperation({ summary: '根据语言 ID 查询单词' })
  @ApiParam({ name: 'languageId', description: '语言 ID', type: String })
  @ApiPaginationResponse(Word, { description: '根据语言 ID 查询单词成功' })
  findByLanguageId(@Param('languageId') languageId: string, @Query() paginationQuery: PaginationQueryDto) {
    return this.wordsService.findByLanguageId(languageId, paginationQuery);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: '根据分类 ID 查询单词' })
  @ApiParam({ name: 'categoryId', description: '分类 ID', type: String })
  @ApiPaginationResponse(Word, { description: '根据分类 ID 查询单词成功' })
  findByCategoryId(@Param('categoryId') categoryId: string, @Query() paginationQuery: PaginationQueryDto) {
    return this.wordsService.findByCategoryId(categoryId, paginationQuery);
  }

  @Get('language/:languageId/category/:categoryId')
  @ApiOperation({ summary: '根据语言和分类查询单词' })
  @ApiParam({ name: 'languageId', description: '语言 ID', type: String })
  @ApiParam({ name: 'categoryId', description: '分类 ID', type: String })
  @ApiPaginationResponse(Word, { description: '根据语言和分类查询单词成功' })
  findByLanguageAndCategory(
    @Param('languageId') languageId: string,
    @Param('categoryId') categoryId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.wordsService.findByLanguageAndCategory(languageId, categoryId, paginationQuery);
  }

  @Get('search')
  @ApiOperation({ summary: '搜索单词' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', type: String })
  @ApiQuery({ name: 'languageId', description: '语言 ID', type: String, required: false })
  @ApiQuery({ name: 'categoryId', description: '分类 ID', type: String, required: false })
  @ApiSuccessResponse([Word], { description: '搜索单词成功' })
  searchWords(
    @Query('keyword') keyword: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Query('languageId') languageId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.wordsService.searchWords(keyword, paginationQuery, languageId, categoryId);
  }

  @Get('search/paginated')
  @ApiOperation({ summary: '分页搜索单词' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', type: String })
  @ApiQuery({ name: 'languageId', description: '语言 ID', type: String, required: false })
  @ApiQuery({ name: 'categoryId', description: '分类 ID', type: String, required: false })
  @ApiPaginationResponse(Word, { description: '分页搜索单词成功' })
  searchWordsPaginated(
    @Query('keyword') keyword: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Query('languageId') languageId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.wordsService.searchWordsPaginated(
      keyword,
      paginationQuery,
      languageId,
      categoryId,
    );
  }

  @Get('random')
  @CacheTTL(1)
  @ApiOperation({ summary: '随机获取单词（用于练习）' })
  @ApiQuery({ name: 'count', description: '单词数量', type: Number, required: false })
  @ApiQuery({ name: 'languageId', description: '语言 ID', type: String, required: false })
  @ApiQuery({ name: 'categoryId', description: '分类 ID', type: String, required: false })
  @ApiSuccessResponse([Word], { description: '随机获取单词成功' })
  getRandomWords(
    @Query('count') count?: number,
    @Query('languageId') languageId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.wordsService.getRandomWords(count, languageId, categoryId);
  }

  @Get('stats/language')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '获取语言统计信息（仅管理员）' })
  @ApiSuccessResponse(Object, { description: '获取语言统计信息成功' })
  getLanguageStats() {
    return this.wordsService.getLanguageStats();
  }

  @Get('stats/category')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '获取分类统计信息（仅管理员）' })
  @ApiSuccessResponse(Object, { description: '获取分类统计信息成功' })
  getCategoryStats() {
    return this.wordsService.getCategoryStats();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 ID 查询单词详情' })
  @ApiParam({ name: 'id', description: '单词 ID', type: String })
  @ApiSuccessResponse(Word, { description: '查询单词详情成功' })
  findOne(@Param('id') id: string) {
    return this.wordsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '更新单词（仅管理员）' })
  @ApiParam({ name: 'id', description: '单词 ID', type: String })
  @ApiSuccessResponse(Word, { description: '更新单词成功' })
  update(@Param('id') id: string, @Body() updateWordDto: UpdateWordDto) {
    return this.wordsService.update(id, updateWordDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '删除单词（仅管理员）' })
  @ApiParam({ name: 'id', description: '单词 ID', type: String })
  @ApiSuccessResponse(Object, { description: '删除单词成功' })
  remove(@Param('id') id: string) {
    return this.wordsService.remove(id);
  }
}
