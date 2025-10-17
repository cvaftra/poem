-- 古诗词赏析网站数据库测试脚本
-- 测试数据库连接和表结构

-- 1. 测试数据库连接
SELECT '数据库连接测试:' AS test_step;
SELECT CURRENT_TIMESTAMP AS current_time;

-- 2. 检查表是否存在
SELECT '检查表结构:' AS test_step;
-- 注意：以下查询需要根据实际数据库系统调整
-- SELECT table_name, table_type, table_schema 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public'  -- PostgreSQL使用public schema
-- ORDER BY table_name;

-- 3. 检查各表数据量
SELECT '检查数据量:' AS test_step;
-- 分别查询每个表的数据量
SELECT 'dynasties' as table_name, COUNT(*) as record_count FROM dynasties;
SELECT 'poets' as table_name, COUNT(*) as record_count FROM poets;
SELECT 'poems' as table_name, COUNT(*) as record_count FROM poems;
SELECT 'tags' as table_name, COUNT(*) as record_count FROM tags;
SELECT 'poem_tags' as table_name, COUNT(*) as record_count FROM poem_tags;
SELECT 'users' as table_name, COUNT(*) as record_count FROM users;
SELECT 'user_favorites' as table_name, COUNT(*) as record_count FROM user_favorites;
SELECT 'comments' as table_name, COUNT(*) as record_count FROM comments;
SELECT 'view_history' as table_name, COUNT(*) as record_count FROM view_history;

-- 4. 测试诗词查询
SELECT '测试诗词查询:' AS test_step;
SELECT 
    p.title AS 诗词标题,
    pt.name AS 诗人,
    d.name AS 朝代,
    p.content_type AS 类型,
    p.difficulty_level AS 难度
FROM poems p
JOIN poets pt ON p.poet_id = pt.id
JOIN dynasties d ON p.dynasty_id = d.id
LIMIT 5;

-- 5. 测试标签关联查询
SELECT '测试标签关联:' AS test_step;
SELECT 
    p.title AS 诗词标题,
    pt.name AS 诗人,
    GROUP_CONCAT(t.name) AS 标签
FROM poems p
JOIN poets pt ON p.poet_id = pt.id
JOIN poem_tags ptg ON p.id = ptg.poem_id
JOIN tags t ON ptg.tag_id = t.id
GROUP BY p.id, p.title, pt.name
LIMIT 5;

-- 6. 测试外键约束
SELECT '测试外键约束:' AS test_step;
-- 注意：外键约束查询需要根据实际数据库系统调整
-- SELECT 
--     constraint_name,
--     table_name,
--     column_name,
--     referenced_table_name,
--     referenced_column_name
-- FROM information_schema.key_column_usage
-- WHERE referenced_table_name IS NOT NULL;

-- 7. 测试索引
SELECT '检查索引:' AS test_step;
-- 注意：索引查询需要根据实际数据库系统调整
-- SELECT 
--     tablename as table_name,
--     indexname as index_name,
--     indexdef as index_definition
-- FROM pg_indexes  -- PostgreSQL索引查询
-- WHERE schemaname = 'public';

-- 8. 测试完整功能
SELECT '完整功能测试:' AS test_step;

-- 8.1 热门诗词排行
SELECT '热门诗词排行:' AS test_type;
SELECT 
    p.title AS 标题,
    pt.name AS 作者,
    d.name AS 朝代,
    p.view_count AS 浏览量,
    p.favorite_count AS 收藏数
FROM poems p
JOIN poets pt ON p.poet_id = pt.id
JOIN dynasties d ON p.dynasty_id = d.id
ORDER BY p.popularity_score DESC
LIMIT 3;

-- 8.2 诗人作品统计
SELECT '诗人作品统计:' AS test_type;
SELECT 
    pt.name AS 诗人,
    d.name AS 朝代,
    COUNT(p.id) AS 作品数量
FROM poets pt
JOIN dynasties d ON pt.dynasty_id = d.id
LEFT JOIN poems p ON pt.id = p.poet_id
GROUP BY pt.id, pt.name, d.name
ORDER BY 作品数量 DESC;

-- 9. 测试完成
SELECT '数据库测试完成!' AS final_result;