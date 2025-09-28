import {
  Controller,
  Get,
  Delete,
  Body,
  UseGuards,
  Request,
  Post
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserSettingsService } from './user-settings.service';
import {
  UpdateUserSettingsDto,
  UserSettingsResponseDto
} from './dto/user-settings.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiSuccessResponse } from '@/common/decorators/api-response.decorator';
import { NoCache } from '@/common/decorators/no-cache.decorator';
import { OptionalAuth } from '@/common/decorators/optional-auth.decorator';

@ApiTags('用户设置')
@Controller('user-settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  @ApiOperation({ summary: '获取用户设置' })
  @ApiSuccessResponse(UserSettingsResponseDto, {
    description: '获取成功'
  })
  @OptionalAuth()
  @NoCache()
  async getUserSettings(@Request() req: any): Promise<UserSettingsResponseDto> {
    const userSettings = await this.userSettingsService.getUserSettings(
      req.user?.id || 0,
      // 用户浏览器平台
      req.headers['user-agent'] || 'unknown'
    );
    return {
      id: userSettings.id,
      userId: userSettings.userId,
      settings: userSettings.settings,
      createTime: userSettings.createTime,
      updateTime: userSettings.updateTime
    };
  }

  @Post('update')
  @ApiOperation({ summary: '更新用户设置' })
  @ApiBody({ type: UpdateUserSettingsDto })
  @ApiSuccessResponse(UserSettingsResponseDto, {
    description: '更新成功'
  })
  async updateUserSettings(
    @Request() req: any,
    @Body() updateDto: UpdateUserSettingsDto
  ): Promise<UserSettingsResponseDto> {
    const userSettings = await this.userSettingsService.updateUserSettings(
      req.user.id,
      updateDto
    );
    return {
      id: userSettings.id,
      userId: userSettings.userId,
      settings: userSettings.settings,
      createTime: userSettings.createTime,
      updateTime: userSettings.updateTime
    };
  }

  @Delete()
  @ApiOperation({ summary: '重置用户设置为默认值' })
  @ApiSuccessResponse(UserSettingsResponseDto, {
    description: '重置成功'
  })
  async resetUserSettings(@Request() req: any): Promise<void> {
    await this.userSettingsService.resetUserSettings(req.user.id);
  }

  @Get('defaults')
  @ApiOperation({ summary: '获取默认设置' })
  @ApiSuccessResponse(UserSettingsResponseDto, {
    description: '获取成功'
  })
  async getDefaultSettings() {
    return this.userSettingsService.getDefaultSettings();
  }
}
