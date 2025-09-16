#!/bin/bash

# 快速修复nginx权限问题的脚本

echo "=== 修复nginx权限问题 ==="

# 停止nginx容器
echo "停止nginx容器..."
docker stop typing-nginx 2>/dev/null || true
docker rm typing-nginx 2>/dev/null || true

# 清理admin volume
echo "清理admin volume..."
docker volume rm typing_admin_static 2>/dev/null || true

# 设置脚本权限
chmod +x nginx-init.sh

# 重新启动服务
echo "重新启动服务..."
docker-compose -f docker-compose.prod.yml up -d

# 等待服务启动
echo "等待服务启动..."
sleep 20

# 检查服务状态
echo "检查服务状态..."
docker-compose -f docker-compose.prod.yml ps

# 检查nginx日志
echo "检查nginx日志..."
docker logs typing-nginx --tail 20

echo "=== 修复完成 ==="
echo "现在可以测试访问："
echo "前端: http://localhost/"
echo "Admin: http://localhost:8080/"
echo "API: http://localhost/api/health"
