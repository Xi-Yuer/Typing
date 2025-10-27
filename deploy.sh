#!/bin/bash

# 打字练习应用一键部署脚本
# 使用方法: ./deploy.sh [start|stop|restart|logs|status|clean]

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

# 检查 Docker 和 Docker Compose 是否安装
check_dependencies() {
    print_message $BLUE "检查依赖..."
    
    if ! command -v docker &> /dev/null; then
        print_message $RED "错误: Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_message $RED "错误: Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    print_message $GREEN "✓ 依赖检查通过"
}

# 检查外部服务连接
check_external_services() {
    print_message $BLUE "检查外部服务连接..."
    
    # 检查 .env 文件是否存在
    if [ ! -f ".env" ]; then
        print_message $YELLOW "警告: .env 文件不存在，请复制 env.example 到 .env 并配置外部服务"
        print_message $BLUE "执行: cp env.example .env"
        print_message $BLUE "然后编辑 .env 文件，设置 DB_HOST 和 REDIS_HOST"
        return 1
    fi
    
    # 读取环境变量
    source .env
    
    # 检查 MySQL 连接
    if [ -n "$DB_HOST" ]; then
        print_message $BLUE "检查 MySQL 连接 ($DB_HOST:$DB_PORT)..."
        if nc -z "$DB_HOST" "${DB_PORT:-3306}" 2>/dev/null; then
            print_message $GREEN "✓ MySQL 连接正常"
        else
            print_message $RED "✗ MySQL 连接失败，请检查 $DB_HOST:$DB_PORT 是否可访问"
            return 1
        fi
    else
        print_message $RED "错误: DB_HOST 未设置"
        return 1
    fi
    
    # 检查 Redis 连接
    if [ -n "$REDIS_HOST" ]; then
        print_message $BLUE "检查 Redis 连接 ($REDIS_HOST:$REDIS_PORT)..."
        if nc -z "$REDIS_HOST" "${REDIS_PORT:-6379}" 2>/dev/null; then
            print_message $GREEN "✓ Redis 连接正常"
        else
            print_message $RED "✗ Redis 连接失败，请检查 $REDIS_HOST:$REDIS_PORT 是否可访问"
            return 1
        fi
    else
        print_message $RED "错误: REDIS_HOST 未设置"
        return 1
    fi
    
    print_message $GREEN "✓ 外部服务检查通过"
}

# 拉取最新代码
pull_code() {
    print_message $BLUE "拉取最新代码..."
    git pull origin main
}

# 启动服务
start_services() {
    local compose_file="docker-compose.prod.yml"
    
    print_message $BLUE "启动打字练习应用..."
    
    # 检查依赖
    check_dependencies
    check_external_services
    check_prod_config
    pull_code
    # 设置nginx初始化脚本权限
    if [ -f "nginx-init.sh" ]; then
        chmod +x nginx-init.sh
        print_message $GREEN "✓ nginx初始化脚本权限已设置"
    fi
    
    # 停止服务
    stop_services
    pull_code
    # 启动服务
    print_message $BLUE "启动所有服务..."
    docker-compose -f $compose_file up -d
    
    # 等待服务启动
    print_message $BLUE "等待服务启动..."
    sleep 15
    
    # 检查服务状态
    print_message $BLUE "检查服务状态..."
    docker-compose -f $compose_file ps
    
    # 等待nginx完全启动
    print_message $BLUE "等待nginx完全启动..."
    sleep 10
    
    print_message $GREEN "\n🎉 部署完成！"
    print_message $GREEN "前端应用: https://typing.xiyuer.club/"
    print_message $GREEN "Admin 后台: https://admin.typing.xiyuer.club:8443"
    print_message $GREEN "后端 API: https://typing.xiyuer.club/api"
    print_message $GREEN "API 文档: https://typing.xiyuer.club/api/doc"
    print_message $YELLOW "\n提示: 使用 './deploy.sh logs' 查看日志"
}

