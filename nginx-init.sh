#!/bin/sh

# Nginx 初始化脚本 - 解决权限问题
set -e

echo "初始化nginx权限..."

# 确保nginx目录存在并有正确权限
mkdir -p /var/log/nginx
mkdir -p /var/lib/nginx/logs
mkdir -p /var/lib/nginx/modules
mkdir -p /var/lib/nginx/run
mkdir -p /var/lib/nginx/tmp
mkdir -p /var/lib/nginx/html

# 设置目录权限
chmod -R 755 /var/log/nginx
chmod -R 755 /var/lib/nginx
chmod -R 755 /usr/share/nginx/html

# 如果admin目录存在，设置正确权限
if [ -d "/usr/share/nginx/html/admin" ]; then
    echo "设置admin目录权限..."
    chmod -R 755 /usr/share/nginx/html/admin
    chmod -R 644 /usr/share/nginx/html/admin/assets/ 2>/dev/null || true
fi

# 设置mobile.html权限
if [ -f "/usr/share/nginx/html/mobile.html" ]; then
    chmod 644 /usr/share/nginx/html/mobile.html
fi

echo "权限设置完成，启动nginx..."

# 启动nginx
exec nginx -g "daemon off;"
