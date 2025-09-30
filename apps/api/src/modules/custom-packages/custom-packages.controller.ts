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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomPackagesService } from './custom-packages.service';
import { CreateCustomPackageDto } from './dto/create-custom-package.dto';
import { UpdateCustomPackageDto } from './dto/update-custom-package.dto';
import { CreateCustomWordDto } from './dto/create-custom-word.dto';
import { UpdateCustomWordDto } from './dto/update-custom-word.dto';
import { ImportWordsDto } from './dto/import-words.dto';
import { QueryCustomWordDto } from './dto/query-custom-word.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CustomPackage } from './entities/custom-package.entity';
import { CustomWord } from './entities/custom-word.entity';
import {
  ApiPaginationResponse,
  ApiSuccessResponse
} from '@/common/decorators/api-response.decorator';
import { NoCache } from '@/common/decorators/no-cache.decorator';

@ApiTags('自定义学习包')
@Controller('custom-packages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomPackagesController {
  constructor(private readonly customPackagesService: CustomPackagesService) {}

  @Post()
  @ApiOperation({ summary: '创建自定义学习包' })
  @ApiSuccessResponse(CustomPackage, {
    description: '创建自定义学习包成功'
  })
  async create(
    @Body() createCustomPackageDto: CreateCustomPackageDto,
    @Request() req: any
  ) {
    return await this.customPackagesService.create(
      createCustomPackageDto,
      req.user.id
    );
  }

  @Get('my')
  @ApiOperation({ summary: '获取我的自定义学习包列表' })
  @ApiPaginationResponse(CustomPackage, {
    description: '获取我的自定义学习包列表成功'
  })
  @NoCache()
  async findMyPackages(@Request() req: any) {
    return await this.customPackagesService.findAllByUser(req.user.id);
  }

  @Get('public')
  @ApiOperation({ summary: '获取公开的自定义学习包列表' })
  @ApiPaginationResponse(CustomPackage, {
    description: '获取公开的自定义学习包列表成功'
  })
  @NoCache()
  async findPublicPackages() {
    return await this.customPackagesService.findPublic();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取自定义学习包详情' })
  @ApiSuccessResponse(CustomPackage, {
    description: '获取自定义学习包详情成功'
  })
  @NoCache()
  async findOne(@Param('id') id: string, @Request() req: any) {
    return await this.customPackagesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新自定义学习包' })
  @ApiSuccessResponse(CustomPackage, {
    description: '更新自定义学习包成功'
  })
  async update(
    @Param('id') id: string,
    @Body() updateCustomPackageDto: UpdateCustomPackageDto,
    @Request() req: any
  ) {
    return await this.customPackagesService.update(
      id,
      updateCustomPackageDto,
      req.user.id
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除自定义学习包' })
  @ApiSuccessResponse(CustomPackage, {
    description: '删除自定义学习包成功'
  })
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.customPackagesService.remove(id, req.user.id);
    return { message: '删除成功' };
  }

  @Get(':id/words')
  @ApiOperation({ summary: '获取学习包中的单词列表' })
  @ApiPaginationResponse(CustomWord, {
    description: '获取学习包中的单词列表成功'
  })
  @ApiSuccessResponse(CustomWord, {
    description: '获取学习包中的单词列表成功'
  })
  async findWordsByPackage(
    @Param('id') packageId: string,
    @Query() queryDto: QueryCustomWordDto,
    @Request() req: any
  ) {
    return await this.customPackagesService.findWordsByPackage(
      packageId,
      req.user.id,
      queryDto
    );
  }

  @Post(':id/words')
  @ApiOperation({ summary: '向学习包添加单词' })
  @ApiSuccessResponse(CustomWord, {
    description: '向学习包添加单词成功'
  })
  async addWord(
    @Param('id') packageId: string,
    @Body() createCustomWordDto: CreateCustomWordDto,
    @Request() req: any
  ) {
    return await this.customPackagesService.addWord(
      packageId,
      createCustomWordDto,
      req.user.id
    );
  }

  @Patch(':id/words/:wordId')
  @ApiOperation({ summary: '更新学习包中的单词' })
  @ApiSuccessResponse(CustomWord, {
    description: '更新学习包中的单词成功'
  })
  async updateWord(
    @Param('id') packageId: string,
    @Param('wordId') wordId: string,
    @Body() updateCustomWordDto: UpdateCustomWordDto,
    @Request() req: any
  ) {
    return await this.customPackagesService.updateWord(
      packageId,
      wordId,
      updateCustomWordDto,
      req.user.id
    );
  }

  @Delete(':id/words/:wordId')
  @ApiOperation({ summary: '删除学习包中的单词' })
  @ApiSuccessResponse(CustomWord, {
    description: '删除学习包中的单词成功'
  })
  async removeWord(
    @Param('id') packageId: string,
    @Param('wordId') wordId: string,
    @Request() req: any
  ) {
    await this.customPackagesService.removeWord(packageId, wordId, req.user.id);
    return { message: '删除成功' };
  }

  @Post(':id/words/import')
  @ApiOperation({ summary: '批量导入单词到学习包' })
  @ApiSuccessResponse(CustomWord, {
    description: '批量导入单词到学习包成功'
  })
  async importWords(
    @Param('id') packageId: string,
    @Body() importWordsDto: ImportWordsDto,
    @Request() req: any
  ) {
    return await this.customPackagesService.importWords(
      packageId,
      importWordsDto,
      req.user.id
    );
  }
}
