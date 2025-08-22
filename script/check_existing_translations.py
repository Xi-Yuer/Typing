#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检查现有翻译数据格式
"""

import mysql.connector
import re

# 数据库配置
DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '2214380963Wx!!',
    'database': 'typing',
    'charset': 'utf8mb4'
}

def check_existing_translations():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        print("=== 检查现有翻译数据格式 ===")
        cursor.execute("""
            SELECT word, meaning, meaningShort 
            FROM words 
            WHERE meaning IS NOT NULL AND meaning != '' 
            LIMIT 10
        """)
        
        results = cursor.fetchall()
        
        for word, meaning, meaning_short in results:
            print(f"单词: {word}")
            print(f"完整翻译: {meaning}")
            print(f"简短翻译: {meaning_short}")
            print("---")
        
        cursor.close()
        connection.close()
        
    except Exception as e:
        print(f"错误: {e}")

def extract_short_meaning(full_meaning):
    """
    从完整翻译中提取简短翻译
    """
    if not full_meaning:
        return None
    
    # 移除词性标记 (如：n. v. adj. adv. 等)
    cleaned = re.sub(r'^[a-zA-Z]+\.\s*', '', full_meaning)
    
    # 取第一个含义（通常用分号、逗号或句号分隔）
    first_meaning = re.split(r'[;，；。]', cleaned)[0].strip()
    
    # 移除括号内容
    first_meaning = re.sub(r'\([^)]*\)', '', first_meaning).strip()
    
    # 移除多余的空格
    first_meaning = re.sub(r'\s+', ' ', first_meaning).strip()
    
    # 限制长度
    if len(first_meaning) > 20:
        first_meaning = first_meaning[:20] + '...'
    
    return first_meaning if first_meaning else None

def test_extraction():
    """
    测试提取逻辑
    """
    test_cases = [
        "n. 重要，要紧，有关系；物质，物体",
        "v. 说话，讲话；演讲",
        "adj. 疼痛的，酸痛的；愤怒的",
        "怎么了？出什么事了？",
        "重要，要紧，有关系"
    ]
    
    print("\n=== 测试提取逻辑 ===")
    for case in test_cases:
        result = extract_short_meaning(case)
        print(f"原文: {case}")
        print(f"提取: {result}")
        print("---")

if __name__ == "__main__":
    check_existing_translations()
    test_extraction()