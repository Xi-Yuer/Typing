# 多阶段构建 Dockerfile
# 阶段1: 构建阶段
FROM node:23-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@10.7.0

# 设置pnpm store位置为全局位置，避免用户切换问题
RUN pnpm config set store-dir /app/.pnpm-store --global

# 复制 package.json 和 pnpm 相关文件（优化缓存层）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/client/package.json ./apps/client/
COPY apps/admin/package.json ./apps/admin/
COPY packages/common/package.json ./packages/common/
COPY packages/utils/package.json ./packages/utils/

# 安装依赖（包括开发依赖，用于构建）
RUN --mount=type=cache,target=/app/.pnpm-store \
    pnpm install

# 复制源代码
COPY . .

# 设置构建时环境变量
ENV NEXT_PUBLIC_BASE_URL=/
ENV VITE_API_URL=/
ENV NEXT_PUBLIC_GITHUB_SSO_URL=http://backend/api/auth/github/callback
ENV FRONTEND_URL=http://frontend
ENV DB_HOST=mysql
ENV DB_PORT=3306
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# 构建项目
RUN pnpm run build

# 阶段2: 生产阶段
FROM node:23-alpine AS production

# 安装必要的系统依赖
RUN apk add --no-cache dumb-init netcat-openbsd

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@10.7.0

# 设置pnpm store位置为全局位置，避免用户切换问题
RUN pnpm config set store-dir /app/.pnpm-store --global

# 复制必要的 package.json 和 lockfile（仅用于运行时）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/client/package.json ./apps/client/
COPY packages/common/package.json ./packages/common/
COPY packages/utils/package.json ./packages/utils/

# 安装生产依赖（仅运行时需要的依赖）
RUN --mount=type=cache,target=/app/.pnpm-store \
    pnpm install

# 从构建阶段复制构建产物
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/client/.next ./apps/client/.next
COPY --from=builder /app/apps/client/public ./apps/client/public
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/utils/dist ./packages/utils/dist

# 复制必要的配置文件
COPY apps/api/nest-cli.json ./apps/api/
COPY apps/client/next.config.ts ./apps/client/
COPY apps/client/alova.config.ts ./apps/client/

# 创建启动脚本
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# 等待数据库和 Redis 启动' >> /app/start.sh && \
    echo 'echo "等待数据库连接..."' >> /app/start.sh && \
    echo 'while ! nc -z ${DB_HOST:-localhost} ${DB_PORT:-3306}; do' >> /app/start.sh && \
    echo '  sleep 1' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo 'echo "数据库连接成功"' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'echo "等待 Redis 连接..."' >> /app/start.sh && \
    echo 'while ! nc -z ${REDIS_HOST:-localhost} ${REDIS_PORT:-6379}; do' >> /app/start.sh && \
    echo '  sleep 1' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo 'echo "Redis 连接成功"' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# 启动后端服务' >> /app/start.sh && \
    echo 'echo "启动后端服务..."' >> /app/start.sh && \
    echo 'cd /app/apps/api && pnpm start &' >> /app/start.sh && \
    echo 'API_PID=$!' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# 等待后端服务启动' >> /app/start.sh && \
    echo 'sleep 10' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# 启动前端服务' >> /app/start.sh && \
    echo 'echo "启动前端服务..."' >> /app/start.sh && \
    echo 'cd /app/apps/client && PORT=$FRONTEND_PORT pnpm start &' >> /app/start.sh && \
    echo 'CLIENT_PID=$!' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# 等待任一服务退出' >> /app/start.sh && \
    echo 'wait $API_PID $CLIENT_PID' >> /app/start.sh && \
    chmod +x /app/start.sh

# 更改文件所有权
RUN chown -R nextjs:nodejs /app

# 确保nextjs用户也能使用相同的pnpm store配置
USER nextjs
RUN pnpm config set store-dir /app/.pnpm-store --global

# 暴露端口
EXPOSE 3001 3000

# 设置环境变量
ENV NODE_ENV=production
ENV BACKEND_PORT=3001
ENV FRONTEND_PORT=3000
ENV NEXT_PUBLIC_BASE_URL=/
ENV VITE_API_URL=/
ENV NEXT_PUBLIC_GITHUB_SSO_URL=http://backend/api/auth/github/callback
ENV FRONTEND_URL=http://frontend
ENV DB_HOST=mysql
ENV DB_NAME=typing_db
ENV DB_USER=typing_user
ENV DB_PASSWORD=typing_password
ENV DB_PORT=3306
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# 启动应用
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]