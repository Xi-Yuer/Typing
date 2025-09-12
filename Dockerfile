# 多阶段构建 Dockerfile
# 阶段1: 构建阶段
FROM node:23-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@10.7.0

# 复制 package.json 和 pnpm 相关文件（优化缓存层）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/client/package.json ./apps/client/
COPY packages/common/package.json ./packages/common/
COPY packages/utils/package.json ./packages/utils/
COPY apps/admin/package.json ./apps/admin/

# 安装依赖（包括开发依赖，用于构建）
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install

# 复制源代码
COPY . .

# 设置构建时环境变量
ENV NEXT_PUBLIC_BASE_URL=/api
ENV VITE_API_URL=/api

# 构建项目
RUN pnpm run build

# 确保 admin 应用被正确构建
RUN ls -la /app/apps/admin/dist/ || echo "Admin dist directory not found"

# 阶段2: 生产阶段
FROM node:23-alpine AS production

# 安装必要的系统依赖
RUN apk add --no-cache dumb-init netcat-openbsd nginx su-exec

# 创建nginx必要的目录并设置权限
RUN mkdir -p /var/log/nginx /var/run /var/lib/nginx/logs && \
    chown -R nginx:nginx /var/log/nginx /var/run /var/lib/nginx && \
    chmod -R 755 /var/log/nginx /var/run /var/lib/nginx

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@10.7.0

# 复制 package.json 和 pnpm 相关文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/client/package.json ./apps/client/
COPY packages/common/package.json ./packages/common/
COPY packages/utils/package.json ./packages/utils/
COPY apps/admin/package.json ./apps/admin/
# 安装所有依赖
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install

# 从构建阶段复制构建产物
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/client/.next ./apps/client/.next
COPY --from=builder /app/apps/client/public ./apps/client/public
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/utils/dist ./packages/utils/dist
COPY --from=builder /app/apps/admin/dist ./apps/admin/dist

# 创建nginx html目录并复制admin静态文件
RUN mkdir -p /usr/share/nginx/html/admin
COPY --from=builder /app/apps/admin/dist/ /usr/share/nginx/html/admin/
COPY mobile.html /usr/share/nginx/html/

# 验证admin静态文件复制
RUN echo "Verifying admin static files:" && \
    ls -la /usr/share/nginx/html/admin/ && \
    if [ -f "/usr/share/nginx/html/admin/index.html" ]; then \
        echo "✓ Admin index.html copied successfully"; \
    else \
        echo "✗ Admin index.html not found"; \
        exit 1; \
    fi

# 复制必要的配置文件
COPY apps/api/nest-cli.json ./apps/api/
COPY apps/client/next.config.ts ./apps/client/
COPY apps/client/alova.config.ts ./apps/client/
COPY apps/admin/alova.config.ts ./apps/admin/
COPY nginx.conf /etc/nginx/nginx.conf

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
    echo '# 启动nginx' >> /app/start.sh && \
    echo 'echo "启动nginx..."' >> /app/start.sh && \
    echo 'chown -R nginx:nginx /usr/share/nginx/html /var/log/nginx /var/run /var/lib/nginx' >> /app/start.sh && \
    echo 'su-exec nginx nginx -g "daemon off;" &' >> /app/start.sh && \
    echo 'NGINX_PID=$!' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# 等待任一服务退出' >> /app/start.sh && \
    echo 'wait $API_PID $CLIENT_PID $NGINX_PID' >> /app/start.sh && \
    chmod +x /app/start.sh

# 更改文件所有权
RUN chown -R nextjs:nodejs /app
USER nextjs

# 暴露端口
EXPOSE 3001 3000 80 8080

# 设置环境变量
ENV NODE_ENV=production
ENV BACKEND_PORT=3001
ENV FRONTEND_PORT=3000
ENV NEXT_PUBLIC_BASE_URL=/api
ENV VITE_API_URL=/api
ENV FRONTEND_URL=http://localhost
ENV DB_HOST=mysql
ENV DB_PORT=3306
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# 启动应用
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]