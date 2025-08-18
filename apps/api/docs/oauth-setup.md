# 第三方登录配置指南

本文档介绍如何配置和使用第三方登录功能，目前支持 GitHub OAuth 登录。

## 功能特性

- ✅ 用户注册和登录
- ✅ JWT 令牌认证
- ✅ GitHub OAuth 登录
- ✅ 第三方账户绑定/解绑
- ✅ 用户信息管理
- ✅ 数据库持久化

## 数据库设计

### User 实体

- `id`: 主键
- `name`: 用户名
- `email`: 邮箱
- `password`: 密码（加密存储）
- `isActive`: 是否激活
- `createTime`: 创建时间
- `updateTime`: 更新时间
- `deleteTime`: 删除时间（软删除）

### UserOAuth 实体

- `id`: 主键
- `userId`: 关联用户ID
- `provider`: OAuth提供商（github）
- `providerId`: 第三方平台用户ID
- `accessToken`: 访问令牌
- `refreshToken`: 刷新令牌
- `tokenExpiresAt`: 令牌过期时间
- `providerUsername`: 第三方平台用户名
- `providerEmail`: 第三方平台邮箱
- `avatarUrl`: 头像URL
- `rawData`: 原始数据

## GitHub OAuth 配置

### 1. 创建 GitHub OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: 你的应用名称
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
4. 创建后获取 `Client ID` 和 `Client Secret`

### 2. 配置环境变量

在 `.env.dev` 文件中配置：

```env
# GitHub OAuth配置
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# 前端URL
FRONTEND_URL=http://localhost:3000
```

## API 接口

### 认证相关

#### 用户注册

```http
POST /auth/register
Content-Type: application/json

{
  "name": "用户名",
  "email": "user@example.com",
  "password": "password123"
}
```

#### 用户登录

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GitHub OAuth 登录

```http
GET /auth/github
```

重定向到 GitHub 授权页面

#### 获取用户信息

```http
GET /auth/profile
Authorization: Bearer <jwt-token>
```

#### 获取绑定的第三方账户

```http
GET /auth/bindings
Authorization: Bearer <jwt-token>
```

#### 解绑 GitHub 账户

```http
POST /auth/unbind/github
Authorization: Bearer <jwt-token>
```

## 使用流程

### 1. 新用户 GitHub 登录

1. 用户点击 "GitHub 登录" 按钮
2. 重定向到 `/auth/github`
3. 系统重定向到 GitHub 授权页面
4. 用户授权后，GitHub 重定向到 `/auth/github/callback`
5. 系统创建新用户并绑定 GitHub 账户
6. 返回 JWT 令牌

### 2. 已有用户绑定 GitHub

1. 用户先通过邮箱密码登录
2. 在设置页面点击 "绑定 GitHub"
3. 完成 OAuth 流程
4. 系统将 GitHub 账户绑定到现有用户

### 3. 已绑定用户 GitHub 登录

1. 用户点击 "GitHub 登录"
2. 系统识别已绑定的 GitHub 账户
3. 直接登录对应的用户账户

## 安全考虑

1. **JWT 密钥**: 生产环境必须使用强密钥
2. **HTTPS**: 生产环境必须使用 HTTPS
3. **令牌过期**: 合理设置 JWT 过期时间
4. **密码加密**: 使用 bcrypt 加密存储密码
5. **输入验证**: 所有输入都经过验证
6. **软删除**: 用户数据采用软删除策略

## 扩展其他 OAuth 提供商

要添加其他 OAuth 提供商（如 Google、微信等），需要：

1. 安装对应的 Passport 策略包
2. 在 `OAuthProvider` 枚举中添加新提供商
3. 创建新的策略文件（如 `google.strategy.ts`）
4. 在 `AuthService` 中添加对应的登录方法
5. 在 `AuthController` 中添加对应的路由
6. 在 `AuthModule` 中注册新策略

## 故障排除

### 常见问题

1. **GitHub OAuth 回调失败**
   - 检查回调URL是否正确配置
   - 确认 Client ID 和 Secret 是否正确

2. **JWT 验证失败**
   - 检查 JWT_SECRET 配置
   - 确认令牌格式正确

3. **数据库连接失败**
   - 检查 DATABASE_URL 配置
   - 确认数据库服务正在运行

### 调试技巧

1. 查看应用日志
2. 使用 Swagger 文档测试 API
3. 检查网络请求和响应
4. 验证环境变量配置
