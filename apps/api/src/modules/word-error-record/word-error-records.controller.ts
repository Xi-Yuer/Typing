import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { WordErrorRecordsService } from './word-error-records.service';
import { CreateWordErrorRecordDto } from './dto/create-word-error-record.dto';
import { UpdateWordErrorRecordDto } from './dto/update-word-error-record.dto';
import { QueryWordErrorRecordDto } from './dto/query-word-error-record.dto';
import {
  WordErrorRecordResponseDto,
  WordErrorRecordListResponseDto
} from './dto/word-error-record-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  ApiPaginationResponse,
  ApiSuccessResponse
} from '@/common/decorators/api-response.decorator';
import { CategoryWithErrorsDto } from './dto/category-with-errors.dto';
import { PaginationResponseDto } from '@/common/dto/api-response.dto';
import { NoCache } from '@/common/decorators/no-cache.decorator';
import {
  WordErrorStatisticsDto,
  WordErrorStatisticsResponseDto
} from './dto/word-error-statistics.dto';

@ApiTags('错词记录管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('word-error-records')
export class WordErrorRecordsController {
  constructor(
    private readonly wordErrorRecordsService: WordErrorRecordsService
  ) {}

  @Post()
  @ApiOperation({ summary: '记录单词错误' })
  @ApiResponse({
    status: 201,
    description: '成功记录单词错误',
    type: WordErrorRecordResponseDto
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '单词或分类不存在' })
  async recordWordError(
    @Body() createWordErrorRecordDto: CreateWordErrorRecordDto,
    @Request() req: any
  ): Promise<WordErrorRecordResponseDto> {
    return this.wordErrorRecordsService.recordWordError(
      createWordErrorRecordDto,
      req.user.id.toString()
    );
  }

  @Get()
  @ApiOperation({ summary: '获取用户错词记录列表' })
  @ApiResponse({
    status: 200,
    description: '成功获取错词记录列表',
    type: WordErrorRecordListResponseDto
  })
  async getUserErrorRecords(
    @Query() queryDto: QueryWordErrorRecordDto,
    @Request() req: any
  ): Promise<WordErrorRecordListResponseDto> {
    return this.wordErrorRecordsService.getUserErrorRecords(
      req.user.id.toString(),
      queryDto
    );
  }

  @Get('categories')
  @ApiOperation({ summary: '获取有错词的分类列表' })
  @ApiPaginationResponse<CategoryWithErrorsDto>(CategoryWithErrorsDto, {
    description: '成功获取分类错词统计'
  })
  @NoCache()
  async getCategoriesWithErrors(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number
  ): Promise<PaginationResponseDto<CategoryWithErrorsDto>> {
    return this.wordErrorRecordsService.getCategoriesWithErrors(
      req.user.id.toString(),
      page,
      pageSize
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取错词统计信息' })
  @ApiSuccessResponse(WordErrorStatisticsResponseDto, {
    description: '成功获取错词统计信息'
  })
  @NoCache()
  async getErrorStatistics(
    @Request() req: any
  ): Promise<WordErrorStatisticsDto> {
    return await this.wordErrorRecordsService.getErrorStatistics(
      req.user.id.toString()
    );
  }

  @Get('unpracticed')
  @ApiOperation({ summary: '获取未练习的错词记录（用于练习模式）' })
  @ApiPaginationResponse<WordErrorRecordResponseDto>(
    WordErrorRecordResponseDto,
    {
      description: '成功获取未练习的错词记录'
    }
  )
  async getUnPracticedErrorRecords(
    @Request() req: any,
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number
  ): Promise<PaginationResponseDto<WordErrorRecordResponseDto>> {
    return this.wordErrorRecordsService.getUnPracticedErrorRecords(
      req.user.id.toString(),
      categoryId,
      page,
      pageSize
    );
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: '按分类获取错词记录' })
  @ApiPaginationResponse<WordErrorRecordResponseDto>(
    WordErrorRecordResponseDto,
    {
      description: '成功获取分类错词记录'
    }
  )
  async getErrorRecordsByCategory(
    @Param('categoryId') categoryId: string,
    @Request() req: any,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number
  ): Promise<PaginationResponseDto<WordErrorRecordResponseDto>> {
    return this.wordErrorRecordsService.getErrorRecordsByCategory(
      req.user.id.toString(),
      categoryId,
      page,
      pageSize
    );
  }

  @Get(':wordId')
  @ApiOperation({ summary: '获取单个错词记录详情' })
  @ApiResponse({
    status: 200,
    description: '成功获取错词记录详情',
    type: WordErrorRecordResponseDto
  })
  @ApiResponse({ status: 404, description: '错词记录不存在' })
  async findOne(
    @Param('wordId') wordId: string,
    @Request() req: any
  ): Promise<WordErrorRecordResponseDto> {
    return this.wordErrorRecordsService.findOne(req.user.id.toString(), wordId);
  }

  @Post('/practice/:wordId')
  @ApiOperation({ summary: '标记错词为已练习' })
  @ApiResponse({
    status: 200,
    description: '成功标记为已练习',
    type: WordErrorRecordResponseDto
  })
  @ApiResponse({ status: 404, description: '错词记录不存在' })
  async markAsPracticed(
    @Param('wordId') wordId: string,
    @Request() req: any
  ): Promise<WordErrorRecordResponseDto> {
    return this.wordErrorRecordsService.markAsPracticed(
      req.user.id.toString(),
      wordId
    );
  }

  @Post(':wordId')
  @ApiOperation({ summary: '创建错词记录' })
  @ApiResponse({
    status: 200,
    description: '成功创建错词记录',
    type: WordErrorRecordResponseDto
  })
  @ApiResponse({ status: 404, description: '错词记录不存在' })
  async create(
    @Param('wordId') wordId: string,
    @Body() updateWordErrorRecordDto: UpdateWordErrorRecordDto,
    @Request() req: any
  ): Promise<WordErrorRecordResponseDto> {
    // 这里可以根据需要实现创建逻辑
    // 目前主要使用 markAsPracticed 方法
    return this.wordErrorRecordsService.markAsPracticed(
      req.user.id.toString(),
      wordId
    );
  }

  @Delete(':wordId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除错词记录' })
  @ApiResponse({ status: 204, description: '成功删除错词记录' })
  @ApiResponse({ status: 404, description: '错词记录不存在' })
  async remove(
    @Param('wordId') wordId: string,
    @Request() req: any
  ): Promise<void> {
    return this.wordErrorRecordsService.remove(req.user.id.toString(), wordId);
  }

  @Delete('batch')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '批量删除错词记录' })
  @ApiResponse({ status: 204, description: '成功批量删除错词记录' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async removeBatch(
    @Body() body: { wordIds: string[] },
    @Request() req: any
  ): Promise<void> {
    return this.wordErrorRecordsService.removeBatch(
      req.user.id.toString(),
      body.wordIds
    );
  }
}
