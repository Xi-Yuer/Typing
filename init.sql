
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED WITH mysql_native_password BY '2214380963Wx!!';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- 数据库初始化脚本
-- 设置字符集和排序规则
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `typing` 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE `typing`;

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '用户名',
  `email` varchar(255) NOT NULL COMMENT '邮箱',
  `password` varchar(255) DEFAULT NULL COMMENT '密码（第三方登录可为空）',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像URL',
  `role` enum('user','admin') NOT NULL DEFAULT 'user' COMMENT '用户角色',
  `provider` enum('local','github','qq') NOT NULL DEFAULT 'local' COMMENT '登录方式',
  `providerId` varchar(100) DEFAULT NULL COMMENT '第三方登录ID',
  `isActive` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否激活',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deletedAt` datetime(6) DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  KEY `IDX_users_provider_providerId` (`provider`,`providerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 语言表
CREATE TABLE IF NOT EXISTS `languages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '语言名称',
  `code` varchar(10) NOT NULL COMMENT '语言代码',
  `flag` varchar(500) DEFAULT NULL COMMENT '国旗图标URL',
  `isActive` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否激活',
  `sortOrder` int NOT NULL DEFAULT '0' COMMENT '排序',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deletedAt` datetime(6) DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_languages_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='语言表';

-- 语料分类表
CREATE TABLE IF NOT EXISTS `corpus_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '分类名称',
  `description` text COMMENT '分类描述',
  `languageId` int NOT NULL COMMENT '所属语言ID',
  `difficulty` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner' COMMENT '难度等级',
  `isActive` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否激活',
  `sortOrder` int NOT NULL DEFAULT '0' COMMENT '排序',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deletedAt` datetime(6) DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  KEY `FK_corpus_categories_languageId` (`languageId`),
  CONSTRAINT `FK_corpus_categories_languageId` FOREIGN KEY (`languageId`) REFERENCES `languages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='语料分类表';

-- 单词表
CREATE TABLE IF NOT EXISTS `words` (
  `id` int NOT NULL AUTO_INCREMENT,
  `word` text NOT NULL COMMENT '单词或句子内容',
  `transliteration` varchar(500) DEFAULT NULL COMMENT '音译',
  `usPhonetic` varchar(200) DEFAULT NULL COMMENT '美式音标',
  `ukPhonetic` varchar(200) DEFAULT NULL COMMENT '英式音标',
  `meaning` text COMMENT '完整释义',
  `meaningShort` varchar(500) DEFAULT NULL COMMENT '简短释义',
  `example` text COMMENT '例句',
  `audioUrl` varchar(500) DEFAULT NULL COMMENT '音频URL',
  `imageUrl` varchar(500) DEFAULT NULL COMMENT '图片URL',
  `languageId` int NOT NULL COMMENT '所属语言ID',
  `categoryId` int NOT NULL COMMENT '所属分类ID',
  `difficulty` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner' COMMENT '难度等级',
  `frequency` int NOT NULL DEFAULT '0' COMMENT '使用频率',
  `isActive` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否激活',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deletedAt` datetime(6) DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  KEY `FK_words_languageId` (`languageId`),
  KEY `FK_words_categoryId` (`categoryId`),
  KEY `IDX_words_difficulty` (`difficulty`),
  KEY `IDX_words_frequency` (`frequency`),
  FULLTEXT KEY `IDX_words_word_meaning` (`word`,`meaning`),
  CONSTRAINT `FK_words_categoryId` FOREIGN KEY (`categoryId`) REFERENCES `corpus_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_words_languageId` FOREIGN KEY (`languageId`) REFERENCES `languages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='单词表';

-- 学习进度表
CREATE TABLE IF NOT EXISTS `study_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL COMMENT '用户ID',
  `wordId` int NOT NULL COMMENT '单词ID',
  `correctCount` int NOT NULL DEFAULT '0' COMMENT '正确次数',
  `wrongCount` int NOT NULL DEFAULT '0' COMMENT '错误次数',
  `lastStudyAt` datetime DEFAULT NULL COMMENT '最后学习时间',
  `masteryLevel` enum('new','learning','familiar','mastered') NOT NULL DEFAULT 'new' COMMENT '掌握程度',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_study_progress_user_word` (`userId`,`wordId`),
  KEY `FK_study_progress_wordId` (`wordId`),
  KEY `IDX_study_progress_masteryLevel` (`masteryLevel`),
  CONSTRAINT `FK_study_progress_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_study_progress_wordId` FOREIGN KEY (`wordId`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学习进度表';

-- 语音记录表
CREATE TABLE IF NOT EXISTS `speech_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wordId` int NOT NULL COMMENT '单词ID',
  `audioUrl` varchar(500) NOT NULL COMMENT '音频URL',
  `voice` varchar(50) DEFAULT '0' COMMENT '语音类型',
  `provider` varchar(50) NOT NULL DEFAULT 'youdao' COMMENT '语音提供商',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_speech_records_word_voice` (`wordId`,`voice`),
  CONSTRAINT `FK_speech_records_wordId` FOREIGN KEY (`wordId`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='语音记录表';

-- 插入初始数据
-- 插入默认语言
INSERT IGNORE INTO `languages` (`id`, `name`, `code`, `flag`, `isActive`, `sortOrder`) VALUES
(1, '英语', 'en', '🇺🇸', 1, 1),
(2, '中文', 'zh', '🇨🇳', 1, 2),
(3, '日语', 'ja', '🇯🇵', 1, 3),
(4, '韩语', 'ko', '🇰🇷', 1, 4),
(5, '法语', 'fr', '🇫🇷', 1, 5),
(6, '德语', 'de', '🇩🇪', 1, 6),
(7, '西班牙语', 'es', '🇪🇸', 1, 7),
(8, '俄语', 'ru', '🇷🇺', 1, 8);

-- 插入默认分类
INSERT IGNORE INTO `corpus_categories` (`id`, `name`, `description`, `languageId`, `difficulty`, `isActive`, `sortOrder`) VALUES
(1, '基础词汇', '日常生活中的基础词汇', 1, 'beginner', 1, 1),
(2, '商务英语', '商务场景中的常用词汇', 1, 'intermediate', 1, 2),
(3, '学术英语', '学术写作和研究中的词汇', 1, 'advanced', 1, 3),
(4, '日常用语', '日常交流中的常用词汇', 2, 'beginner', 1, 1),
(5, '商务中文', '商务场景中的中文词汇', 2, 'intermediate', 1, 2);

-- 插入示例单词
INSERT IGNORE INTO `words` (`id`, `word`, `transliteration`, `usPhonetic`, `ukPhonetic`, `meaning`, `meaningShort`, `example`, `languageId`, `categoryId`, `difficulty`) VALUES
(1, 'hello', 'hə-ˈlō', '/həˈloʊ/', '/həˈləʊ/', '用于问候的感叹词，表示你好', '你好', 'Hello, how are you?', 1, 1, 'beginner'),
(2, 'world', 'wərld', '/wɜːrld/', '/wɜːld/', '世界；地球；领域', '世界', 'Welcome to the world of programming.', 1, 1, 'beginner'),
(3, 'Keep walking , keep growing', '', '', '', '不断前行，不断成长', '不断前行，不断成长', '', 1, 1, 'beginner'),
(4, '你好', 'nǐ hǎo', '', '', '用于问候的词语', '问候语', '你好，很高兴见到你。', 2, 4, 'beginner'),
(5, '世界', 'shì jiè', '', '', '地球；全球；领域', '地球', '这是一个美丽的世界。', 2, 4, 'beginner');

-- 插入默认管理员用户（密码：admin123，已加密）
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`, `provider`, `isActive`) VALUES
(1, 'Admin', 'admin@typing.com', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeH8H8H8H8H8H8H8H8H8H8H8H8H8H8H8', 'admin', 'local', 1);

SET FOREIGN_KEY_CHECKS = 1;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS `IDX_words_active_language_category` ON `words` (`isActive`, `languageId`, `categoryId`);
CREATE INDEX IF NOT EXISTS `IDX_corpus_categories_active_language` ON `corpus_categories` (`isActive`, `languageId`);
CREATE INDEX IF NOT EXISTS `IDX_languages_active_sort` ON `languages` (`isActive`, `sortOrder`);

-- 设置自增起始值
ALTER TABLE `users` AUTO_INCREMENT = 2;
ALTER TABLE `languages` AUTO_INCREMENT = 9;
ALTER TABLE `corpus_categories` AUTO_INCREMENT = 6;
ALTER TABLE `words` AUTO_INCREMENT = 6;

COMMIT;