# 打字练习应用 Docker 部署指南

本指南将帮助您使用 Docker 一键部署前后端项目，包含 MySQL 数据库和 Redis 缓存。

## 📋 前置要求

- Docker (版本 20.10+)
- Docker Compose (版本 2.0+)
- 至少 4GB 可用内存
- 至少 10GB 可用磁盘空间

## 🚀 快速开始

### 开发环境部署（本地构建）

#### 1. 克隆项目

```bash
git clone <your-repository-url>
cd Typing
```

#### 2. 配置环境变量（可选）

复制环境变量模板文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，根据需要修改配置：

```bash
# 重要：请修改以下安全相关配置
JWT_SECRET=your_super_secret_jwt_key_here

# 如果需要 GitHub 登录功能
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# 如果需要 QQ 登录功能
QQ_CLIENT_ID=your_qq_client_id
QQ_CLIENT_SECRET=your_qq_client_secret

# 如果需要语音功能
YOUDAO_APP_KEY=your_youdao_app_key
YOUDAO_APP_SECRET=your_youdao_app_secret
```

#### 3. 一键部署

```bash
# 构建并启动所有服务
docker-compose up -d
```

### 生产环境部署（预构建镜像）

#### 1. 配置 GitHub Actions

项目已配置 GitHub Actions 自动构建，每次推送到 `main` 分支或创建 tag 时会自动构建并推送 Docker 镜像到 GitHub Container Registry。

#### 2. 更新镜像地址

编辑 `docker-compose.prod.yml` 文件，将镜像地址更新为你的实际地址：
```yaml
services:
  app:
    image: ghcr.io/your-username/typing:latest  # 替换为你的用户名
```

#### 3. 拉取最新镜像并部署
```bash
# 拉取最新镜像
docker-compose -f docker-compose.prod.yml pull

# 启动应用（生产模式）
docker-compose -f docker-compose.prod.yml up -d
```

### 4. 验证部署

等待所有服务启动完成（大约 2-3 分钟），然后访问：

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:80
- **API 文档**: http://localhost:80/doc (如果启用了 Swagger)

## 📊 服务说明

### 服务架构

```
┌─────────────────┐    ┌─────────────────┐
│   前端 (Next.js) │    │   后端 (NestJS)  │
│   端口: 3000    │◄──►│   端口: 80      │
└─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐
│  MySQL 数据库   │◄──►│   Redis 缓存    │
│   端口: 3306    │    │   端口: 6379    │
└─────────────────┘    └─────────────────┘
```

### 部署模式

#### 开发模式 (docker-compose.yml)
- 使用本地 Dockerfile 构建镜像
- 适合开发和测试
- 支持代码修改后重新构建

#### 生产模式 (docker-compose.prod.yml)
- 使用预构建的 Docker 镜像
- 镜像通过 GitHub Actions 自动构建
- 部署速度更快，适合生产环境

### 内部网络通信

- 前端通过内部网络 `http://app:80` 访问后端 API
- 后端通过内部网络访问数据库和 Redis
- 所有服务在同一个 Docker 网络 `typing-network` 中

### CI/CD 流程

1. **代码推送**: 推送代码到 GitHub
2. **自动构建**: GitHub Actions 自动构建 Docker 镜像
3. **镜像推送**: 镜像推送到 GitHub Container Registry
4. **生产部署**: 使用生产模式命令部署最新镜像

## 🛠️ 常用命令

### 开发模式命令

```bash
# 查看所有服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f app
docker-compose logs -f mysql
docker-compose logs -f redis

# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart app

# 停止所有服务
docker-compose down

# 停止服务并删除数据卷（谨慎使用）
docker-compose down -v

# 重新构建并启动
docker-compose up -d --build
```

### 生产模式命令

```bash
# 拉取最新镜像
docker-compose -f docker-compose.prod.yml pull

# 查看所有服务状态
docker-compose -f docker-compose.prod.yml ps

# 查看服务日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f mysql
docker-compose -f docker-compose.prod.yml logs -f redis

# 重启所有服务
docker-compose -f docker-compose.prod.yml restart

# 重启特定服务
docker-compose -f docker-compose.prod.yml restart app

# 停止所有服务
docker-compose -f docker-compose.prod.yml down

# 停止服务并删除数据卷（谨慎使用）
docker-compose -f docker-compose.prod.yml down -v

# 启动服务（使用预构建镜像）
docker-compose -f docker-compose.prod.yml up -d
```

