import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { OAuthProvider } from '../user/entities/user-oauth.entity';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.interface';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { ApiSuccessResponse } from '@/common/decorators/api-response.decorator';

@ApiTags('认证')
@ApiExtraModels(AuthResponseDto, UserResponseDto, User)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: '用户已存在' })
  @ApiSuccessResponse(AuthResponseDto, { description: '注册成功' })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return new AuthResponseDto(result.user, result.accessToken);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  @ApiSuccessResponse(AuthResponseDto, { description: '登录成功' })
  async login(@Req() req: any) {
    const user = req.user as User;
    const accessToken = await this.authService.generateToken(user);
    const userResponse = UserResponseDto.fromUser(user);
    return new AuthResponseDto(userResponse, accessToken);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth 登录' })
  @ApiResponse({ status: 302, description: '重定向到GitHub授权页面' })
  async githubAuth() {
    // 这个方法不会被执行，因为会被重定向到GitHub
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth 回调' })
  @ApiResponse({ status: 302, description: '登录成功或绑定成功，重定向到前端' })
  async githubCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user as User;
    const frontendUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost';

    try {
      // 正常登录流程
      const result = await this.authService.githubLogin({
        id: user.id.toString(),
        username: user.name,
        email: user.email
      });

      // 重定向到前端，携带token
      res.redirect(`${frontendUrl}/auth/callback?token=${result.accessToken}`);
    } catch (error) {
      // 处理错误，重定向到错误页面
      const errorMessage = error.message || '操作失败';
      res.redirect(
        `${frontendUrl}/auth/error?message=${encodeURIComponent(errorMessage)}`
      );
    }
  }

  @Get('qq')
  @UseGuards(AuthGuard('qq'))
  @ApiOperation({ summary: 'QQ OAuth 登录' })
  @ApiResponse({ status: 302, description: '重定向到QQ授权页面' })
  async qqAuth() {
    // 这个方法不会被执行，因为会被重定向到QQ
  }

  @Get('qq/callback')
  @UseGuards(AuthGuard('qq'))
  @ApiOperation({ summary: 'QQ OAuth 回调' })
  @ApiResponse({ status: 302, description: '登录成功或绑定成功，重定向到前端' })
  async qqCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user as User;
    const state = req.query.state as string;
    const frontendUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost';

    try {
      // 检查是否是绑定流程
      if (state) {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());

        if (stateData.action === 'bind' && stateData.userId) {
          // 绑定流程：将QQ账户绑定到现有用户
          const oauthProfile = {
            id: user.id.toString(),
            username: user.name,
            email: user.email
          };

          await this.authService.bindOAuthAccount(
            stateData.userId,
            OAuthProvider.QQ,
            oauthProfile
          );

          // 重定向到前端绑定成功页面
          res.redirect(
            `${frontendUrl}/settings/account?bind=success&provider=qq`
          );
          return;
        }
      }

      // 正常登录流程
      const result = await this.authService.qqLogin({
        id: user.id.toString(),
        username: user.name,
        email: user.email
      });

      // 重定向到前端，携带token
      res.redirect(`${frontendUrl}/auth/callback?token=${result.accessToken}`);
    } catch (error) {
      // 处理错误，重定向到错误页面
      const errorMessage = error.message || '操作失败';
      res.redirect(
        `${frontendUrl}/auth/error?message=${encodeURIComponent(errorMessage)}`
      );
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('bind/github')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '绑定GitHub账户 - 重定向到GitHub授权页面' })
  @ApiResponse({ status: 302, description: '重定向到GitHub授权页面' })
  async bindGithub(@Req() req: any, @Res() res: Response) {
    const user = req.user as User;
    // 在session或临时存储中保存用户ID，用于绑定流程
    const state = Buffer.from(
      JSON.stringify({ userId: user.id, action: 'bind' })
    ).toString('base64');

    const githubClientId = this.configService.get('GITHUB_CLIENT_ID');
    const callbackUrl = this.configService.get('GITHUB_CALLBACK_URL');

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=user:email&state=${state}`;

    res.redirect(githubAuthUrl);
  }

  @Post('bind/github/manual')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '手动绑定GitHub账户' })
  @ApiResponse({ status: 200, description: '绑定成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 409, description: '账户已绑定' })
  async bindGithubManual(
    @Req() req: any,
    @Body()
    bindData: {
      githubId: string;
      username: string;
      email?: string;
      avatarUrl?: string;
    }
  ) {
    const user = req.user as User;

    const oauthProfile = {
      id: bindData.githubId,
      username: bindData.username,
      email: bindData.email,
      avatarUrl: bindData.avatarUrl
    };

    const binding = await this.authService.bindOAuthAccount(
      user.id,
      OAuthProvider.GITHUB,
      oauthProfile
    );

    return {
      message: 'GitHub账户绑定成功',
      binding: {
        provider: binding.provider,
        providerUsername: binding.providerUsername,
        providerEmail: binding.providerEmail,
        avatarUrl: binding.avatarUrl,
        createdAt: binding.createdAt
      }
    };
  }

  @Post('unbind/github')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '解绑GitHub账户' })
  @ApiResponse({ status: 200, description: '解绑成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async unbindGithub(@Req() req: any) {
    const user = req.user as User;
    await this.authService.unbindOAuthAccount(user.id, OAuthProvider.GITHUB);
    return { message: 'GitHub账户解绑成功' };
  }

  @Get('bind/qq')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '绑定QQ账户 - 重定向到QQ授权页面' })
  @ApiResponse({ status: 302, description: '重定向到QQ授权页面' })
  async bindQQ(@Req() req: any, @Res() res: Response) {
    const user = req.user as User;
    // 在session或临时存储中保存用户ID，用于绑定流程
    const state = Buffer.from(
      JSON.stringify({ userId: user.id, action: 'bind' })
    ).toString('base64');

    const qqClientId = this.configService.get('QQ_CLIENT_ID');
    const callbackUrl = this.configService.get('QQ_CALLBACK_URL');

    const qqAuthUrl = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${qqClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=get_user_info&state=${state}`;

    res.redirect(qqAuthUrl);
  }

  @Post('bind/qq/manual')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '手动绑定QQ账户' })
  @ApiResponse({ status: 200, description: '绑定成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 409, description: '账户已绑定' })
  async bindQQManual(
    @Req() req: any,
    @Body()
    bindData: {
      qqId: string;
      username: string;
      email?: string;
      avatarUrl?: string;
    }
  ) {
    const user = req.user as User;

    const oauthProfile = {
      id: bindData.qqId,
      username: bindData.username,
      email: bindData.email,
      avatarUrl: bindData.avatarUrl
    };

    const binding = await this.authService.bindOAuthAccount(
      user.id,
      OAuthProvider.QQ,
      oauthProfile
    );

    return {
      message: 'QQ账户绑定成功',
      binding: {
        provider: binding.provider,
        providerUsername: binding.providerUsername,
        providerEmail: binding.providerEmail,
        avatarUrl: binding.avatarUrl,
        createdAt: binding.createdAt
      }
    };
  }

  @Post('unbind/qq')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '解绑QQ账户' })
  @ApiResponse({ status: 200, description: '解绑成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async unbindQQ(@Req() req: any) {
    const user = req.user as User;
    await this.authService.unbindOAuthAccount(user.id, OAuthProvider.QQ);
    return { message: 'QQ账户解绑成功' };
  }

  @Get('bindings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户绑定的第三方账户' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getBindings(@Req() req: any) {
    const user = req.user as User;
    return this.authService.getUserOAuthBindings(user.id);
  }
}
