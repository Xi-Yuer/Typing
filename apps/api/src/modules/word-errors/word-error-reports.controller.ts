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
  Request
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth
} from '@nestjs/swagger';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/premission.decorator';
import { Role } from 'common';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiPaginationResponse
} from '../../common/decorators/api-response.decorator';
import { WordErrorReportsService } from './word-error-reports.service';
import { CreateWordErrorReportDto } from './dto/create-word-error-report.dto';
import { UpdateWordErrorReportDto } from './dto/update-word-error.dto';
import { ReportStatsDto } from './dto/report-stats.dto';
import { WordErrorReport } from './entities/word-error.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('单词错误报告')
@Controller('word-error-reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class WordErrorReportsController {
  constructor(
    private readonly wordErrorReportsService: WordErrorReportsService
  ) {}

  @Post()
  @ApiOperation({ summary: '提交单词错误报告' })
  @ApiCreatedResponse(WordErrorReport, { description: '提交单词错误报告成功' })
  create(
    @Body() createWordErrorReportDto: CreateWordErrorReportDto,
    @Request() req: any
  ) {
    return this.wordErrorReportsService.create(
      createWordErrorReportDto,
      req.user.id
    );
  }

  @Get('paginated')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '分页查询所有错误报告（仅管理员）' })
  @ApiPaginationResponse(WordErrorReport, {
    description: '分页查询错误报告成功'
  })
  findAllPaginated(@Query() paginationQuery: PaginationQueryDto) {
    return this.wordErrorReportsService.findAllPaginated(paginationQuery);
  }

  @Get('my-reports')
  @ApiOperation({ summary: '查询我的错误报告' })
  @ApiPaginationResponse(WordErrorReport, {
    description: '查询我的错误报告成功'
  })
  findMyReports(
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req: any
  ) {
    return this.wordErrorReportsService.findAllPaginated(
      paginationQuery,
      req.user.id
    );
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '获取错误报告统计信息（仅管理员）' })
  @ApiSuccessResponse(ReportStatsDto, {
    description: '获取错误报告统计信息成功'
  })
  getReportStats() {
    return this.wordErrorReportsService.getReportStats();
  }

  @Get('search')
  @ApiOperation({ summary: '搜索我的错误报告' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', type: String })
  @ApiSuccessResponse([WordErrorReport], { description: '搜索错误报告成功' })
  searchMyReports(
    @Query('keyword') keyword: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req: any
  ) {
    return this.wordErrorReportsService.searchReports(
      keyword,
      paginationQuery,
      req.user.id
    );
  }

  @Get('search/paginated')
  @ApiOperation({ summary: '分页搜索我的错误报告' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', type: String })
  @ApiPaginationResponse(WordErrorReport, {
    description: '分页搜索错误报告成功'
  })
  searchMyReportsPaginated(
    @Query('keyword') keyword: string,
    @Query() paginationQuery: PaginationQueryDto,
    @Request() req: any
  ) {
    return this.wordErrorReportsService.searchReports(
      keyword,
      paginationQuery,
      req.user.id
    );
  }

  @Get('admin/search')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '搜索所有错误报告（仅管理员）' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', type: String })
  @ApiSuccessResponse([WordErrorReport], { description: '搜索错误报告成功' })
  searchAllReports(
    @Query('keyword') keyword: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    return this.wordErrorReportsService.searchReports(keyword, paginationQuery);
  }

  @Get('admin/search/paginated')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '分页搜索所有错误报告（仅管理员）' })
  @ApiQuery({ name: 'keyword', description: '搜索关键词', type: String })
  @ApiPaginationResponse(WordErrorReport, {
    description: '分页搜索错误报告成功'
  })
  searchAllReportsPaginated(
    @Query('keyword') keyword: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    return this.wordErrorReportsService.searchReports(keyword, paginationQuery);
  }

  @Get('status/:status')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '根据状态查询错误报告（仅管理员）' })
  @ApiParam({
    name: 'status',
    description: '报告状态',
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected']
  })
  @ApiPaginationResponse(WordErrorReport, {
    description: '根据状态查询错误报告成功'
  })
  findByStatus(
    @Param('status') status: 'pending' | 'reviewing' | 'accepted' | 'rejected',
    @Query() paginationQuery: PaginationQueryDto
  ) {
    return this.wordErrorReportsService.findByStatus(status, paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 ID 查询错误报告详情' })
  @ApiParam({ name: 'id', description: '错误报告 ID', type: String })
  @ApiSuccessResponse(WordErrorReport, { description: '查询错误报告详情成功' })
  findOne(@Param('id') id: string) {
    return this.wordErrorReportsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '更新错误报告（仅管理员）' })
  @ApiParam({ name: 'id', description: '错误报告 ID', type: String })
  @ApiSuccessResponse(WordErrorReport, { description: '更新错误报告成功' })
  update(
    @Param('id') id: string,
    @Body() updateWordErrorReportDto: UpdateWordErrorReportDto,
    @Request() req: any
  ) {
    return this.wordErrorReportsService.update(
      id,
      updateWordErrorReportDto,
      req.user.id
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: '删除错误报告（仅管理员）' })
  @ApiParam({ name: 'id', description: '错误报告 ID', type: String })
  @ApiSuccessResponse(Object, { description: '删除错误报告成功' })
  remove(@Param('id') id: string) {
    return this.wordErrorReportsService.remove(id);
  }
}