### 数据库操作

#### 开发模式
```bash
# 连接到 MySQL 数据库
docker-compose exec mysql mysql -u typing_user -p typing_db

# 备份数据库
docker-compose exec mysql mysqldump -u typing_user -p typing_db > backup.sql

# 恢复数据库
docker-compose exec -T mysql mysql -u typing_user -p typing_db < backup.sql
```

#### 生产模式
```bash
# 连接到 MySQL 数据库
docker-compose -f docker-compose.prod.yml exec mysql mysql -u typing_user -p typing_db

# 备份数据库
docker-compose -f docker-compose.prod.yml exec mysql mysqldump -u typing_user -p typing_db > backup.sql

# 恢复数据库
docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u typing_user -p typing_db < backup.sql
```

### Redis 操作

#### 开发模式
```bash
# 连接到 Redis
docker-compose exec redis redis-cli

# 查看 Redis 信息
docker-compose exec redis redis-cli info
```

#### 生产模式
```bash
# 连接到 Redis
docker-compose -f docker-compose.prod.yml exec redis redis-cli

# 查看 Redis 信息
docker-compose -f docker-compose.prod.yml exec redis redis-cli info
```

## 🔧 配置说明

### 端口配置

- **3000**: 前端应用端口
- **80**: 后端 API 端口
- **3306**: MySQL 数据库端口
- **6379**: Redis 缓存端口

### 数据持久化

- MySQL 数据存储在 Docker 卷 `mysql_data` 中
- Redis 数据存储在 Docker 卷 `redis_data` 中
- 数据在容器重启后会保持

### 健康检查

所有服务都配置了健康检查：
- MySQL: 检查数据库连接
- Redis: 检查 Redis 连接
- App: 检查应用端口

## 🐛 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3000
   lsof -i :80
   lsof -i :3306
   lsof -i :6379
   ```

2. **内存不足**
   ```bash
   # 检查 Docker 资源使用
   docker stats
   ```

3. **数据库连接失败**
   ```bash
   # 检查数据库服务状态
   docker-compose logs mysql
   
   # 手动测试数据库连接
   docker-compose exec app nc -z mysql 3306
   ```

4. **前端无法访问后端**
   - 检查 `NEXT_PUBLIC_BASE_URL` 环境变量配置
   - 确认后端服务正常运行
   - 检查网络连接

5. **镜像拉取失败（生产模式）**
   - 检查 GitHub Container Registry 权限
   - 确保镜像地址正确
   - 验证 GitHub Actions 构建状态

6. **GitHub Actions 构建失败**
   - 检查 GitHub Secrets 配置
   - 验证 Dockerfile 语法
   - 查看 Actions 日志

### 重置环境

如果遇到严重问题，可以完全重置环境：

```bash
# 停止并删除所有容器、网络、卷
docker-compose down -v --remove-orphans

# 删除相关镜像
docker rmi typing-app

# 重新构建和启动
docker-compose up -d --build
```

## 🔒 安全建议

1. **修改默认密码**: 更改 `docker-compose.yml` 中的数据库密码
2. **JWT 密钥**: 使用强随机字符串作为 JWT_SECRET
3. **防火墙**: 在生产环境中配置适当的防火墙规则
4. **HTTPS**: 在生产环境中使用 HTTPS
5. **定期备份**: 定期备份数据库数据

## 📈 性能优化

1. **资源限制**: 根据需要调整容器资源限制
2. **缓存配置**: 优化 Redis 缓存策略
3. **数据库优化**: 根据数据量调整 MySQL 配置
4. **监控**: 添加监控和日志收集

## 🆘 获取帮助

如果遇到问题，请：

1. 查看服务日志：`docker-compose logs -f`
2. 检查服务状态：`docker-compose ps`
3. 查看本文档的故障排除部分
4. 提交 Issue 到项目仓库

---

**注意**: 这是一个开发/测试环境的配置。在生产环境中部署时，请确保：
- 使用强密码和安全配置
- 配置适当的备份策略
- 设置监控和日志收集
- 使用 HTTPS 和其他安全措施