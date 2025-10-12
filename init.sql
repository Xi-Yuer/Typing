
-- 确保 root 用户可以从任意主机连接（密码通过环境变量设置）
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- 为容器网络创建 root 用户
CREATE USER IF NOT EXISTS 'root'@'typing-app.typing_typing-network' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'typing-app.typing_typing-network' WITH GRANT OPTION;

FLUSH PRIVILEGES;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for corpus_categories
-- ----------------------------
DROP TABLE IF EXISTS `corpus_categories`;
CREATE TABLE `corpus_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `language_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `difficulty` int NOT NULL,
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `delete_time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_3394ced488e5b0a07f769bed1de` (`language_id`),
  CONSTRAINT `FK_3394ced488e5b0a07f769bed1de` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for languages
-- ----------------------------
DROP TABLE IF EXISTS `languages`;
CREATE TABLE `languages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  `script` varchar(50) NOT NULL,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleteTime` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7397752718d1c9eb873722ec9b` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for sentences
-- ----------------------------
DROP TABLE IF EXISTS `sentences`;
CREATE TABLE `sentences` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `language_id` int NOT NULL,
  `category_id` bigint NOT NULL,
  `sentence` text NOT NULL,
  `meaning` text NOT NULL,
  `audio_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_3e3bf72cb2124b427d952cab6db` (`language_id`),
  KEY `FK_7ff59f0d31e2e5bb00c28155932` (`category_id`),
  CONSTRAINT `FK_3e3bf72cb2124b427d952cab6db` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`),
  CONSTRAINT `FK_7ff59f0d31e2e5bb00c28155932` FOREIGN KEY (`category_id`) REFERENCES `corpus_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for user_oauth
-- ----------------------------
DROP TABLE IF EXISTS `user_oauth`;
CREATE TABLE `user_oauth` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `provider` enum('github','google','wechat','qq') NOT NULL,
  `providerId` varchar(100) NOT NULL,
  `providerUsername` varchar(100) DEFAULT NULL,
  `providerEmail` varchar(255) DEFAULT NULL,
  `avatarUrl` varchar(500) DEFAULT NULL,
  `rawData` json DEFAULT NULL,
  `accessToken` varchar(500) DEFAULT NULL,
  `refreshToken` varchar(500) DEFAULT NULL,
  `tokenExpiresAt` datetime DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleteTime` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_b7a9b856329b6e832f5ffb017d` (`provider`,`providerId`),
  KEY `FK_5ed0c676645727b4be0f3c27abf` (`userId`),
  CONSTRAINT `FK_5ed0c676645727b4be0f3c27abf` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for user_word_progress
-- ----------------------------
DROP TABLE IF EXISTS `user_word_progress`;
CREATE TABLE `user_word_progress` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `word_id` bigint NOT NULL,
  `language_id` int NOT NULL,
  `category_id` bigint NOT NULL,
  `status` enum('learning','mastered','review') NOT NULL DEFAULT 'learning',
  `practice_count` int NOT NULL DEFAULT '0',
  `correct_count` int NOT NULL DEFAULT '0',
  `error_count` int NOT NULL DEFAULT '0',
  `accuracy_rate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `first_learned_at` timestamp NULL DEFAULT NULL,
  `last_practiced_at` timestamp NULL DEFAULT NULL,
  `mastered_at` timestamp NULL DEFAULT NULL,
  `next_review_at` timestamp NULL DEFAULT NULL,
  `review_interval_days` int NOT NULL DEFAULT '1',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_687e6c8f1cf985fdff6801def0` (`user_id`,`word_id`),
  KEY `IDX_9845792289da59d616056465ae` (`user_id`,`next_review_at`),
  KEY `IDX_11e374323063e049ee61f807b5` (`user_id`,`status`),
  KEY `FK_9079eff21093d1ad1cad76be838` (`word_id`),
  KEY `FK_2e0d95e4badf10fc31762c7e5ce` (`language_id`),
  KEY `FK_7b954cda91bc36955511865f9a1` (`category_id`),
  CONSTRAINT `FK_2e0d95e4badf10fc31762c7e5ce` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`),
  CONSTRAINT `FK_7b954cda91bc36955511865f9a1` FOREIGN KEY (`category_id`) REFERENCES `corpus_categories` (`id`),
  CONSTRAINT `FK_9079eff21093d1ad1cad76be838` FOREIGN KEY (`word_id`) REFERENCES `words` (`id`),
  CONSTRAINT `FK_cf40bfcc7eebd1d3e995f1062ec` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleteTime` datetime(6) DEFAULT NULL,
  `role` enum('super_admin','admin','user','guest') DEFAULT 'user',
  `status` enum('active','disabled','pending','deleted') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_51b8b26ac168fbe7d6f5653e6c` (`name`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for words
-- ----------------------------
DROP TABLE IF EXISTS `words`;
CREATE TABLE `words` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `language_id` int NOT NULL,
  `category_id` bigint NOT NULL,
  `word` varchar(255) NOT NULL,
  `transliteration` varchar(255) DEFAULT NULL,
  `us_phonetic` varchar(255) DEFAULT NULL,
  `uk_phonetic` varchar(255) DEFAULT NULL,
  `meaning` text NOT NULL,
  `example` text,
  `audio_url` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `meaningShort` text,
  PRIMARY KEY (`id`),
  KEY `FK_25045efb051717ad2b3c26b6106` (`language_id`),
  KEY `FK_e6ef47d6cff6a807b437bdc2b66` (`category_id`),
  CONSTRAINT `FK_25045efb051717ad2b3c26b6106` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`),
  CONSTRAINT `FK_e6ef47d6cff6a807b437bdc2b66` FOREIGN KEY (`category_id`) REFERENCES `corpus_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=243103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- 插入示例数据
-- ----------------------------

-- 插入语言数据
INSERT INTO `languages` (`name`, `code`, `script`, `is_active`) VALUES
('英语', 'en', 'Latin', 1),
('中文', 'zh', 'Han', 1),
('日语', 'ja', 'Hiragana', 1),
('韩语', 'ko', 'Hangul', 1),
('法语', 'fr', 'Latin', 1),
('德语', 'de', 'Latin', 1),
('西班牙语', 'es', 'Latin', 1);

-- 插入语料库分类数据
INSERT INTO `corpus_categories` (`language_id`, `name`, `description`, `difficulty`) VALUES
(1, '基础词汇', '英语基础词汇学习', 1),
(1, '日常对话', '日常英语对话练习', 2),
(1, '商务英语', '商务场景英语表达', 3),
(1, '学术英语', '学术论文和报告用词', 4),
(2, '基础汉字', '常用汉字学习', 1),
(2, '成语故事', '中国成语和故事', 3),
(3, '平假名', '日语平假名基础', 1),
(3, '片假名', '日语片假名基础', 1);

-- 插入用户数据
INSERT INTO `users` (`name`, `email`, `password`, `isActive`, `role`, `status`) VALUES
('admin', 'admin@example.com', '$2b$10$example.hash.password', 1, 'super_admin', 'active'),
('张三', 'zhangsan@example.com', '$2b$10$example.hash.password', 1, 'user', 'active'),
('李四', 'lisi@example.com', '$2b$10$example.hash.password', 1, 'user', 'active'),
('王五', 'wangwu@example.com', '$2b$10$example.hash.password', 1, 'user', 'active'),
('测试用户', 'test@example.com', '$2b$10$example.hash.password', 1, 'user', 'active');

-- 插入单词数据
INSERT INTO `words` (`language_id`, `category_id`, `word`, `transliteration`, `us_phonetic`, `uk_phonetic`, `meaning`, `example`, `meaningShort`) VALUES
(1, 1, 'hello', 'həˈloʊ', '/həˈloʊ/', '/həˈləʊ/', '你好，问候语', 'Hello, how are you today?', '你好'),
(1, 1, 'world', 'wɜːrld', '/wɜːrld/', '/wɜːld/', '世界，地球', 'The world is beautiful.', '世界'),
(1, 1, 'computer', 'kəmˈpjuːtər', '/kəmˈpjuːtər/', '/kəmˈpjuːtə/', '计算机，电脑', 'I use my computer every day.', '电脑'),
(1, 2, 'good morning', 'ɡʊd ˈmɔːrnɪŋ', '/ɡʊd ˈmɔːrnɪŋ/', '/ɡʊd ˈmɔːnɪŋ/', '早上好', 'Good morning, have a great day!', '早上好'),
(1, 2, 'thank you', 'θæŋk juː', '/θæŋk juː/', '/θæŋk juː/', '谢谢你', 'Thank you for your help.', '谢谢'),
(2, 5, '你好', 'nǐ hǎo', 'nǐ hǎo', 'nǐ hǎo', '问候语，表示友好', '你好，很高兴见到你。', '你好'),
(2, 5, '学习', 'xué xí', 'xué xí', 'xué xí', '获取知识或技能的过程', '我喜欢学习新知识。', '学习'),
(2, 5, '朋友', 'péng yǒu', 'péng yǒu', 'péng yǒu', '关系亲密的人', '他是我的好朋友。', '朋友'),
(3, 7, 'こんにちは', 'konnichiwa', 'konnichiwa', 'konnichiwa', '你好（白天问候）', 'こんにちは、元気ですか？', '你好'),
(3, 7, 'ありがとう', 'arigatou', 'arigatou', 'arigatou', '谢谢', 'ありがとうございます。', '谢谢');

-- 插入句子数据
INSERT INTO `sentences` (`language_id`, `category_id`, `sentence`, `meaning`) VALUES
(1, 2, 'Hello, how are you today?', '你好，你今天怎么样？'),
(1, 2, 'Good morning, have a great day!', '早上好，祝你今天愉快！'),
(1, 2, 'Thank you for your help.', '谢谢你的帮助。'),
(1, 2, 'Nice to meet you.', '很高兴见到你。'),
(1, 3, 'The meeting will start at 9 AM.', '会议将在上午9点开始。'),
(1, 3, 'Please send me the report by Friday.', '请在周五之前把报告发给我。'),
(2, 6, '你好，很高兴见到你。', 'Hello, nice to meet you.'),
(2, 6, '今天天气很好。', 'The weather is nice today.'),
(2, 6, '我喜欢学习中文。', 'I like learning Chinese.'),
(3, 8, 'こんにちは、元気ですか？', '你好，你好吗？'),
(3, 8, 'ありがとうございます。', '谢谢您。'),
(3, 8, 'すみません。', '对不起/打扰了。');
