import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language } from './entities/language.entity';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { PaginationResponseDto } from '@/common/dto/api-response.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    // 检查语言代码是否已存在
    const existingLanguage = await this.languageRepository.findOne({
      where: { code: createLanguageDto.code }
    });

    if (existingLanguage) {
      throw new ConflictException(
        `语言代码 '${createLanguageDto.code}' 已存在`
      );
    }

    const language = this.languageRepository.create({
      ...createLanguageDto,
      isActive: createLanguageDto.isActive ?? true
    });

    return await this.languageRepository.save(language);
  }

  async findAll(): Promise<Language[]> {
    return await this.languageRepository.find({
      order: { createTime: 'DESC' }
    });
  }

  async findAllActive(): Promise<Language[]> {
    return await this.languageRepository.find({
      where: { isActive: true }
    });
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginationResponseDto<Language>> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const [list, total] = await this.languageRepository.findAndCount({
      skip,
      take: pageSize,
      order: { createTime: 'DESC' }
    });

    return new PaginationResponseDto<Language>(list, total, page, pageSize);
  }

  async findOne(id: number): Promise<Language> {
    const language = await this.languageRepository.findOne({
      where: { id }
    });

    if (!language) {
      throw new NotFoundException(`ID为 ${id} 的语言不存在`);
    }

    return language;
  }

  async findByCode(code: string): Promise<Language> {
    const language = await this.languageRepository.findOne({
      where: { code }
    });

    if (!language) {
      throw new NotFoundException(`语言代码 '${code}' 不存在`);
    }

    return language;
  }

  async update(
    id: number,
    updateLanguageDto: UpdateLanguageDto
  ): Promise<Language> {
    const language = await this.findOne(id);

    // 如果更新语言代码，检查是否与其他语言冲突
    if (updateLanguageDto.code && updateLanguageDto.code !== language.code) {
      const existingLanguage = await this.languageRepository.findOne({
        where: { code: updateLanguageDto.code }
      });

      if (existingLanguage) {
        throw new ConflictException(
          `语言代码 '${updateLanguageDto.code}' 已存在`
        );
      }
    }

    Object.assign(language, updateLanguageDto);
    return await this.languageRepository.save(language);
  }

  async remove(id: number): Promise<void> {
    await this.languageRepository.softDelete(id);
  }

  async toggleActive(id: number): Promise<Language> {
    const language = await this.findOne(id);
    language.isActive = !language.isActive;
    return await this.languageRepository.save(language);
  }
}