# 检查生产环境配置
check_prod_config() {
    local compose_file="docker-compose.prod.yml"
    
    if [ ! -f "$compose_file" ]; then
        print_message $RED "错误: 生产环境配置文件 $compose_file 不存在"
        exit 1
    fi
    
    # 检查镜像配置
    local image_line=$(grep "image: ghcr.io" $compose_file | head -1)
    if echo "$image_line" | grep -q "your-username/typing"; then
        print_message $YELLOW "警告: 请在 $compose_file 中更新镜像地址"
        print_message $YELLOW "将 'your-username/typing' 替换为实际的 GitHub 用户名和仓库名"
        print_message $BLUE "例如: ghcr.io/yourusername/typing:latest"
    fi
}

# 拉取最新代码
pull_code() {
    print_message $BLUE "拉取最新代码..."
    git pull origin main
}


# 拉取最新镜像
pull_image() {
    print_message $BLUE "拉取最新的预构建镜像..."
    check_prod_config
    docker-compose -f docker-compose.prod.yml pull
    print_message $GREEN "✓ 镜像拉取完成"
    print_message $BLUE "拉取最新代码..."
    pull_code
    print_message $GREEN "✓ 代码拉取完成"
}

# 停止服务
stop_services() {
    local compose_file="docker-compose.prod.yml"
    
    print_message $BLUE "停止所有服务..."
    docker-compose -f $compose_file down
    print_message $GREEN "✓ 服务已停止"
}

# 重启服务
restart_services() {
    local compose_file="docker-compose.prod.yml"
    
    print_message $BLUE "重启所有服务..."
    docker-compose -f $compose_file restart
    print_message $GREEN "✓ 服务已重启"
}

# 查看日志
show_logs() {
    local compose_file="docker-compose.prod.yml"
    
    print_message $BLUE "显示服务日志 (按 Ctrl+C 退出)..."
    print_message $YELLOW "注意: MySQL 和 Redis 现在使用外部服务，不会显示容器日志"
    docker-compose -f $compose_file logs -f
}

# 查看状态
show_status() {
    local compose_file="docker-compose.prod.yml"
    
    print_message $BLUE "服务状态:"
    docker-compose -f $compose_file ps
    
    print_message $BLUE "\n资源使用情况:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

# 清理环境
clean_environment() {
    local compose_file="docker-compose.prod.yml"
    
    print_message $YELLOW "警告: 这将删除所有容器和网络，但保留数据卷！"
    read -p "确定要继续吗？(y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message $BLUE "清理环境..."
        docker-compose -f $compose_file down --remove-orphans
        print_message $GREEN "✓ 环境已清理（数据卷已保留）"
    else
        print_message $YELLOW "操作已取消"
    fi
}

# 显示帮助信息
show_help() {
    echo "打字练习应用部署脚本"
    echo ""
    echo "使用方法:"
    echo "  ./deploy.sh [命令]"
    echo ""
    echo "可用命令:"
    echo "  start    - 启动所有服务 (默认)"
    echo "  stop     - 停止所有服务"
    echo "  restart  - 重启所有服务"
    echo "  logs     - 查看服务日志"
    echo "  status   - 查看服务状态"
    echo "  clean    - 清理环境 (保留数据卷)"
    echo "  pull     - 拉取最新的预构建镜像"
    echo "  help     - 显示此帮助信息"
    echo ""
    echo "前置要求:"
    echo "  1. 确保外部 MySQL 和 Redis 服务已启动并可访问"
    echo "  2. 复制 env.example 到 .env 并配置外部服务地址"
    echo "  3. 确保 Docker 和 Docker Compose 已安装"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh start           # 启动应用"
    echo "  ./deploy.sh pull            # 拉取最新镜像"
    echo "  ./deploy.sh logs            # 查看日志"
    echo "  ./deploy.sh stop            # 停止应用"
}

# 主函数
main() {
    local command=${1:-start}
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            start|stop|restart|logs|status|clean|pull|help|--help|-h)
                command=$1
                shift
                ;;
            *)
                if [ -z "$command" ]; then
                    command=$1
                fi
                shift
                ;;
        esac
    done
    
    case $command in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        logs)
            show_logs
            ;;
        status)
            show_status
            ;;
        clean)
            clean_environment
            ;;
        pull)
            pull_image
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_message $RED "错误: 未知命令 '$command'"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 检查脚本是否在正确的目录中运行
if [ ! -f "docker-compose.prod.yml" ]; then
    print_message $RED "错误: 请在项目根目录中运行此脚本"
    exit 1
fi

# 运行主函数
main "$@"