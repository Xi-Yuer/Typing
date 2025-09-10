import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRedis() private readonly redis: Redis
  ) {}

  /**
   * 使用 Cache Manager 设置缓存
   * @param key 缓存键
   * @param value 缓存值
   * @param ttl 过期时间（毫秒）
   */
  async setCache(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * 使用 Cache Manager 获取缓存
   * @param key 缓存键
   * @returns 缓存值
   */
  async getCache<T = any>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  /**
   * 使用 Cache Manager 删除缓存
   * @param key 缓存键
   */
  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * 直接使用 Redis 设置字符串值
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（秒）
   */
  async setString(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.setex(key, ttl, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  /**
   * 直接使用 Redis 获取字符串值
   * @param key 键
   * @returns 字符串值
   */
  async getString(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  /**
   * 直接使用 Redis 设置 JSON 对象
   * @param key 键
   * @param value 对象值
   * @param ttl 过期时间（秒）
   */
  async setObject(key: string, value: any, ttl?: number): Promise<void> {
    const jsonString = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, jsonString);
    } else {
      await this.redis.set(key, jsonString);
    }
  }

  /**
   * 直接使用 Redis 获取 JSON 对象
   * @param key 键
   * @returns 解析后的对象
   */
  async getObject<T = any>(key: string): Promise<T | null> {
    const jsonString = await this.redis.get(key);
    if (!jsonString) {
      return null;
    }
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse JSON from Redis:', error);
      return null;
    }
  }

  /**
   * 直接使用 Redis 删除键
   * @param key 键
   * @returns 删除的键数量
   */
  async deleteKey(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  /**
   * 检查键是否存在
   * @param key 键
   * @returns 是否存在
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  /**
   * 设置键的过期时间
   * @param key 键
   * @param ttl 过期时间（秒）
   * @returns 是否设置成功
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    const result = await this.redis.expire(key, ttl);
    return result === 1;
  }

  /**
   * 获取键的剩余过期时间
   * @param key 键
   * @returns 剩余秒数，-1表示永不过期，-2表示键不存在
   */
  async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key);
  }

  /**
   * 批量删除匹配的键
   * @param pattern 匹配模式，如 'user:*'
   * @returns 删除的键数量
   */
  async deleteByPattern(pattern: string): Promise<number> {
    const keys = await this.redis.keys(pattern);
    if (keys.length === 0) {
      return 0;
    }
    return await this.redis.del(...keys);
  }

  /**
   * 获取匹配的所有键
   * @param pattern 匹配模式，如 'user:*'
   * @returns 键列表
   */
  async getKeys(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern);
  }

  /**
   * 哈希表操作 - 设置哈希字段
   * @param key 哈希键
   * @param field 字段名
   * @param value 字段值
   */
  async hset(key: string, field: string, value: string): Promise<number> {
    return await this.redis.hset(key, field, value);
  }

  /**
   * 哈希表操作 - 获取哈希字段
   * @param key 哈希键
   * @param field 字段名
   * @returns 字段值
   */
  async hget(key: string, field: string): Promise<string | null> {
    return await this.redis.hget(key, field);
  }

  /**
   * 哈希表操作 - 获取所有字段
   * @param key 哈希键
   * @returns 所有字段和值
   */
  async hgetall(key: string): Promise<Record<string, string>> {
    return await this.redis.hgetall(key);
  }

  /**
   * 哈希表操作 - 删除字段
   * @param key 哈希键
   * @param field 字段名
   * @returns 删除的字段数量
   */
  async hdel(key: string, field: string): Promise<number> {
    return await this.redis.hdel(key, field);
  }

  /**
   * 列表操作 - 从左侧推入
   * @param key 列表键
   * @param value 值
   * @returns 列表长度
   */
  async lpush(key: string, value: string): Promise<number> {
    return await this.redis.lpush(key, value);
  }

  /**
   * 列表操作 - 从右侧推入
   * @param key 列表键
   * @param value 值
   * @returns 列表长度
   */
  async rpush(key: string, value: string): Promise<number> {
    return await this.redis.rpush(key, value);
  }

  /**
   * 列表操作 - 从左侧弹出
   * @param key 列表键
   * @returns 弹出的值
   */
  async lpop(key: string): Promise<string | null> {
    return await this.redis.lpop(key);
  }

  /**
   * 列表操作 - 从右侧弹出
   * @param key 列表键
   * @returns 弹出的值
   */
  async rpop(key: string): Promise<string | null> {
    return await this.redis.rpop(key);
  }

  /**
   * 列表操作 - 获取列表范围
   * @param key 列表键
   * @param start 开始索引
   * @param stop 结束索引
   * @returns 列表元素
   */
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.redis.lrange(key, start, stop);
  }

  /**
   * 集合操作 - 添加成员
   * @param key 集合键
   * @param member 成员
   * @returns 添加的成员数量
   */
  async sadd(key: string, member: string): Promise<number> {
    return await this.redis.sadd(key, member);
  }

  /**
   * 集合操作 - 获取所有成员
   * @param key 集合键
   * @returns 所有成员
   */
  async smembers(key: string): Promise<string[]> {
    return await this.redis.smembers(key);
  }

  /**
   * 集合操作 - 检查成员是否存在
   * @param key 集合键
   * @param member 成员
   * @returns 是否存在
   */
  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.redis.sismember(key, member);
    return result === 1;
  }

  /**
   * 集合操作 - 删除成员
   * @param key 集合键
   * @param member 成员
   * @returns 删除的成员数量
   */
  async srem(key: string, member: string): Promise<number> {
    return await this.redis.srem(key, member);
  }

  /**
   * 获取 Redis 连接信息
   * @returns Redis 连接状态
   */
  async getInfo(): Promise<string> {
    return await this.redis.info();
  }

  /**
   * 清空当前数据库
   */
  async flushdb(): Promise<void> {
    await this.redis.flushdb();
  }

  /**
   * 清空所有数据库
   */
  async flushall(): Promise<void> {
    await this.redis.flushall();
  }
}
