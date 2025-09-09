import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordErrorReport } from './entities/word-error.entity';
import { CreateWordErrorReportDto } from './dto/create-word-error-report.dto';
import { UpdateWordErrorReportDto } from './dto/update-word-error.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class WordErrorReportsService {
  constructor(
    @InjectRepository(WordErrorReport)
    private readonly wordErrorReportRepository: Repository<WordErrorReport>
  ) {}

  /**
   * 创建单词错误报告
   */
  async create(
    createWordErrorReportDto: CreateWordErrorReportDto,
    userId: string
  ): Promise<WordErrorReport> {
    // 检查是否已存在相同的错误报告
    const existingReport = await this.wordErrorReportRepository.findOne({
      where: {
        userId,
        wordId: createWordErrorReportDto.wordId,
        status: 'pending'
      }
    });

    if (existingReport) {
      throw new BadRequestException('您已经对该单词提交过错误报告，请等待处理');
    }

    // 创建新的错误报告
    const wordErrorReport = this.wordErrorReportRepository.create({
      ...createWordErrorReportDto,
      userId,
      status: 'pending'
    });

    return await this.wordErrorReportRepository.save(wordErrorReport);
  }

  /**
   * 分页查询错误报告
   */
  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
    userId?: string
  ): Promise<{
    list: WordErrorReport[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.wordErrorReportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.user', 'user')
      .leftJoinAndSelect('report.word', 'word')
      .leftJoinAndSelect('word.language', 'language')
      .leftJoinAndSelect('word.category', 'category')
      .leftJoinAndSelect('report.processor', 'processor')
      .orderBy('report.createdAt', 'DESC');

    if (userId) {
      queryBuilder.where('report.userId = :userId', { userId });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      list: data,
      total,
      page,
      pageSize
    };
  }

  /**
   * 根据ID查询错误报告
   */
  async findOne(id: string): Promise<WordErrorReport> {
    const wordErrorReport = await this.wordErrorReportRepository.findOne({
      where: { id },
      relations: ['user', 'word', 'word.language', 'word.category', 'processor']
    });

    if (!wordErrorReport) {
      throw new NotFoundException(`错误报告 ID ${id} 不存在`);
    }

    return wordErrorReport;
  }

  /**
   * 更新错误报告
   */
  async update(
    id: string,
    updateWordErrorReportDto: UpdateWordErrorReportDto,
    adminId?: string
  ): Promise<WordErrorReport> {
    const wordErrorReport = await this.findOne(id);

    Object.assign(wordErrorReport, updateWordErrorReportDto);

    // 如果是管理员更新状态，记录处理信息
    if (adminId && updateWordErrorReportDto.status) {
      wordErrorReport.processedBy = adminId;
      wordErrorReport.processedAt = new Date();
    }

    return await this.wordErrorReportRepository.save(wordErrorReport);
  }

  /**
   * 删除错误报告（软删除）
   */
  async remove(id: string): Promise<void> {
    await this.wordErrorReportRepository.softDelete(id);
  }

  /**
   * 获取错误报告统计信息
   */
  async getReportStats(): Promise<{
    totalReports: number;
    pendingReports: number;
    reviewingReports: number;
    acceptedReports: number;
    rejectedReports: number;
    recentReports: Array<{ date: string; count: number }>;
  }> {
    const totalReports = await this.wordErrorReportRepository.count();
    const pendingReports = await this.wordErrorReportRepository.count({
      where: { status: 'pending' }
    });
    const reviewingReports = await this.wordErrorReportRepository.count({
      where: { status: 'reviewing' }
    });
    const acceptedReports = await this.wordErrorReportRepository.count({
      where: { status: 'accepted' }
    });
    const rejectedReports = await this.wordErrorReportRepository.count({
      where: { status: 'rejected' }
    });

    // 获取最近7天的报告统计
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentReports = await this.wordErrorReportRepository
      .createQueryBuilder('report')
      .select('DATE(report.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('report.createdAt >= :sevenDaysAgo', { sevenDaysAgo })
      .groupBy('DATE(report.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      totalReports,
      pendingReports,
      reviewingReports,
      acceptedReports,
      rejectedReports,
      recentReports: recentReports.map(item => ({
        date: item.date,
        count: parseInt(item.count)
      }))
    };
  }

  /**
   * 搜索错误报告
   */
  async searchReports(
    keyword: string,
    paginationQuery: PaginationQueryDto,
    userId?: string
  ): Promise<{
    list: WordErrorReport[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.wordErrorReportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.user', 'user')
      .leftJoinAndSelect('report.word', 'word')
      .leftJoinAndSelect('word.language', 'language')
      .leftJoinAndSelect('word.category', 'category')
      .leftJoinAndSelect('report.processor', 'processor')
      .where(
        '(report.errorDescription LIKE :keyword OR word.word LIKE :keyword OR word.meaning LIKE :keyword)',
        { keyword: `%${keyword}%` }
      )
      .orderBy('report.createdAt', 'DESC');

    if (userId) {
      queryBuilder.andWhere('report.userId = :userId', { userId });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      list: data,
      total,
      page,
      pageSize
    };
  }

  /**
   * 根据状态查询报告
   */
  async findByStatus(
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected',
    paginationQuery: PaginationQueryDto
  ): Promise<{
    list: WordErrorReport[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.wordErrorReportRepository.findAndCount({
      where: { status },
      relations: [
        'user',
        'word',
        'word.language',
        'word.category',
        'processor'
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize
    });

    return {
      list: data,
      total,
      page,
      pageSize
    };
  }
}
