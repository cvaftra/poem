-- 古诗词赏析网站 MySQL 数据库表结构设计
-- 创建数据库
CREATE DATABASE IF NOT EXISTS poem_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE poem_app;

-- 1. 朝代表 (dynasties)
CREATE TABLE dynasties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '朝代名称',
    start_year INT COMMENT '起始年份',
    end_year INT COMMENT '结束年份',
    description TEXT COMMENT '朝代简介',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_dynasty_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='朝代信息表';

-- 2. 诗人表 (poets)
CREATE TABLE poets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '诗人姓名',
    pseudonym VARCHAR(100) COMMENT '字号',
    dynasty_id INT NOT NULL COMMENT '所属朝代',
    birth_year INT COMMENT '出生年份',
    death_year INT COMMENT '去世年份',
    birthplace VARCHAR(200) COMMENT '出生地',
    introduction TEXT COMMENT '诗人简介',
    style VARCHAR(100) COMMENT '诗风特点',
    honorific_title VARCHAR(100) COMMENT '尊称（如诗仙、诗圣）',
    portrait_url VARCHAR(500) COMMENT '诗人画像URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dynasty_id) REFERENCES dynasties(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_poet_name (name, dynasty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='诗人信息表';

-- 3. 诗词表 (poems) - 核心表
CREATE TABLE poems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '诗词标题',
    poet_id INT NOT NULL COMMENT '作者ID',
    dynasty_id INT NOT NULL COMMENT '创作朝代',
    content_type ENUM('诗', '词', '曲', '赋') DEFAULT '诗' COMMENT '诗词类型',
    content TEXT NOT NULL COMMENT '诗词内容（JSON格式存储每行）',
    full_content TEXT NOT NULL COMMENT '完整诗词内容',
    translation TEXT COMMENT '现代译文',
    analysis TEXT COMMENT '诗词赏析',
    background TEXT COMMENT '创作背景',
    theme VARCHAR(100) COMMENT '主题',
    rhyme_scheme VARCHAR(100) COMMENT '韵律格式',
    word_count INT COMMENT '字数',
    line_count INT COMMENT '行数',
    difficulty_level ENUM('简单', '中等', '困难') DEFAULT '中等' COMMENT '难度等级',
    popularity_score INT DEFAULT 0 COMMENT '受欢迎度评分',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    favorite_count INT DEFAULT 0 COMMENT '收藏次数',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '是否精选',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (poet_id) REFERENCES poets(id) ON DELETE RESTRICT,
    FOREIGN KEY (dynasty_id) REFERENCES dynasties(id) ON DELETE RESTRICT,
    INDEX idx_poet_dynasty (poet_id, dynasty_id),
    INDEX idx_title (title),
    INDEX idx_featured (is_featured),
    INDEX idx_popularity (popularity_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='诗词信息表';

-- 4. 标签表 (tags)
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    category VARCHAR(50) COMMENT '标签分类',
    description TEXT COMMENT '标签描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tag_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- 5. 诗词标签关联表 (poem_tags)
CREATE TABLE poem_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poem_id INT NOT NULL COMMENT '诗词ID',
    tag_id INT NOT NULL COMMENT '标签ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY uk_poem_tag (poem_id, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='诗词标签关联表';

-- 6. 用户表 (users)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    email VARCHAR(100) NOT NULL COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    bio TEXT COMMENT '个人简介',
    role ENUM('admin', 'user') DEFAULT 'user' COMMENT '用户角色',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_username (username),
    UNIQUE KEY uk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 7. 用户收藏表 (user_favorites)
CREATE TABLE user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '用户ID',
    poem_id INT NOT NULL COMMENT '诗词ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_poem (user_id, poem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户收藏表';

-- 8. 评论表 (comments)
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '用户ID',
    poem_id INT NOT NULL COMMENT '诗词ID',
    parent_id INT DEFAULT NULL COMMENT '父评论ID（用于回复）',
    content TEXT NOT NULL COMMENT '评论内容',
    rating TINYINT CHECK (rating >= 1 AND rating <= 5) COMMENT '评分（1-5星）',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    is_approved BOOLEAN DEFAULT TRUE COMMENT '是否审核通过',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_poem_created (poem_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 9. 浏览历史表 (view_history)
CREATE TABLE view_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '用户ID',
    poem_id INT NOT NULL COMMENT '诗词ID',
    view_count INT DEFAULT 1 COMMENT '浏览次数',
    last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '最后浏览时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_poem (user_id, poem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='浏览历史表';

-- 插入示例数据
-- 插入朝代数据
INSERT INTO dynasties (name, start_year, end_year, description) VALUES
('唐代', 618, 907, '唐朝是中国历史上最强盛的朝代之一，诗歌创作达到顶峰'),
('宋代', 960, 1279, '宋朝文化繁荣，词作达到高峰'),
('元代', 1271, 1368, '元朝戏曲发展，散曲盛行'),
('明代', 1368, 1644, '明朝小说兴起，诗歌继续发展'),
('清代', 1644, 1912, '清朝诗词创作丰富，流派众多');

-- 插入诗人数据
INSERT INTO poets (name, pseudonym, dynasty_id, birth_year, death_year, birthplace, introduction, style, honorific_title) VALUES
('李白', '太白', 1, 701, 762, '西域碎叶城', '唐代伟大的浪漫主义诗人，被后人誉为「诗仙」', '浪漫豪放', '诗仙'),
('杜甫', '子美', 1, 712, 770, '河南巩县', '唐代伟大的现实主义诗人，被后人誉为「诗圣」', '沉郁顿挫', '诗圣'),
('孟浩然', NULL, 1, 689, 740, '湖北襄阳', '唐代山水田园诗派代表诗人', '清新自然', NULL),
('王之涣', NULL, 1, 688, 742, '山西太原', '唐代边塞诗派代表诗人', '雄浑豪放', NULL),
('王维', '摩诘', 1, 701, 761, '山西祁县', '唐代山水田园诗派代表，诗佛', '空灵禅意', '诗佛'),
('苏轼', '子瞻', 2, 1037, 1101, '四川眉山', '北宋文学家、书画家，豪放派词人代表', '豪放洒脱', '东坡居士'),
('李清照', '易安', 2, 1084, 1155, '山东济南', '宋代女词人，婉约派代表', '婉约细腻', '易安居士');

-- 插入标签数据
INSERT INTO tags (name, category, description) VALUES
('思乡', '主题', '表达对故乡的思念之情'),
('月亮', '意象', '以月亮为意象的诗词'),
('春天', '季节', '描写春天景色的诗词'),
('自然', '主题', '描写自然风光的诗词'),
('爱情', '主题', '表达爱情情感的诗词'),
('边塞', '题材', '描写边塞生活和战争的诗词'),
('山水', '题材', '描写山水风景的诗词'),
('豪放', '风格', '豪放派诗词风格'),
('婉约', '风格', '婉约派诗词风格'),
('田园', '题材', '描写田园生活的诗词');

COMMIT;