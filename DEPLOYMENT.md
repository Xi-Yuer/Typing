# 打字练习应用 Docker 部署指南

本指南将帮助您使用 Docker 部署前后端项目，使用外部 MySQL 数据库和 Redis 缓存。

## 📋 前置要求

- Docker (版本 20.10+)
- Docker Compose (版本 2.0+)
- 外部 MySQL 服务器 (版本 8.0+)
- 外部 Redis 服务器 (版本 6.0+)
- 至少 2GB 可用内存
- 至少 5GB 可用磁盘空间

## 🚀 快速开始

### 开发环境部署（本地构建）

#### 1. 克隆项目

```bash
git clone <your-repository-url>
cd Typing
```

#### 2. 配置外部服务

**2.1 准备外部 MySQL 和 Redis 服务**

确保您有可访问的 MySQL 和 Redis 服务器：

- MySQL 服务器：版本 8.0+，端口 3306
- Redis 服务器：版本 6.0+，端口 6379

**2.2 配置环境变量**

复制环境变量模板文件：

```bash
cp env.example .env
```

编辑 `.env` 文件，配置外部服务地址：

```bash
# ===================
# 数据库配置 (外部 MySQL)
# ===================
DB_HOST=192.168.1.100          # MySQL 服务器 IP 地址
DB_PORT=3306                   # MySQL 端口
DB_NAME=typing_db             # 数据库名称
DB_USER=typing_user            # 数据库用户名
DB_PASSWORD=your_mysql_password_here  # 数据库密码

# ===================
# Redis 配置 (外部 Redis)
# ===================
REDIS_HOST=192.168.1.101       # Redis 服务器 IP 地址
REDIS_PORT=6379                # Redis 端口
REDIS_PASSWORD=                # Redis 密码（如果设置了）

# ===================
# JWT 配置
# ===================
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# ===================
# 其他可选配置
# ===================
# GitHub OAuth (可选)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# QQ OAuth (可选)
QQ_CLIENT_ID=your_qq_client_id
QQ_CLIENT_SECRET=your_qq_client_secret

# 语音服务 (可选)
YOUDAO_APP_KEY=your_youdao_app_key
YOUDAO_APP_SECRET=your_youdao_app_secret
```

**2.3 初始化数据库**

在外部 MySQL 服务器上创建数据库和用户：

```sql
-- 创建数据库
CREATE DATABASE typing_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'typing_user'@'%' IDENTIFIED BY 'your_mysql_password_here';

-- 授权
GRANT ALL PRIVILEGES ON typing_db.* TO 'typing_user'@'%';
FLUSH PRIVILEGES;
```

然后导入初始化数据：

```bash
mysql -h 192.168.1.100 -u typing_user -p typing_db < init.sql
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

编辑 `docker-compose.yml` 文件，将镜像地址更新为你的实际地址：

```yaml
services:
  app:
    image: ghcr.io/your-username/typing:latest # 替换为你的用户名
```

#### 3. 拉取最新镜像并部署

```bash
# 拉取最新镜像
docker-compose -f docker-compose.yml pull

# 启动应用（生产模式）
docker-compose -f docker-compose.yml up -d
```

### 4. 验证部署

等待所有服务启动完成（大约 2-3 分钟），然后访问：

- **前端应用**: http://localhost
- **后端 API**: http://localhost/api
- **API 文档**: http://localhost/api/doc (如果启用了 Swagger)

## 📊 服务说明

### 服务架构

```
┌─────────────────┐    ┌─────────────────┐
│   Nginx 代理    │    │   前端 (Next.js) │
│   端口: 80      │◄──►│   端口: 3000    │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       │
┌─────────────────┐              │
│   后端 (NestJS)  │◄─────────────┘
│   端口: 3001    │
└─────────────────┘
         │
         ▼
┌─────────────────┐    ┌─────────────────┐
│ 外部 MySQL 数据库│◄──►│  外部 Redis 缓存 │
│   端口: 3306    │    │   端口: 6379    │
└─────────────────┘    └─────────────────┘
```

**注意**: MySQL 和 Redis 现在使用外部服务，不再运行在 Docker 容器中。

### 部署模式

#### 开发模式 (docker-compose.yml)

- 使用本地 Dockerfile 构建镜像
- 适合开发和测试
- 支持代码修改后重新构建

#### 生产模式 (docker-compose.yml)

- 使用预构建的 Docker 镜像
- 镜像通过 GitHub Actions 自动构建
- 部署速度更快，适合生产环境

### 内部网络通信

- 用户通过 `http://localhost` 访问前端应用（通过Nginx代理）
- 前端通过 `/api` 路径访问后端 API（通过Nginx代理到后端服务）
- 后端通过外部网络访问 MySQL 和 Redis 服务
- 应用容器在 Docker 网络 `typing-network` 中运行
- **重要**: 确保应用容器能够访问外部 MySQL 和 Redis 服务

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
docker-compose -f docker-compose.yml pull

# 查看所有服务状态
docker-compose -f docker-compose.yml ps

# 查看服务日志
docker-compose -f docker-compose.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.yml logs -f app
docker-compose -f docker-compose.yml logs -f mysql
docker-compose -f docker-compose.yml logs -f redis

# 重启所有服务
docker-compose -f docker-compose.yml restart

# 重启特定服务
docker-compose -f docker-compose.yml restart app

# 停止所有服务
docker-compose -f docker-compose.yml down

