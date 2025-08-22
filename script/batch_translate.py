#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量翻译脚本
用于预处理数据库中所有单词的meaningShort字段
将所有语言的单词翻译为中文
"""

import mysql.connector
import requests
import time
import json
from typing import List, Dict, Optional
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('batch_translate.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# 数据库配置
DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '2214380963Wx!!',
    'database': 'typing',
    'charset': 'utf8mb4'
}

# 语言映射表 - 将数据库中的语言ID映射到翻译API的语言代码
LANGUAGE_MAP = {
    'en': 'en',      # 英语
    'ja': 'ja',      # 日语
    'ko': 'ko',      # 韩语
    'fr': 'fr',      # 法语
    'de': 'de',      # 德语
    'es': 'es',      # 西班牙语
    'it': 'it',      # 意大利语
    'pt': 'pt',      # 葡萄牙语
    'ru': 'ru',      # 俄语
    'ar': 'ar',      # 阿拉伯语
    'th': 'th',      # 泰语
    'vi': 'vi',      # 越南语
    'hi': 'hi',      # 印地语
    'tr': 'tr',      # 土耳其语
    'nl': 'nl',      # 荷兰语
    'sv': 'sv',      # 瑞典语
    'da': 'da',      # 丹麦语
    'no': 'no',      # 挪威语
    'fi': 'fi',      # 芬兰语
    'pl': 'pl',      # 波兰语
    'cs': 'cs',      # 捷克语
    'hu': 'hu',      # 匈牙利语
    'ro': 'ro',      # 罗马尼亚语
    'bg': 'bg',      # 保加利亚语
    'hr': 'hr',      # 克罗地亚语
    'sk': 'sk',      # 斯洛伐克语
    'sl': 'sl',      # 斯洛文尼亚语
    'et': 'et',      # 爱沙尼亚语
    'lv': 'lv',      # 拉脱维亚语
    'lt': 'lt',      # 立陶宛语
    'mt': 'mt',      # 马耳他语
    'ga': 'ga',      # 爱尔兰语
    'cy': 'cy',      # 威尔士语
    'eu': 'eu',      # 巴斯克语
    'ca': 'ca',      # 加泰罗尼亚语
    'gl': 'gl',      # 加利西亚语
    'is': 'is',      # 冰岛语
    'mk': 'mk',      # 马其顿语
    'sq': 'sq',      # 阿尔巴尼亚语
    'sr': 'sr',      # 塞尔维亚语
    'bs': 'bs',      # 波斯尼亚语
    'me': 'me',      # 黑山语
    'uk': 'uk',      # 乌克兰语
    'be': 'be',      # 白俄罗斯语
    'kk': 'kk',      # 哈萨克语
    'ky': 'ky',      # 吉尔吉斯语
    'uz': 'uz',      # 乌兹别克语
    'tg': 'tg',      # 塔吉克语
    'mn': 'mn',      # 蒙古语
    'ka': 'ka',      # 格鲁吉亚语
    'hy': 'hy',      # 亚美尼亚语
    'az': 'az',      # 阿塞拜疆语
    'he': 'he',      # 希伯来语
    'fa': 'fa',      # 波斯语
    'ur': 'ur',      # 乌尔都语
    'bn': 'bn',      # 孟加拉语
    'ta': 'ta',      # 泰米尔语
    'te': 'te',      # 泰卢固语
    'ml': 'ml',      # 马拉雅拉姆语
    'kn': 'kn',      # 卡纳达语
    'gu': 'gu',      # 古吉拉特语
    'pa': 'pa',      # 旁遮普语
    'or': 'or',      # 奥里亚语
    'as': 'as',      # 阿萨姆语
    'ne': 'ne',      # 尼泊尔语
    'si': 'si',      # 僧伽罗语
    'my': 'my',      # 缅甸语
    'km': 'km',      # 高棉语
    'lo': 'lo',      # 老挝语
    'id': 'id',      # 印尼语
    'ms': 'ms',      # 马来语
    'tl': 'tl',      # 菲律宾语
    'zh': 'zh-CN',   # 中文（简体）
    'zh-TW': 'zh-TW' # 中文（繁体）
}

class BatchTranslator:
    def __init__(self):
        self.connection = None
        self.cursor = None
        self.processed_count = 0
        self.success_count = 0
        self.error_count = 0
        
    def connect_db(self):
        """连接数据库"""
        try:
            self.connection = mysql.connector.connect(**DB_CONFIG)
            self.cursor = self.connection.cursor(dictionary=True)
            logger.info("数据库连接成功")
            return True
        except Exception as e:
            logger.error(f"数据库连接失败: {e}")
            return False
    
    def close_db(self):
        """关闭数据库连接"""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        logger.info("数据库连接已关闭")
    
    def get_language_code(self, word_id: str) -> Optional[str]:
        """根据单词ID获取语言代码"""
        try:
            query = """
            SELECT l.code 
            FROM words w 
            JOIN languages l ON w.languageId = l.id 
            WHERE w.id = %s
            """
            self.cursor.execute(query, (word_id,))
            result = self.cursor.fetchone()
            if result:
                return result['code']
            return None
        except Exception as e:
            logger.error(f"获取语言代码失败: {e}")
            return None
    
    def get_words_without_translation(self, batch_size: int = 100) -> List[Dict]:
        """获取没有翻译的单词"""
        try:
            query = """
            SELECT w.id, w.word, l.code as language_code
            FROM words w
            JOIN languages l ON w.languageId = l.id
            WHERE w.meaningShort IS NULL OR w.meaningShort = ''
            LIMIT %s
            """
            self.cursor.execute(query, (batch_size,))
            return self.cursor.fetchall()
        except Exception as e:
            logger.error(f"查询单词失败: {e}")
            return []
    
    def translate_word(self, word: str, src_lang: str) -> Optional[str]:
        """翻译单词"""
        try:
            # 如果源语言已经是中文，跳过翻译
            if src_lang in ['zh', 'zh-CN', 'zh-TW']:
                return word
            
            # 映射语言代码
            api_src_lang = LANGUAGE_MAP.get(src_lang, src_lang)
            
            url = f"https://api.mymemory.translated.net/get"
            params = {
                'q': word,
                'langpair': f"{api_src_lang}|zh-CN"
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('responseStatus') == 200:
                translated_text = data.get('responseData', {}).get('translatedText')
                if translated_text and translated_text.strip():
                    return translated_text.strip()
            
            logger.warning(f"翻译API返回无效结果: {word} ({src_lang})")
            return None
            
        except requests.exceptions.RequestException as e:
            logger.error(f"翻译API请求失败: {word} ({src_lang}) - {e}")
            return None
        except Exception as e:
            logger.error(f"翻译过程出错: {word} ({src_lang}) - {e}")
            return None
    
    def update_word_translation(self, word_id: str, translation: str) -> bool:
        """更新单词翻译"""
        try:
            query = "UPDATE words SET meaningShort = %s WHERE id = %s"
            self.cursor.execute(query, (translation, word_id))
            self.connection.commit()
            return True
        except Exception as e:
            logger.error(f"更新翻译失败: {word_id} - {e}")
            return False
    
    def process_batch(self, batch_size: int = 50):
        """批量处理翻译"""
        logger.info(f"开始批量翻译处理，批次大小: {batch_size}")
        
        while True:
            # 获取一批需要翻译的单词
            words = self.get_words_without_translation(batch_size)
            
            if not words:
                logger.info("没有更多需要翻译的单词")
                break
            
            logger.info(f"处理 {len(words)} 个单词")
            
            for word_data in words:
                word_id = word_data['id']
                word_text = word_data['word']
                language_code = word_data['language_code']
                
                self.processed_count += 1
                
                # 翻译单词
                translation = self.translate_word(word_text, language_code)
                
                if translation:
                    # 更新数据库
                    if self.update_word_translation(word_id, translation):
                        self.success_count += 1
                        logger.info(f"成功翻译: {word_text} ({language_code}) -> {translation}")
                    else:
                        self.error_count += 1
                        logger.error(f"更新失败: {word_text} ({language_code})")
                else:
                    self.error_count += 1
                    logger.error(f"翻译失败: {word_text} ({language_code})")
                
                # 避免API限制，添加延迟
                time.sleep(0.1)
                
                # 每处理10个单词输出一次进度
                if self.processed_count % 10 == 0:
                    logger.info(f"进度: 已处理 {self.processed_count} 个单词，成功 {self.success_count} 个，失败 {self.error_count} 个")
            
            # 批次间延迟
            time.sleep(1)
    
    def get_statistics(self):
        """获取统计信息"""
        try:
            # 总单词数
            self.cursor.execute("SELECT COUNT(*) as total FROM words")
            total_words = self.cursor.fetchone()['total']
            
            # 已翻译单词数
            self.cursor.execute("SELECT COUNT(*) as translated FROM words WHERE meaningShort IS NOT NULL AND meaningShort != ''")
            translated_words = self.cursor.fetchone()['translated']
            
            # 未翻译单词数
            untranslated_words = total_words - translated_words
            
            logger.info(f"统计信息:")
            logger.info(f"  总单词数: {total_words}")
            logger.info(f"  已翻译: {translated_words}")
            logger.info(f"  未翻译: {untranslated_words}")
            logger.info(f"  翻译进度: {(translated_words/total_words*100):.2f}%")
            
            return {
                'total': total_words,
                'translated': translated_words,
                'untranslated': untranslated_words,
                'progress': translated_words/total_words*100
            }
        except Exception as e:
            logger.error(f"获取统计信息失败: {e}")
            return None
    
    def run(self, batch_size: int = 50):
        """运行批量翻译"""
        logger.info("开始批量翻译任务")
        
        if not self.connect_db():
            return False
        
        try:
            # 显示初始统计信息
            self.get_statistics()
            
            # 开始批量处理
            start_time = time.time()
            self.process_batch(batch_size)
            end_time = time.time()
            
            # 显示最终统计信息
            logger.info(f"批量翻译完成")
            logger.info(f"处理时间: {(end_time - start_time):.2f} 秒")
            logger.info(f"处理结果: 总计 {self.processed_count} 个，成功 {self.success_count} 个，失败 {self.error_count} 个")
            
            self.get_statistics()
            
            return True
            
        except KeyboardInterrupt:
            logger.info("用户中断了批量翻译任务")
            return False
        except Exception as e:
            logger.error(f"批量翻译过程中出错: {e}")
            return False
        finally:
            self.close_db()

def main():
    """主函数"""
    translator = BatchTranslator()
    
    # 可以调整批次大小，建议50-100之间
    batch_size = 50
    
    logger.info(f"启动批量翻译脚本，批次大小: {batch_size}")
    
    success = translator.run(batch_size)
    
    if success:
        logger.info("批量翻译任务成功完成")
    else:
        logger.error("批量翻译任务失败")

if __name__ == "__main__":
    main()