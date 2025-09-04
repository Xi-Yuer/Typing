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

# 检查环境变量文件
check_env_file() {
    if [ ! -f ".env" ]; then
        print_message $YELLOW "警告: .env 文件不存在，将使用默认配置"
        print_message $YELLOW "建议复制 .env.example 到 .env 并根据需要修改配置"
        print_message $BLUE "执行: cp .env.example .env"
    else
        print_message $GREEN "✓ 找到环境配置文件"
    fi
}

# 启动服务
start_services() {
    print_message $BLUE "启动打字练习应用..."
    
    # 检查依赖
    check_dependencies
    check_env_file
    
    # 构建并启动服务
    print_message $BLUE "构建并启动所有服务..."
    docker-compose up -d --build
    
    # 等待服务启动
    print_message $BLUE "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    print_message $BLUE "检查服务状态..."
    docker-compose ps
    
    print_message $GREEN "\n🎉 部署完成！"
    print_message $GREEN "前端应用: http://localhost:3000"
    print_message $GREEN "后端 API: http://localhost:80"
    print_message $GREEN "API 文档: http://localhost:80/doc"
    print_message $YELLOW "\n提示: 使用 './deploy.sh logs' 查看日志"
}

# 停止服务
stop_services() {
    print_message $BLUE "停止所有服务..."
    docker-compose down
    print_message $GREEN "✓ 服务已停止"
}

# 重启服务
restart_services() {
    print_message $BLUE "重启所有服务..."
    docker-compose restart
    print_message $GREEN "✓ 服务已重启"
}

# 查看日志
show_logs() {
    print_message $BLUE "显示服务日志 (按 Ctrl+C 退出)..."
    docker-compose logs -f
}

# 查看状态
show_status() {
    print_message $BLUE "服务状态:"
    docker-compose ps
    
    print_message $BLUE "\n资源使用情况:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

# 清理环境
clean_environment() {
    print_message $YELLOW "警告: 这将删除所有容器、网络和数据卷！"
    read -p "确定要继续吗？(y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message $BLUE "清理环境..."
        docker-compose down -v --remove-orphans
        docker rmi typing-app 2>/dev/null || true
        print_message $GREEN "✓ 环境已清理"
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
    echo "  clean    - 清理环境 (删除所有数据)"
    echo "  help     - 显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh start    # 启动应用"
    echo "  ./deploy.sh logs     # 查看日志"
    echo "  ./deploy.sh stop     # 停止应用"
}

# 主函数
main() {
    local command=${1:-start}
    
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
if [ ! -f "docker-compose.yml" ]; then
    print_message $RED "错误: 请在项目根目录中运行此脚本"
    exit 1
fi

# 运行主函数
main "$@"