# 停止服务并删除数据卷（谨慎使用）
docker-compose -f docker-compose.yml down -v

# 启动服务（使用预构建镜像）
docker-compose -f docker-compose.yml up -d
```

### 数据库操作

#### 外部 MySQL 操作

```bash
# 连接到外部 MySQL 数据库
mysql -h 192.168.1.100 -u typing_user -p typing_db

# 备份数据库
mysqldump -h 192.168.1.100 -u typing_user -p typing_db > backup.sql

# 恢复数据库
mysql -h 192.168.1.100 -u typing_user -p typing_db < backup.sql

# 查看数据库状态
mysql -h 192.168.1.100 -u typing_user -p -e "SHOW PROCESSLIST;"
```

#### 外部 Redis 操作

```bash
# 连接到外部 Redis
redis-cli -h 192.168.1.101 -p 6379

# 查看 Redis 信息
redis-cli -h 192.168.1.101 -p 6379 info

# 清空 Redis 缓存
redis-cli -h 192.168.1.101 -p 6379 FLUSHALL
```

## 🔧 配置说明

### 端口配置

- **80**: Nginx 反向代理端口（对外访问入口）
  - 前端应用：`http://localhost/`
  - 后端 API：`http://localhost/api/`
- **FRONTEND_PORT (3000)**: 前端应用内部端口
- **BACKEND_PORT (3001)**: 后端 API 内部端口
- **3306**: 外部 MySQL 数据库端口
- **6379**: 外部 Redis 缓存端口

### 外部服务配置

- **MySQL**: 使用外部 MySQL 服务器，通过 `DB_HOST` 和 `DB_PORT` 配置
- **Redis**: 使用外部 Redis 服务器，通过 `REDIS_HOST` 和 `REDIS_PORT` 配置
- **网络要求**: 确保应用容器能够访问外部服务
- **防火墙**: 确保外部服务的端口在防火墙中开放

### 健康检查

应用服务配置了健康检查：

- **App**: 检查应用端口是否正常
- **外部服务**: 应用启动时会检查外部 MySQL 和 Redis 连接

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

3. **外部服务连接失败**

   ```bash
   # 检查外部 MySQL 连接
   nc -z 192.168.1.100 3306

   # 检查外部 Redis 连接
   nc -z 192.168.1.101 6379

   # 检查环境变量配置
   cat .env | grep -E "(DB_HOST|REDIS_HOST)"
   ```

4. **数据库连接失败**

   ```bash
   # 检查 MySQL 服务状态
   mysql -h 192.168.1.100 -u typing_user -p -e "SELECT 1;"

   # 检查用户权限
   mysql -h 192.168.1.100 -u root -p -e "SHOW GRANTS FOR 'typing_user'@'%';"
   ```

5. **Redis 连接失败**

   ```bash
   # 检查 Redis 服务状态
   redis-cli -h 192.168.1.101 -p 6379 ping

   # 检查 Redis 配置
   redis-cli -h 192.168.1.101 -p 6379 info server
   ```

6. **前端无法访问后端**
   - 检查 `NEXT_PUBLIC_BASE_URL` 环境变量配置
   - 确认后端服务正常运行
   - 检查网络连接

7. **镜像拉取失败（生产模式）**
   - 检查 GitHub Container Registry 权限
   - 确保镜像地址正确
   - 验证 GitHub Actions 构建状态

8. **GitHub Actions 构建失败**
   - 检查 GitHub Secrets 配置
   - 验证 Dockerfile 语法
   - 查看 Actions 日志

### 重置环境

如果遇到严重问题，可以完全重置环境：

```bash
# 停止并删除所有容器、网络
docker-compose -f docker-compose.prod.yml down --remove-orphans

# 删除相关镜像
docker rmi ghcr.io/xi-yuer/typing:latest

# 重新拉取镜像并启动
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

**注意**: 外部 MySQL 和 Redis 数据不会受到影响。

## 🔒 安全建议

1. **修改默认密码**: 更改 `.env` 文件中的数据库密码
2. **JWT 密钥**: 使用强随机字符串作为 JWT_SECRET
3. **防火墙**: 在生产环境中配置适当的防火墙规则
4. **HTTPS**: 在生产环境中使用 HTTPS
5. **定期备份**: 定期备份外部 MySQL 数据库
6. **网络安全**: 确保外部服务只允许必要的 IP 访问
7. **密码安全**: 使用强密码并定期更换

## 📈 性能优化

1. **资源限制**: 根据需要调整容器资源限制
2. **缓存配置**: 优化外部 Redis 缓存策略
3. **数据库优化**: 根据数据量调整外部 MySQL 配置
4. **监控**: 添加监控和日志收集
5. **网络优化**: 确保应用容器与外部服务之间的网络延迟最小
6. **连接池**: 配置合适的数据库连接池大小

## 🆘 获取帮助

如果遇到问题，请：

1. 查看服务日志：`docker-compose -f docker-compose.prod.yml logs -f`
2. 检查服务状态：`docker-compose -f docker-compose.prod.yml ps`
3. 检查外部服务连接：`./deploy.sh status`
4. 查看本文档的故障排除部分
5. 提交 Issue 到项目仓库

---

**注意**: 这是一个生产环境的配置。在部署时，请确保：

- 外部 MySQL 和 Redis 服务正常运行
- 使用强密码和安全配置
- 配置适当的备份策略
- 设置监控和日志收集
- 使用 HTTPS 和其他安全措施
- 确保网络连接稳定
