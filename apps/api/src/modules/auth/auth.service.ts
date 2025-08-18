import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  Inject
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserOAuth, OAuthProvider } from '../user/entities/user-oauth.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Role, UserStatus } from 'common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
export interface JwtPayload {
  id: number;
  email: string;
  name: string;
  role?: Role;
  status: UserStatus;
}

export interface AuthResult {
  user: User;
  accessToken: string;
}

export interface AuthResponseResult {
  user: UserResponseDto;
  accessToken: string;
}

export interface OAuthProfile {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  rawData?: any;
}

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserOAuth)
    private readonly userOAuthRepository: Repository<UserOAuth>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.logger = new Logger(AuthService.name);
  }

  /**
   * 用户注册
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseResult> {
    // 检查用户是否已存在
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('邮箱已被注册');
    }

    const existingUserByName = await this.userService.findByName(
      registerDto.name
    );
    if (existingUserByName) {
      throw new ConflictException('用户名已被使用');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 创建用户
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword
    });

    // 生成JWT令牌
    const accessToken = await this.generateToken(user);

    return {
      user: UserResponseDto.fromUser(user),
      accessToken
    };
  }

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto): Promise<AuthResponseResult> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const accessToken = await this.generateToken(user);
    return {
      user: UserResponseDto.fromUser(user),
      accessToken
    };
  }

  /**
   * 验证用户凭据
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * 根据JWT payload验证用户
   */
  async validateUserByJwt(payload: JwtPayload): Promise<User> {
    const cacheKey = `user:${payload.id}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    await this.cacheManager.set(cacheKey, user, 1000 * 60 * 60 * 24);
    return user;
  }

  /**
   * GitHub OAuth登录
   */
  async githubLogin(profile: OAuthProfile): Promise<AuthResult> {
    return this.oauthLogin(OAuthProvider.GITHUB, profile);
  }

  /**
   * QQ OAuth登录
   */
  async qqLogin(profile: OAuthProfile): Promise<AuthResult> {
    return this.oauthLogin(OAuthProvider.QQ, profile);
  }

  /**
   * 通用OAuth登录处理
   */
  private async oauthLogin(
    provider: OAuthProvider,
    profile: OAuthProfile
  ): Promise<AuthResult> {
    // 查找是否已有OAuth绑定记录
    let oauthRecord = await this.userOAuthRepository.findOne({
      where: {
        provider,
        providerId: profile.id
      },
      relations: ['user']
    });

    let user: User;

    if (oauthRecord) {
      // 已有绑定记录，直接登录
      user = oauthRecord.user;

      // 更新OAuth信息
      oauthRecord.providerUsername = profile.username;
      oauthRecord.providerEmail = profile.email;
      oauthRecord.avatarUrl = profile.avatarUrl;
      oauthRecord.rawData = profile.rawData;
      await this.userOAuthRepository.save(oauthRecord);
    } else {
      // 没有绑定记录，检查是否有相同邮箱的用户
      let existingUser: User | null = null;
      if (profile.email) {
        existingUser = await this.userService.findByEmail(profile.email);
      }

      if (!existingUser) {
        // 创建新用户
        user = await this.userService.create({
          name: profile.username,
          email: profile.email || `${profile.username}@${provider}.oauth`,
          password: await bcrypt.hash(Math.random().toString(36), 10), // 随机密码
          isActive: true
        });
      } else {
        user = existingUser;
      }

      // 创建OAuth绑定记录
      oauthRecord = this.userOAuthRepository.create({
        userId: user.id,
        provider,
        providerId: profile.id,
        providerUsername: profile.username,
        providerEmail: profile.email,
        avatarUrl: profile.avatarUrl,
        rawData: profile.rawData
      });
      await this.userOAuthRepository.save(oauthRecord);
    }

    const accessToken = await this.generateToken(user);
    return { user, accessToken };
  }

  /**
   * 绑定第三方账户
   */
  async bindOAuthAccount(
    userId: number,
    provider: OAuthProvider,
    profile: OAuthProfile
  ): Promise<UserOAuth> {
    // 检查是否已绑定
    const existingBinding = await this.userOAuthRepository.findOne({
      where: {
        userId,
        provider
      }
    });

    if (existingBinding) {
      throw new ConflictException(`已绑定${provider}账户`);
    }

    // 检查第三方账户是否已被其他用户绑定
    const existingOAuth = await this.userOAuthRepository.findOne({
      where: {
        provider,
        providerId: profile.id
      }
    });

    if (existingOAuth) {
      throw new ConflictException(`该${provider}账户已被其他用户绑定`);
    }

    // 创建绑定记录
    const oauthRecord = this.userOAuthRepository.create({
      userId,
      provider,
      providerId: profile.id,
      providerUsername: profile.username,
      providerEmail: profile.email,
      avatarUrl: profile.avatarUrl,
      rawData: profile.rawData
    });

    return await this.userOAuthRepository.save(oauthRecord);
  }

  /**
   * 解绑第三方账户
   */
  async unbindOAuthAccount(
    userId: number,
    provider: OAuthProvider
  ): Promise<void> {
    const result = await this.userOAuthRepository.delete({
      userId,
      provider
    });

    if (result.affected === 0) {
      throw new UnauthorizedException(`未找到${provider}绑定记录`);
    }
  }

  /**
   * 获取用户的第三方绑定列表
   */
  async getUserOAuthBindings(userId: number): Promise<UserOAuth[]> {
    return await this.userOAuthRepository.find({
      where: { userId },
      select: [
        'id',
        'provider',
        'providerUsername',
        'providerEmail',
        'avatarUrl',
        'createdAt'
      ]
    });
  }

  /**
   * 生成JWT令牌
   */
  async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status
    };

    return this.jwtService.sign(payload);
  }
}
