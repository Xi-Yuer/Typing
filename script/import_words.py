#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
单词数据导入脚本
从words文件夹中的JSON文件导入数据到MySQL数据库
"""

import os
import json
import re
import mysql.connector
from mysql.connector import Error
from typing import Dict, List, Tuple, Optional
import logging
from datetime import datetime

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('import_words.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class WordImporter:
    def __init__(self, host: str, port: int, database: str, username: str, password: str):
        self.host = host
        self.port = port
        self.database = database
        self.username = username
        self.password = password
        self.connection = None
        self.cursor = None
        
        # 语言映射
        self.language_mapping = {
            '中文': {'code': 'zh', 'script': 'Han'},
            '英语': {'code': 'en', 'script': 'Latin'},
            '日语': {'code': 'ja', 'script': 'Hiragana'},
            '德语': {'code': 'de', 'script': 'Latin'},
            '印尼语': {'code': 'id', 'script': 'Latin'},
            '编程': {'code': 'prog', 'script': 'Latin'}
        }
        
        # 分类难度映射
        self.difficulty_mapping = {
            '基础': 1,
            '初级': 1,
            '初中': 2,
            '中级': 2,
            '高中': 3,
            '高级': 3,
            '专业': 4,
            '考试': 4,
            'N5': 1,
            'N4': 2,
            'N3': 3,
            'N2': 4,
            'N1': 5,
            'CET4': 3,
            'CET6': 4,
            'IELTS': 4,
            'TOEFL': 4,
            'GRE': 5,
            'GMAT': 5
        }
    
    def connect(self):
        """连接数据库"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                port=self.port,
                database=self.database,
                user=self.username,
                password=self.password,
                charset='utf8mb4',
                collation='utf8mb4_unicode_ci'
            )
            self.cursor = self.connection.cursor()
            logger.info("数据库连接成功")
        except Error as e:
            logger.error(f"数据库连接失败: {e}")
            raise
    
    def disconnect(self):
        """断开数据库连接"""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        logger.info("数据库连接已关闭")
    
    def get_or_create_language(self, language_name: str) -> int:
        """获取或创建语言记录"""
        # 查询是否存在
        self.cursor.execute("SELECT id FROM languages WHERE name = %s", (language_name,))
        result = self.cursor.fetchone()
        
        if result:
            return result[0]
        
        # 创建新语言
        lang_info = self.language_mapping.get(language_name, {
            'code': language_name.lower()[:10],
            'script': 'Latin'
        })
        
        insert_query = """
            INSERT INTO languages (name, code, script, is_active)
            VALUES (%s, %s, %s, %s)
        """
        
        self.cursor.execute(insert_query, (
            language_name,
            lang_info['code'],
            lang_info['script'],
            1
        ))
        
        language_id = self.cursor.lastrowid
        logger.info(f"创建新语言: {language_name} (ID: {language_id})")
        return language_id
    
    def get_or_create_category(self, language_id: int, category_name: str) -> int:
        """获取或创建分类记录"""
        # 查询是否存在
        self.cursor.execute(
            "SELECT id FROM corpus_categories WHERE language_id = %s AND name = %s",
            (language_id, category_name)
        )
        result = self.cursor.fetchone()
        
        if result:
            return result[0]
        
        # 确定难度等级
        difficulty = 1
        for key, level in self.difficulty_mapping.items():
            if key in category_name:
                difficulty = level
                break
        
        # 创建新分类
        insert_query = """
            INSERT INTO corpus_categories (language_id, name, description, difficulty)
            VALUES (%s, %s, %s, %s)
        """
        
        description = f"{category_name}相关词汇"
        
        self.cursor.execute(insert_query, (
            language_id,
            category_name,
            description,
            difficulty
        ))
        
        category_id = self.cursor.lastrowid
        logger.info(f"创建新分类: {category_name} (ID: {category_id}, 难度: {difficulty})")
        return category_id
    
    def parse_filename(self, filename: str) -> Tuple[str, str]:
        """解析文件名获取语言和分类"""
        # 移除.json扩展名
        name = filename.replace('.json', '')
        
        # 分割语言和分类
        if '-' in name:
            parts = name.split('-', 1)
            language = parts[0]
            category = parts[1]
            
            # 移除数字后缀 (如 _1, _2)
            category = re.sub(r'_\d+$', '', category)
            
            return language, category
        
        return name, '基础'
    
    def process_word_data(self, word_data: dict, language_id: int, category_id: int) -> dict:
        """处理单词数据"""
        word = word_data.get('name', '').strip()
        if not word:
            return None
        
        # 处理翻译
        trans_list = word_data.get('trans', [])
        if isinstance(trans_list, list) and trans_list:
            meaning = '\n'.join(trans_list)
        else:
            meaning = str(trans_list) if trans_list else ''
        
        # 提取例句（从meaning中提取）
        example = ''
        if meaning:
            # 查找例句模式
            example_match = re.search(r'[A-Z][^.!?]*[.!?]', meaning)
            if example_match:
                example = example_match.group(0)
            else:
                example = meaning[:100] + '...' if len(meaning) > 100 else meaning
        
        # 处理音标
        us_phonetic = word_data.get('usphone', '') or word_data.get('phonetic', '')
        uk_phonetic = word_data.get('ukphone', '')
        
        # 处理音译
        transliteration = word_data.get('notation', '')
        
        return {
            'language_id': language_id,
            'category_id': category_id,
            'word': word,
            'transliteration': transliteration,
            'us_phonetic': us_phonetic,
            'uk_phonetic': uk_phonetic,
            'meaning': meaning,
            'example': example
        }
    
    def insert_word(self, word_data: dict) -> bool:
        """插入单词数据"""
        try:
            # 检查是否已存在
            self.cursor.execute(
                "SELECT id FROM words WHERE language_id = %s AND category_id = %s AND word = %s",
                (word_data['language_id'], word_data['category_id'], word_data['word'])
            )
            
            if self.cursor.fetchone():
                return False  # 已存在，跳过
            
            insert_query = """
                INSERT INTO words (
                    language_id, category_id, word, transliteration,
                    us_phonetic, uk_phonetic, meaning, example
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            self.cursor.execute(insert_query, (
                word_data['language_id'],
                word_data['category_id'],
                word_data['word'],
                word_data['transliteration'],
                word_data['us_phonetic'],
                word_data['uk_phonetic'],
                word_data['meaning'],
                word_data['example']
            ))
            
            return True
        except Error as e:
            logger.error(f"插入单词失败: {word_data['word']} - {e}")
            return False
    
    def process_json_file(self, file_path: str) -> Tuple[int, int]:
        """处理单个JSON文件"""
        filename = os.path.basename(file_path)
        language_name, category_name = self.parse_filename(filename)
        
        logger.info(f"处理文件: {filename} (语言: {language_name}, 分类: {category_name})")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if not isinstance(data, list):
                logger.warning(f"文件格式错误: {filename}")
                return 0, 0
            
            # 获取或创建语言和分类
            language_id = self.get_or_create_language(language_name)
            category_id = self.get_or_create_category(language_id, category_name)
            
            # 处理单词数据
            total_words = len(data)
            inserted_words = 0
            
            for word_data in data:
                processed_word = self.process_word_data(word_data, language_id, category_id)
                if processed_word and self.insert_word(processed_word):
                    inserted_words += 1
            
            self.connection.commit()
            logger.info(f"文件 {filename} 处理完成: {inserted_words}/{total_words} 个单词已插入")
            
            return total_words, inserted_words
            
        except Exception as e:
            logger.error(f"处理文件 {filename} 时出错: {e}")
            self.connection.rollback()
            return 0, 0
    
    def import_all_words(self, words_dir: str):
        """导入所有单词文件"""
        if not os.path.exists(words_dir):
            logger.error(f"目录不存在: {words_dir}")
            return
        
        json_files = [f for f in os.listdir(words_dir) if f.endswith('.json')]
        
        if not json_files:
            logger.warning(f"在目录 {words_dir} 中未找到JSON文件")
            return
        
        logger.info(f"找到 {len(json_files)} 个JSON文件")
        
        total_files = len(json_files)
        total_words_processed = 0
        total_words_inserted = 0
        
        for i, filename in enumerate(json_files, 1):
            file_path = os.path.join(words_dir, filename)
            logger.info(f"进度: {i}/{total_files} - 处理文件: {filename}")
            
            words_processed, words_inserted = self.process_json_file(file_path)
            total_words_processed += words_processed
            total_words_inserted += words_inserted
        
        logger.info(f"导入完成! 总计处理 {total_words_processed} 个单词，成功插入 {total_words_inserted} 个")

def main():
    # 数据库配置
    DB_CONFIG = {
        'host': 'localhost',
        'port': 3306,
        'database': 'typing',
        'username': 'root',
        'password': '2214380963Wx!!'
    }
    
    # words文件夹路径
    words_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'words')
    
    importer = WordImporter(**DB_CONFIG)
    
    try:
        importer.connect()
        importer.import_all_words(words_dir)
    except Exception as e:
        logger.error(f"导入过程中出现错误: {e}")
    finally:
        importer.disconnect()

if __name__ == '__main__':
    main()