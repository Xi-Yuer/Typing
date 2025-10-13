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

# SSL证书文件检测和配置
echo "检查SSL证书文件..."

# 定义证书文件优先级（根据实际文件名调整）
CERT_FILES=(
    "/etc/nginx/ssl/keycikeyci_com_integrated.crt"
    "/etc/nginx/ssl/keycikeyci_com_integrated.pem"
    "/etc/nginx/ssl/keycikeyci.com-chain.crt"
    "/etc/nginx/ssl/keycikeyci.com-fullchain.pem"
    "/etc/nginx/ssl/keycikeyci.com.crt"
    "/etc/nginx/ssl/keycikeyci.com.pem"
)

KEY_FILES=(
    "/etc/nginx/ssl/keycikeyci_com.key"
    "/etc/nginx/ssl/keycikeyci.com.key"
    "/etc/nginx/ssl/keycikeyci.com-private.key"
)

# 查找可用的证书文件
CERT_FILE=""
for cert in "${CERT_FILES[@]}"; do
    if [ -f "$cert" ]; then
        CERT_FILE="$cert"
        echo "找到证书文件: $cert"
        break
    fi
done

# 查找可用的私钥文件
KEY_FILE=""
for key in "${KEY_FILES[@]}"; do
    if [ -f "$key" ]; then
        KEY_FILE="$key"
        echo "找到私钥文件: $key"
        break
    fi
done

# 检查是否找到了必要的文件
if [ -z "$CERT_FILE" ] || [ -z "$KEY_FILE" ]; then
    echo "错误: SSL证书文件不存在！"
    echo ""
    echo "请确保在 ssl/ 目录下放置以下文件之一："
    echo "证书文件（按优先级）："
    echo "  - keycikeyci_com_integrated.crt (当前使用 - 集成证书)"
    echo "  - keycikeyci_com_integrated.pem (PEM格式集成证书)"
    echo "  - keycikeyci.com-chain.crt (完整证书链)"
    echo "  - keycikeyci.com-fullchain.pem (Let's Encrypt标准格式)"
    echo "  - keycikeyci.com.crt (域名证书)"
    echo "  - keycikeyci.com.pem (PEM格式证书)"
    echo ""
    echo "私钥文件："
    echo "  - keycikeyci_com.key (当前使用)"
    echo "  - keycikeyci.com.key (标准格式)"
    echo "  - keycikeyci.com-private.key (备用格式)"
    echo ""
    echo "获取证书的方法："
    echo "1. 使用 Let's Encrypt: certbot certonly --standalone -d keycikeyci.com"
    echo "2. 从证书颁发机构获取证书文件"
    echo "3. 将证书文件复制到项目根目录的 ssl/ 文件夹中"
    echo ""
    echo "nginx启动失败，请先配置SSL证书文件"
    exit 1
fi

echo "SSL证书配置成功："
echo "  证书文件: $CERT_FILE"
echo "  私钥文件: $KEY_FILE"

# 检查当前用户权限
echo "当前用户: $(whoami)"
echo "当前用户ID: $(id -u)"

# 尝试设置正确的权限，如果失败则使用备用方案
if chmod 600 "$KEY_FILE" 2>/dev/null; then
    echo "私钥权限设置成功"
else
    echo "私钥权限设置跳过（只读挂载，权限由宿主机控制）"
fi

if chmod 644 "$CERT_FILE" 2>/dev/null; then
    echo "证书权限设置成功"
else
    echo "证书权限设置跳过（只读挂载，权限由宿主机控制）"
fi

# 验证文件权限
echo "SSL证书文件权限:"
ls -la "$CERT_FILE" "$KEY_FILE"
echo "SSL证书配置完成"

# 动态更新nginx配置中的证书路径
echo "更新nginx配置中的证书路径..."
sed -i "s|ssl_certificate /etc/nginx/ssl/keycikeyci.com-chain.crt;|ssl_certificate $CERT_FILE;|g" /etc/nginx/nginx.conf
sed -i "s|ssl_certificate_key /etc/nginx/ssl/keycikeyci.com.key;|ssl_certificate_key $KEY_FILE;|g" /etc/nginx/nginx.conf
echo "nginx配置已更新"

# 测试nginx配置
echo "测试nginx配置..."
nginx -t

# 等待上游服务启动
echo "等待上游服务启动..."
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    local max_attempts=30
    local attempt=1
    
    echo "检查 $service_name ($host:$port) 是否可用..."
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z $host $port 2>/dev/null; then
            echo "$service_name 已就绪"
            return 0
        fi
        
        echo "等待 $service_name 启动... ($attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "警告: $service_name 在 $max_attempts 次尝试后仍未就绪，继续启动nginx"
    return 1
}

# 检查上游服务
wait_for_service "app" "3000" "前端服务" || true
wait_for_service "app" "3001" "后端服务" || true

echo "=== 权限设置完成，启动nginx ==="

# 启动nginx
exec nginx -g "daemon off;"
