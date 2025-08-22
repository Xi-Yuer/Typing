#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从现有翻译数据中提取简短翻译
不调用外部API，直接处理数据库中的meaning字段
"""

import mysql.connector
import re
import logging
from typing import Optional
try:
    import jieba
    import jieba.posseg as pseg
    JIEBA_AVAILABLE = True
except ImportError:
    JIEBA_AVAILABLE = False
    print("警告: jieba库未安装，将使用基础提取方法")
    print("建议运行: pip install jieba")

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('extract_short_translations.log'),
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

class ShortTranslationExtractor:
    def __init__(self):
        self.connection = None
        self.cursor = None
        self.processed_count = 0
        self.success_count = 0
        self.skip_count = 0
        
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
    
    def extract_short_meaning_intelligent(self, full_meaning: str) -> Optional[str]:
        """
        使用智能方法提取简短翻译
        """
        if not full_meaning or full_meaning.strip() == '':
            return None
        
        cleaned = full_meaning.strip()
        
        # 移除词性标记
        cleaned = re.sub(r'^[a-zA-Z]+\.\s*', '', cleaned)
        cleaned = re.sub(r'\([^)]*\)', '', cleaned)
        
        if JIEBA_AVAILABLE:
            # 使用jieba进行智能分析
            words = list(pseg.cut(cleaned))
            
            # 提取核心词汇（名词、动词、形容词）
            core_words = []
            for word, flag in words:
                word = word.strip()
                # 保留名词(n)、动词(v)、形容词(a)，过滤单字符和标点
                if (flag.startswith(('n', 'v', 'a')) and 
                    len(word) > 0 and 
                    not word in ['，', '；', '。', '、', '的', '了', '是', '在', '有', '和']):
                    core_words.append(word)
            
            if core_words:
                # 只返回第一个最核心的词汇
                return core_words[0][:8]
        
        # 回退到基础方法
        return self.extract_short_meaning_basic(cleaned)
    
    def extract_short_meaning_basic(self, full_meaning: str) -> Optional[str]:
        """
        基础提取方法（原有逻辑）
        """
        if not full_meaning or full_meaning.strip() == '':
            return None
        
        cleaned = full_meaning.strip()
        
        # 移除词性标记
        cleaned = re.sub(r'^[a-zA-Z]+\.\s*', '', cleaned)
        cleaned = re.sub(r'\([^)]*\)', '', cleaned)
        
        # 智能分隔符处理 - 只取第一个含义
        separators = ['；', ';', '，', ',', '。', '.', '、', '：', ':']
        first_meaning = cleaned
        
        # 按优先级处理分隔符，只取第一部分
        for sep in separators:
            if sep in cleaned:
                first_meaning = cleaned.split(sep)[0].strip()
                break
        
        # 移除多余空格
        first_meaning = re.sub(r'\s+', ' ', first_meaning).strip()
        
        # 智能长度控制
        if len(first_meaning) > 12:
            # 尝试在词边界截断
            words = first_meaning.split()
            if len(words) > 1:
                # 保留前面的完整词
                result = ''
                for word in words:
                    if len(result + word) <= 10:
                        result += word
                    else:
                        break
                if result:
                    first_meaning = result
            else:
                # 单个长词，智能截断
                first_meaning = first_meaning[:10]
        
        return first_meaning if first_meaning else None
    
    def extract_short_meaning(self, full_meaning: str) -> Optional[str]:
        """
        主要提取方法，优先使用智能方法
        """
        # 首先尝试智能提取
        result = self.extract_short_meaning_intelligent(full_meaning)
        
        # 如果智能提取失败或结果不理想，使用基础方法
        if not result or len(result) < 2:
            result = self.extract_short_meaning_basic(full_meaning)
        
        return result
    
    def get_words_with_meaning(self, batch_size: int = 100):
        """获取有完整翻译但没有简短翻译的单词"""
        try:
            query = """
            SELECT id, word, meaning
            FROM words 
            WHERE meaning IS NOT NULL 
            AND meaning != '' 
            AND (meaningShort IS NULL OR meaningShort = '')
            LIMIT %s
            """
            self.cursor.execute(query, (batch_size,))
            return self.cursor.fetchall()
        except Exception as e:
            logger.error(f"查询单词失败: {e}")
            return []
    
    def update_short_meaning(self, word_id: int, short_meaning: str) -> bool:
        """更新简短翻译"""
        try:
            query = "UPDATE words SET meaningShort = %s WHERE id = %s"
            self.cursor.execute(query, (short_meaning, word_id))
            self.connection.commit()
            return True
        except Exception as e:
            logger.error(f"更新简短翻译失败: {word_id} - {e}")
            return False
    
    def process_batch(self, batch_size: int = 100):
        """批量处理翻译提取"""
        logger.info(f"开始批量提取简短翻译，批次大小: {batch_size}")
        
        while True:
            # 获取一批需要处理的单词
            words = self.get_words_with_meaning(batch_size)
            
            if not words:
                logger.info("没有更多需要处理的单词")
                break
            
            logger.info(f"处理 {len(words)} 个单词")
            
            for word_data in words:
                word_id = word_data['id']
                word_text = word_data['word']
                full_meaning = word_data['meaning']
                
                self.processed_count += 1
                
                # 提取简短翻译
                short_meaning = self.extract_short_meaning(full_meaning)
                
                if short_meaning:
                    # 更新数据库
                    if self.update_short_meaning(word_id, short_meaning):
                        self.success_count += 1
                        logger.info(f"成功提取: {word_text} -> {short_meaning}")
                    else:
                        logger.error(f"更新失败: {word_text}")
                else:
                    self.skip_count += 1
                    logger.warning(f"跳过: {word_text} (无法提取有效翻译)")
                
                # 每处理20个单词输出一次进度
                if self.processed_count % 20 == 0:
                    logger.info(f"进度: 已处理 {self.processed_count} 个单词，成功 {self.success_count} 个，跳过 {self.skip_count} 个")
    
    def get_statistics(self):
        """获取统计信息"""
        try:
            # 总单词数
            self.cursor.execute("SELECT COUNT(*) as total FROM words")
            total_words = self.cursor.fetchone()['total']
            
            # 有完整翻译的单词数
            self.cursor.execute("SELECT COUNT(*) as with_meaning FROM words WHERE meaning IS NOT NULL AND meaning != ''")
            with_meaning = self.cursor.fetchone()['with_meaning']
            
            # 有简短翻译的单词数
            self.cursor.execute("SELECT COUNT(*) as with_short FROM words WHERE meaningShort IS NOT NULL AND meaningShort != ''")
            with_short = self.cursor.fetchone()['with_short']
            
            # 需要处理的单词数
            need_process = with_meaning - with_short
            
            logger.info(f"统计信息:")
            logger.info(f"  总单词数: {total_words}")
            logger.info(f"  有完整翻译: {with_meaning}")
            logger.info(f"  有简短翻译: {with_short}")
            logger.info(f"  需要处理: {need_process}")
            
            if with_meaning > 0:
                logger.info(f"  处理进度: {(with_short/with_meaning*100):.2f}%")
            
            return {
                'total': total_words,
                'with_meaning': with_meaning,
                'with_short': with_short,
                'need_process': need_process
            }
        except Exception as e:
            logger.error(f"获取统计信息失败: {e}")
            return None
    
    def run(self, batch_size: int = 100):
        """运行批量提取"""
        logger.info("开始简短翻译提取任务")
        
        if not self.connect_db():
            return False
        
        try:
            # 显示初始统计信息
            self.get_statistics()
            
            # 开始批量处理
            import time
            start_time = time.time()
            self.process_batch(batch_size)
            end_time = time.time()
            
            # 显示最终统计信息
            logger.info(f"简短翻译提取完成")
            logger.info(f"处理时间: {(end_time - start_time):.2f} 秒")
            logger.info(f"处理结果: 总计 {self.processed_count} 个，成功 {self.success_count} 个，跳过 {self.skip_count} 个")
            
            self.get_statistics()
            
            return True
            
        except KeyboardInterrupt:
            logger.info("用户中断了提取任务")
            return False
        except Exception as e:
            logger.error(f"提取过程中出错: {e}")
            return False
        finally:
            self.close_db()

def main():
    """主函数"""
    extractor = ShortTranslationExtractor()
    
    # 批次大小，建议100-500之间
    batch_size = 200
    
    logger.info(f"启动简短翻译提取脚本，批次大小: {batch_size}")
    
    success = extractor.run(batch_size)
    
    if success:
        logger.info("简短翻译提取任务成功完成")
    else:
        logger.error("简短翻译提取任务失败")

if __name__ == "__main__":
    main()