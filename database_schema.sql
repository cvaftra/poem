-- 古诗词赏析网站数据库表结构设计
-- 创建数据库（如果已存在则删除重建）
-- 注意：以下为通用SQL语法，请根据实际数据库类型调整
-- DROP DATABASE IF EXISTS poem_app;
-- CREATE DATABASE poem_app;
-- USE poem_app;

-- 创建数据库连接后，请确保使用正确的数据库

-- 1. 朝代表 (dynasties)
CREATE TABLE dynasties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    start_year INT,
    end_year INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name)
);

-- 2. 诗人表 (poets)
CREATE TABLE poets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    pseudonym VARCHAR(100),
    dynasty_id INT NOT NULL,
    birth_year INT,
    death_year INT,
    birthplace VARCHAR(200),
    introduction TEXT,
    style VARCHAR(100),
    honorific_title VARCHAR(100),
    portrait_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dynasty_id) REFERENCES dynasties(id),
    UNIQUE (name, dynasty_id)
);

-- 3. 诗词表 (poems) - 核心表
CREATE TABLE poems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    poet_id INT NOT NULL,
    dynasty_id INT NOT NULL,
    content_type VARCHAR(10) DEFAULT '诗' CHECK (content_type IN ('诗', '词', '曲', '赋')),
    content TEXT NOT NULL,
    full_content TEXT NOT NULL,
    translation TEXT,
    analysis TEXT,
    background TEXT,
    theme VARCHAR(100),
    rhyme_scheme VARCHAR(100),
    word_count INT,
    line_count INT,
    difficulty_level VARCHAR(10) DEFAULT '中等' CHECK (difficulty_level IN ('简单', '中等', '困难')),
    popularity_score INT DEFAULT 0,
    view_count INT DEFAULT 0,
    favorite_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poet_id) REFERENCES poets(id),
    FOREIGN KEY (dynasty_id) REFERENCES dynasties(id)
);

-- 为诗词表创建索引
CREATE INDEX idx_poems_poet_dynasty ON poems(poet_id, dynasty_id);
CREATE INDEX idx_poems_title ON poems(title);
CREATE INDEX idx_poems_featured ON poems(is_featured);
CREATE INDEX idx_poems_popularity ON poems(popularity_score);

-- 4. 标签表 (tags)
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name)
);

-- 5. 诗词标签关联表 (poem_tags)
CREATE TABLE poem_tags (
    id SERIAL PRIMARY KEY,
    poem_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE (poem_id, tag_id)
);

-- 6. 用户表 (users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (username),
    UNIQUE (email)
);

-- 7. 用户收藏表 (user_favorites)
CREATE TABLE user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    poem_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
    UNIQUE (user_id, poem_id)
);

-- 8. 评论表 (comments)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    poem_id INT NOT NULL,
    parent_id INT DEFAULT NULL,
    content TEXT NOT NULL,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    like_count INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 为评论表创建索引
CREATE INDEX idx_comments_poem_created ON comments(poem_id, created_at);

-- 9. 浏览历史表 (view_history)
CREATE TABLE view_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    poem_id INT NOT NULL,
    view_count INT DEFAULT 1,
    last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
    UNIQUE (user_id, poem_id)
);

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
('白居易', '乐天', 1, 772, 846, '河南新郑', '唐代现实主义诗人，新乐府运动倡导者', '通俗易懂', '诗魔'),
('李商隐', '义山', 1, 813, 858, '河南沁阳', '唐代著名诗人，擅长七律和七绝', '婉约含蓄', NULL),
('杜牧', '牧之', 1, 803, 852, '陕西西安', '唐代诗人，与李商隐并称「小李杜」', '豪放俊爽', NULL),
('苏轼', '子瞻', 2, 1037, 1101, '四川眉山', '北宋文学家、书画家，豪放派词人代表', '豪放洒脱', '东坡居士'),
('李清照', '易安', 2, 1084, 1155, '山东济南', '宋代女词人，婉约派代表', '婉约细腻', '易安居士'),
('辛弃疾', '幼安', 2, 1140, 1207, '山东济南', '南宋豪放派词人，爱国诗人', '豪放悲壮', '稼轩居士'),
('陆游', '务观', 2, 1125, 1210, '浙江绍兴', '南宋爱国诗人，诗作数量极多', '豪放沉郁', '放翁'),
('柳永', '耆卿', 2, 984, 1053, '福建崇安', '北宋著名词人，婉约派代表人物', '婉约缠绵', NULL),
('晏殊', '同叔', 2, 991, 1055, '江西抚州', '北宋著名词人，婉约派代表', '婉约清新', NULL),
('李煜', '重光', 2, 937, 978, '江苏徐州', '南唐后主，著名词人', '哀婉动人', '李后主'),
('纳兰性德', '容若', 5, 1655, 1685, '北京', '清代著名词人，满洲正黄旗人', '婉约凄美', NULL),
('龚自珍', '璱人', 5, 1792, 1841, '浙江杭州', '清代思想家、文学家', '豪放深沉', NULL);

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
('田园', '题材', '描写田园生活的诗词'),
('秋天', '季节', '描写秋天景色的诗词'),
('冬天', '季节', '描写冬天景色的诗词'),
('夏天', '季节', '描写夏天景色的诗词'),
('离别', '主题', '表达离别情感的诗词'),
('怀古', '主题', '怀念古代人事的诗词'),
('爱国', '主题', '表达爱国情怀的诗词'),
('饮酒', '题材', '描写饮酒的诗词'),
('忧愁', '情感', '表达忧愁情感的诗词'),
('欢乐', '情感', '表达欢乐情感的诗词'),
('哲理', '主题', '蕴含哲理的诗词');

COMMIT;