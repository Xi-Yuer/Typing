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

# 检查SSL证书文件
echo "检查SSL证书文件..."
if [ ! -f "/etc/nginx/ssl/keycikeyci.com.crt" ] || [ ! -f "/etc/nginx/ssl/keycikeyci.com.key" ]; then
    echo "警告: SSL证书文件不存在，将创建自签名证书用于开发环境"
    echo "生产环境请确保将正确的SSL证书文件放置在 ssl/ 目录下"
    
    # 创建自签名证书（仅用于开发环境）
    if [ ! -f "/etc/nginx/ssl/keycikeyci.com.crt" ]; then
        echo "创建自签名证书..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/nginx/ssl/keycikeyci.com.key \
            -out /etc/nginx/ssl/keycikeyci.com.crt \
            -subj "/C=CN/ST=State/L=City/O=Organization/CN=keycikeyci.com"
        chmod 600 /etc/nginx/ssl/keycikeyci.com.key
        chmod 644 /etc/nginx/ssl/keycikeyci.com.crt
        echo "自签名证书创建完成"
    fi
else
    echo "SSL证书文件存在，使用生产证书"
    # 设置正确的权限
    chmod 600 /etc/nginx/ssl/keycikeyci.com.key 2>/dev/null || echo "警告: 无法设置私钥权限"
    chmod 644 /etc/nginx/ssl/keycikeyci.com.crt 2>/dev/null || echo "警告: 无法设置证书权限"
fi

# 测试nginx配置
echo "测试nginx配置..."
nginx -t

echo "=== 权限设置完成，启动nginx ==="

# 启动nginx
exec nginx -g "daemon off;"
