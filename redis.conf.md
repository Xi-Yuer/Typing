# Redis 配置说明

## 配置文件位置

Redis配置文件位于项目根目录：`redis.conf`

## 主要配置项

### 网络配置
- `bind 0.0.0.0` - 允许所有IP连接
- `port 6379` - Redis端口
- `protected-mode no` - 关闭保护模式（适用于Docker环境）

### 内存配置
- `maxmemory 256mb` - 最大内存使用量
- `maxmemory-policy allkeys-lru` - 内存不足时的淘汰策略

### 持久化配置
- `save 900 1` - 900秒内至少1个key变化时保存
- `save 300 10` - 300秒内至少10个key变化时保存
- `save 60 10000` - 60秒内至少10000个key变化时保存

### 日志配置
- `loglevel notice` - 日志级别
- `logfile ""` - 输出到标准输出（便于Docker日志查看）

## 警告信息说明

### 1. 内存过度提交警告
```
WARNING Memory overcommit must be enabled!
```

**解决方案**：
```bash
# 临时启用（重启后失效）
sudo sysctl vm.overcommit_memory=1

# 永久启用（需要重启系统）
echo 'vm.overcommit_memory = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 2. 配置文件警告
```
Warning: no config file specified, using the default config
```

**已解决**：现在Redis使用自定义配置文件启动。

## 性能优化建议

1. **内存设置**：根据服务器内存调整 `maxmemory` 值
2. **持久化策略**：根据数据重要性调整 `save` 配置
3. **网络优化**：在生产环境中考虑启用 `protected-mode`

## 安全建议

1. **密码保护**：在生产环境中取消注释 `requirepass` 配置
2. **网络限制**：使用防火墙限制Redis端口访问
3. **定期备份**：配置RDB和AOF持久化

## 监控和调试

```bash
# 连接Redis
docker exec -it typing-redis redis-cli

# 查看Redis信息
docker exec -it typing-redis redis-cli info

# 查看Redis配置
docker exec -it typing-redis redis-cli config get "*"
```
