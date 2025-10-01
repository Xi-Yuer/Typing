import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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

  @Post('create-package')
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

  @Get('get-my-packages')
  @ApiOperation({ summary: '获取我的自定义学习包列表' })
  @ApiPaginationResponse(CustomPackage, {
    description: '获取我的自定义学习包列表成功'
  })
  @NoCache()
  async findMyPackages(@Request() req: any) {
    return await this.customPackagesService.findAllByUser(req.user.id);
  }

  @Get('get-public-packages')
  @ApiOperation({ summary: '获取公开的自定义学习包列表' })
  @ApiPaginationResponse(CustomPackage, {
    description: '获取公开的自定义学习包列表成功'
  })
  @NoCache()
  async findPublicPackages() {
    return await this.customPackagesService.findPublic();
  }

  @Get('get-package-detail')
  @ApiOperation({ summary: '根据ID获取自定义学习包详情' })
  @ApiSuccessResponse(CustomPackage, {
    description: '获取自定义学习包详情成功'
  })
  @NoCache()
  async findOne(@Query('id') id: string, @Request() req: any) {
    return await this.customPackagesService.findOne(id, req.user.id);
  }

  @Patch('update-package')
  @ApiOperation({ summary: '更新自定义学习包' })
  @ApiSuccessResponse(CustomPackage, {
    description: '更新自定义学习包成功'
  })
  async update(
    @Query('id') id: string,
    @Body() updateCustomPackageDto: UpdateCustomPackageDto,
    @Request() req: any
  ) {
    return await this.customPackagesService.update(
      id,
      updateCustomPackageDto,
      req.user.id
    );
  }

  @Delete('delete-package')
  @ApiOperation({ summary: '删除自定义学习包' })
  @ApiSuccessResponse(CustomPackage, {
    description: '删除自定义学习包成功'
  })
  async remove(@Query('id') id: string, @Request() req: any) {
    await this.customPackagesService.remove(id, req.user.id);
    return { message: '删除成功' };
  }

  @Get('get-package-words')
  @ApiOperation({ summary: '获取学习包中的单词列表' })
  @ApiPaginationResponse(CustomWord, {
    description: '获取学习包中的单词列表成功'
  })
  async findWordsByPackage(
    @Query() queryDto: QueryCustomWordDto,
    @Request() req: any
  ) {
    console.log('queryDto', queryDto);
    return await this.customPackagesService.findWordsByPackage(
      req.user.id,
      queryDto
    );
  }

  @Post('add-word-to-package')
  @ApiOperation({ summary: '向学习包添加单词' })
  @ApiSuccessResponse(CustomWord, {
    description: '向学习包添加单词成功'
  })
  async addWord(
    @Query('id') packageId: string,
    @Body() createCustomWordDto: CreateCustomWordDto,
    @Request() req: any
  ) {
    return await this.customPackagesService.addWord(
      packageId,
      createCustomWordDto,
      req.user.id
    );
  }

  @Patch('update-package-word')
  @ApiOperation({ summary: '更新学习包中的单词' })
  @ApiSuccessResponse(CustomWord, {
    description: '更新学习包中的单词成功'
  })
  async updateWord(
    @Query('id') packageId: string,
    @Query('wordId') wordId: string,
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

  @Delete('delete-package-word')
  @ApiOperation({ summary: '删除学习包中的单词' })
  @ApiSuccessResponse(CustomWord, {
    description: '删除学习包中的单词成功'
  })
  async removeWord(
    @Query('id') packageId: string,
    @Query('wordId') wordId: string,
    @Request() req: any
  ) {
    await this.customPackagesService.removeWord(packageId, wordId, req.user.id);
    return { message: '删除成功' };
  }

  @Post('import-words-to-package')
  @ApiOperation({ summary: '批量导入单词到学习包' })
  @ApiSuccessResponse(CustomWord, {
    description: '批量导入单词到学习包成功'
  })
  async importWords(
    @Query('id') packageId: string,
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
