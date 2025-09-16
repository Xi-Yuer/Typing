#!/bin/sh

# Nginx 初始化脚本 - 解决权限问题
set -e

echo "=== Nginx 初始化脚本启动 ==="

# 确保nginx目录存在并有正确权限
echo "创建nginx目录..."
mkdir -p /var/log/nginx
mkdir -p /var/lib/nginx/logs
mkdir -p /var/lib/nginx/modules
mkdir -p /var/lib/nginx/run
mkdir -p /var/lib/nginx/tmp
mkdir -p /var/lib/nginx/html

# 设置目录权限（忽略错误）
echo "设置目录权限..."
chmod -R 755 /var/log/nginx 2>/dev/null || echo "警告: 无法设置 /var/log/nginx 权限"
chmod -R 755 /var/lib/nginx 2>/dev/null || echo "警告: 无法设置 /var/lib/nginx 权限"
chmod -R 755 /usr/share/nginx/html 2>/dev/null || echo "警告: 无法设置 /usr/share/nginx/html 权限"

# 如果admin目录存在，设置正确权限
if [ -d "/usr/share/nginx/html/admin" ]; then
    echo "设置admin目录权限..."
    chmod -R 755 /usr/share/nginx/html/admin 2>/dev/null || echo "警告: 无法设置admin目录权限"
    chmod -R 644 /usr/share/nginx/html/admin/assets/ 2>/dev/null || echo "警告: 无法设置admin assets权限"
    echo "Admin目录权限设置完成"
else
    echo "警告: admin目录不存在"
fi

# 设置mobile.html权限
if [ -f "/usr/share/nginx/html/mobile.html" ]; then
    chmod 644 /usr/share/nginx/html/mobile.html 2>/dev/null || echo "警告: 无法设置mobile.html权限"
    echo "mobile.html权限设置完成"
else
    echo "警告: mobile.html文件不存在"
fi

# 测试nginx配置
echo "测试nginx配置..."
nginx -t

echo "=== 权限设置完成，启动nginx ==="

# 启动nginx
exec nginx -g "daemon off;"
