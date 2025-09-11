#!/bin/bash

# Admin 后台管理系统部署验证脚本
# 用于验证 admin 应用是否正确通过 Docker 镜像部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查服务状态
check_services() {
    print_message $BLUE "检查服务状态..."
    
    # 检查容器是否运行
    if docker ps | grep -q "typing-app"; then
        print_message $GREEN "✓ typing-app 容器正在运行"
    else
        print_message $RED "✗ typing-app 容器未运行"
        return 1
    fi
    
    if docker ps | grep -q "typing-nginx"; then
        print_message $GREEN "✓ typing-nginx 容器正在运行"
    else
        print_message $RED "✗ typing-nginx 容器未运行"
        return 1
    fi
}

# 检查 admin 应用访问
check_admin_access() {
    print_message $BLUE "检查 admin 应用访问..."
    
    # 等待服务完全启动
    sleep 5
    
    # 检查 admin 路由
    local admin_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/admin || echo "000")
    
    if [ "$admin_response" = "200" ]; then
        print_message $GREEN "✓ admin 应用可以正常访问 (HTTP 200)"
    elif [ "$admin_response" = "404" ]; then
        print_message $YELLOW "⚠ admin 应用返回 404，可能需要检查路由配置"
    else
        print_message $RED "✗ admin 应用访问失败 (HTTP $admin_response)"
        return 1
    fi
}

# 检查 admin 静态资源
check_admin_assets() {
    print_message $BLUE "检查 admin 静态资源..."
    
    # 检查 admin 容器内的静态文件
    if docker exec typing-app ls -la /usr/share/nginx/html/admin/ > /dev/null 2>&1; then
        print_message $GREEN "✓ admin 静态文件存在于容器中"
        
        # 显示文件列表
        print_message $BLUE "Admin 静态文件列表:"
        docker exec typing-app ls -la /usr/share/nginx/html/admin/
    else
        print_message $RED "✗ admin 静态文件不存在于容器中"
        return 1
    fi
}

# 检查 nginx 配置
check_nginx_config() {
    print_message $BLUE "检查 nginx 配置..."
    
    # 检查 nginx 配置语法
    if docker exec typing-app nginx -t > /dev/null 2>&1; then
        print_message $GREEN "✓ nginx 配置语法正确"
    else
        print_message $RED "✗ nginx 配置语法错误"
        docker exec typing-app nginx -t
        return 1
    fi
}

# 显示访问信息
show_access_info() {
    print_message $GREEN "\n🎉 Admin 后台管理系统部署验证完成！"
    print_message $BLUE "访问地址:"
    print_message $BLUE "  - Admin 后台: http://localhost/admin"
    print_message $BLUE "  - 前端应用: http://localhost/"
    print_message $BLUE "  - API 接口: http://localhost/api"
    print_message $BLUE "  - API 文档: http://localhost/api/doc"
}

# 主函数
main() {
    print_message $BLUE "开始验证 Admin 后台管理系统部署..."
    
    # 检查服务状态
    if ! check_services; then
        print_message $RED "服务状态检查失败，请先启动服务"
        exit 1
    fi
    
    # 检查 nginx 配置
    if ! check_nginx_config; then
        print_message $RED "nginx 配置检查失败"
        exit 1
    fi
    
    # 检查 admin 静态资源
    if ! check_admin_assets; then
        print_message $RED "admin 静态资源检查失败"
        exit 1
    fi
    
    # 检查 admin 应用访问
    if ! check_admin_access; then
        print_message $RED "admin 应用访问检查失败"
        exit 1
    fi
    
    # 显示访问信息
    show_access_info
}

# 运行主函数
main "$@"
