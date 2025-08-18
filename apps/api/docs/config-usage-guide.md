# ConfigModule 使用指南

本文档详细说明了如何在其他模块中使用 `ConfigModule` 来访问环境变量。

## 1. ConfigModule 配置

`ConfigModule` 位于 `src/modules/config/config.module.ts`，它是一个全局模块，配置如下：

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['.env', '.env.dev', '.env.prod'],
      isGlobal: true // 设置为全局模块
    })
  ],
  providers: [],
  exports: []
})
export class ConfigModule {}
```

## 2. 环境变量接口定义

在 `src/modules/config/env.interface.ts` 中定义了环境变量的类型：

```typescript
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_CALLBACK_URL: string;
  FRONTEND_URL: string;
  ENABLE_SWAGGER: boolean;
  ENABLE_CORS: boolean;
}
```

## 3. 在其他模块中使用 ConfigService

### 3.1 基本用法

由于 `ConfigModule` 设置为全局模块（`isGlobal: true`），其他模块可以直接注入 `ConfigService` 而无需导入 `ConfigModule`。

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.interface';

@Injectable()
export class SomeService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {}

  someMethod() {
    // 获取环境变量
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const port = this.configService.get<number>('PORT', 3000); // 带默认值
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    // 使用环境变量
    console.log(`JWT Secret: ${jwtSecret}`);
    console.log(`Port: ${port}`);
    console.log(`Environment: ${nodeEnv}`);
  }
}
```

### 3.2 在模块配置中使用（异步配置）

#### 示例1：数据库模块配置

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 如果不是全局模块需要导入
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          throw new Error('DATABASE_URL environment variable is not set');
        }

        const url = new URL(databaseUrl);

        return {
          type: 'mysql',
          host: url.hostname,
          port: parseInt(url.port) || 3306,
          username: url.username,
          password: url.password,
          database: url.pathname.slice(1),
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          synchronize: configService.get<string>('NODE_ENV') === 'development',
          logging: configService.get<string>('NODE_ENV') === 'development'
        };
      },
      inject: [ConfigService] // 注入 ConfigService
    })
  ]
})
export class DatabaseModule {}
```

#### 示例2：JWT 模块配置

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d')
        }
      }),
      inject: [ConfigService]
    })
  ]
})
export class AuthModule {}
```

### 3.3 在 Passport 策略中使用

#### JWT 策略示例

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key')
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    // 验证逻辑
  }
}
```

#### GitHub OAuth 策略示例

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>(
        'GITHUB_CALLBACK_URL',
        'http://localhost:3000/auth/github/callback'
      ),
      scope: ['user:email']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // OAuth 验证逻辑
  }
}
```

### 3.4 在控制器中使用

```typescript
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('info')
  getConfigInfo() {
    return {
      environment: this.configService.get<string>('NODE_ENV'),
      port: this.configService.get<number>('PORT'),
      frontendUrl: this.configService.get<string>('FRONTEND_URL')
      // 注意：不要暴露敏感信息如密钥
    };
  }
}
```

## 4. 最佳实践

### 4.1 类型安全

使用泛型指定环境变量的类型：

```typescript
// 推荐
const port = this.configService.get<number>('PORT', 3000);
const isProduction =
  this.configService.get<string>('NODE_ENV') === 'production';

// 不推荐
const port = this.configService.get('PORT'); // 返回 any 类型
```

### 4.2 提供默认值

```typescript
// 为非必需的配置项提供默认值
const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '7d');
const enableSwagger = this.configService.get<boolean>('ENABLE_SWAGGER', true);
```

### 4.3 验证必需的环境变量

```typescript
const databaseUrl = this.configService.get<string>('DATABASE_URL');
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}
```

### 4.4 创建配置服务

对于复杂的配置，可以创建专门的配置服务：

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get isDevelopment(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'development';
  }

  get isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  get jwtConfig() {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d')
    };
  }

  get githubConfig() {
    return {
      clientId: this.configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackUrl: this.configService.get<string>('GITHUB_CALLBACK_URL')
    };
  }
}
```

## 5. 环境变量文件

项目支持多个环境变量文件：

- `.env` - 默认环境变量
- `.env.dev` - 开发环境
- `.env.prod` - 生产环境

加载优先级：`.env.prod` > `.env.dev` > `.env`

## 6. 注意事项

1. **安全性**：不要在代码中硬编码敏感信息，始终使用环境变量
2. **类型安全**：使用 TypeScript 泛型确保类型安全
3. **默认值**：为非关键配置提供合理的默认值
4. **验证**：在应用启动时验证必需的环境变量
5. **文档**：保持环境变量接口定义的更新

通过以上方式，你可以在任何模块中安全、类型安全地使用环境变量配置。
