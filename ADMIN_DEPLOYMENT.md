# Admin 后台管理系统 Docker 部署说明

## 概述

Admin 后台管理系统已成功修改为使用 Docker 镜像进行部署，不再依赖外部静态文件挂载。所有 admin 相关的静态资源现在都包含在主应用 Docker 镜像中。

## 主要修改内容

### 1. Dockerfile 修改

- **文件**: `Dockerfile`
- **修改内容**:
  - 确保 admin 应用在构建阶段被正确构建
  - 将 admin 构建产物复制到 nginx html 目录
  - 使用新的 nginx 配置文件 `nginx-app.conf`

### 2. Docker Compose 配置修改

- **文件**: `docker-compose.prod.yml`
- **修改内容**:
  - 移除了 admin 静态文件的挂载配置
  - 添加了说明注释，表明 admin 资源现在包含在镜像中

### 3. Nginx 配置修改

- **文件**: `nginx.conf` (外部 nginx 容器)
- **修改内容**:
  - 将 `/admin` 路由代理到 app 容器的 80 端口
  - 移除了直接服务静态文件的配置

- **新文件**: `nginx-app.conf` (app 容器内部)
- **功能**:
  - 处理 app 容器内部的 nginx 配置
  - 直接服务 admin 静态文件
  - 代理 API 和前端请求

### 4. 部署验证脚本

- **新文件**: `verify-admin-deployment.sh`
- **功能**:
  - 验证服务状态
  - 检查 admin 应用访问
  - 验证静态资源存在
  - 检查 nginx 配置

## 部署架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   App Container │    │   Database      │
│   (Port 80)     │    │   (Port 80)     │    │   (MySQL)       │
│                 │    │                 │    │                 │
│ /admin → app:80 │    │ /admin → static │    │                 │
│ /api → app:3001 │    │ /api → backend  │    │                 │
│ / → app:3000    │    │ / → frontend    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 部署步骤

1. **构建镜像**:
   ```bash
   docker build -t your-registry/typing:latest .
   ```

2. **启动服务**:
   ```bash
   ./deploy.sh start
   ```

3. **验证部署**:
   ```bash
   ./verify-admin-deployment.sh
   ```

## 访问地址

- **Admin 后台**: http://localhost/admin
- **前端应用**: http://localhost/
- **API 接口**: http://localhost/api
- **API 文档**: http://localhost/api/doc

## 优势

1. **简化部署**: 不再需要单独管理 admin 静态文件
2. **版本一致性**: admin 资源与主应用版本保持一致
3. **容器化**: 完全容器化部署，便于管理和扩展
4. **自动化**: 构建过程自动包含 admin 资源

## 注意事项

1. **构建顺序**: 确保 admin 应用在构建阶段被正确构建
2. **路由配置**: nginx 配置需要正确处理 SPA 路由
3. **静态资源**: admin 的静态资源缓存策略已优化
4. **健康检查**: 建议添加 admin 应用的健康检查端点

## 故障排除

如果 admin 应用无法访问，请检查：

1. **容器状态**: `docker ps` 确认所有容器正在运行
2. **日志信息**: `docker logs typing-app` 查看应用日志
3. **静态文件**: `docker exec typing-app ls -la /usr/share/nginx/html/admin/`
4. **nginx 配置**: `docker exec typing-app nginx -t`

## 回滚方案

如果需要回滚到之前的部署方式：

1. 恢复 `docker-compose.prod.yml` 中的 admin 静态文件挂载
2. 恢复 `nginx.conf` 中的直接静态文件服务配置
3. 重新部署服务