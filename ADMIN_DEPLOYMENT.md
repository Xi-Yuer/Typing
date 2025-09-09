# 管理后台部署指南

## 环境变量配置

### 开发环境

创建 `apps/admin/.env.local` 文件：

```bash
# 开发环境使用代理
VITE_API_URL=/api
```

### 生产环境

#### 1. Docker 部署

在 `docker-compose.prod.yml` 中设置环境变量：

```yaml
environment:
  VITE_API_URL: /api  # 通过 Nginx 代理
  # 或者
  VITE_API_URL: http://your-api-domain.com/api  # 独立 API 服务
```

#### 2. 独立部署

如果管理后台和 API 服务分别部署：

```bash
# 构建时设置环境变量
VITE_API_URL=http://your-api-domain.com/api pnpm run build

# 或者创建 .env.production 文件
echo "VITE_API_URL=http://your-api-domain.com/api" > .env.production
```

## 部署场景

### 场景1: 一体化部署（推荐）

- 管理后台和 API 服务在同一台服务器
- 通过 Nginx 代理 `/api` 路径到后端服务
- 设置 `VITE_API_URL=/api`

### 场景2: 分离部署

- 管理后台和 API 服务在不同服务器
- 直接访问 API 服务的完整 URL
- 设置 `VITE_API_URL=http://api.yourdomain.com/api`

### 场景3: CDN 部署

- 管理后台部署到 CDN
- API 服务部署到独立服务器
- 设置 `VITE_API_URL=https://api.yourdomain.com/api`

## 构建命令

```bash
# 开发环境
pnpm run dev

# 生产构建
VITE_API_URL=/api pnpm run build

# 预览构建结果
pnpm run preview
```

## 注意事项

1. 环境变量必须以 `VITE_` 开头才能在客户端代码中使用
2. 构建时环境变量会被打包到代码中，无法在运行时修改
3. 如果需要运行时修改 API 地址，可以考虑使用配置文件或动态配置
