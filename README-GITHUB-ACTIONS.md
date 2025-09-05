# GitHub Actions 自动构建配置指南

本指南将帮助你配置 GitHub Actions 自动构建 Docker 镜像，实现一键部署。

## 🔧 配置步骤

### 1. 启用 GitHub Container Registry

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Actions** → **General**
3. 在 **Workflow permissions** 部分，选择 **Read and write permissions**
4. 勾选 **Allow GitHub Actions to create and approve pull requests**
5. 点击 **Save**

### 2. 配置仓库权限

确保 GitHub Actions 有权限推送到 GitHub Container Registry：

1. 进入仓库 **Settings** → **Actions** → **General**
2. 在 **Workflow permissions** 中选择 **Read and write permissions**
3. 保存设置

### 3. 更新镜像地址

编辑 `docker-compose.prod.yml` 文件，将镜像地址更新为你的实际地址：

```yaml
services:
  app:
    image: ghcr.io/your-username/typing:latest # 替换 your-username 为你的 GitHub 用户名
    # ... 其他配置
```

### 4. 推送代码触发构建

当你推送代码到以下分支或创建标签时，会自动触发构建：

- 推送到 `main` 分支
- 推送到 `develop` 分支
- 创建任何标签（如 `v1.0.0`）

```bash
# 推送到 main 分支触发构建
git add .
git commit -m "feat: 添加新功能"
git push origin main

# 或者创建标签触发构建
git tag v1.0.0
git push origin v1.0.0
```

## 📦 镜像标签策略

GitHub Actions 会根据不同的触发条件生成不同的镜像标签：

- **main 分支**: `ghcr.io/your-username/typing:latest`
- **develop 分支**: `ghcr.io/your-username/typing:develop`
- **标签**: `ghcr.io/your-username/typing:v1.0.0`
- **PR**: `ghcr.io/your-username/typing:pr-123`

## 🚀 使用预构建镜像部署

### 方法一：使用部署脚本（推荐）

```bash
# 拉取最新镜像
./deploy.sh pull --prod

# 启动应用
./deploy.sh start --prod

# 查看状态
./deploy.sh status --prod
```

### 方法二：直接使用 Docker Compose

```bash
# 拉取最新镜像
docker-compose -f docker-compose.prod.yml pull

# 启动应用
docker-compose -f docker-compose.prod.yml up -d

# 查看状态
docker-compose -f docker-compose.prod.yml ps
```

## 🔍 监控构建状态

### 在 GitHub 网页查看

1. 进入你的 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看最新的工作流运行状态

### 使用 GitHub CLI

```bash
# 安装 GitHub CLI
brew install gh  # macOS
# 或
sudo apt install gh  # Ubuntu

# 登录
gh auth login

# 查看最新构建状态
gh run list

# 查看特定构建的详细信息
gh run view <run-id>

# 查看构建日志
gh run view <run-id> --log
```

## 🛠️ 故障排除

### 构建失败常见原因

1. **权限不足**
   - 检查仓库的 Actions 权限设置
   - 确保启用了 "Read and write permissions"

2. **Dockerfile 语法错误**
   - 检查 Dockerfile 语法
   - 本地测试构建：`docker build -t test .`

3. **依赖安装失败**
   - 检查 package.json 中的依赖
   - 确保 pnpm-lock.yaml 文件存在

4. **镜像推送失败**
   - 检查网络连接
   - 验证 GitHub Container Registry 权限

### 调试构建问题

```bash
# 本地测试构建
docker build -t typing-test .

# 测试多平台构建
docker buildx build --platform linux/amd64,linux/arm64 -t typing-test .

# 查看构建日志
gh run view --log
```

## 🔐 安全最佳实践

1. **不要在代码中硬编码敏感信息**
   - 使用环境变量
   - 使用 GitHub Secrets（如需要）

2. **定期更新依赖**
   - 定期运行 `npm audit`
   - 更新基础镜像版本

3. **镜像安全扫描**
   - GitHub 会自动扫描推送的镜像
   - 查看安全建议并及时修复

## 📚 相关文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Container Registry 文档](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Buildx 文档](https://docs.docker.com/buildx/)
- [项目部署文档](./DEPLOYMENT.md)

## 💡 提示

- 首次设置后，建议创建一个测试标签来验证构建流程
- 生产环境建议使用具体的版本标签而不是 `latest`
- 可以在 GitHub Actions 中添加测试步骤来确保代码质量
