# 古诗词赏析网站 MySQL 数据库指南

## 数据库概述
本数据库为古诗词赏析网站设计，包含诗词、诗人、朝代、用户等核心数据表，支持完整的诗词展示、搜索、收藏、评论功能。

## 表结构设计

### 核心表说明

1. **dynasties（朝代表）**
   - 存储历代朝代信息
   - 包含起始年份、简介等字段

2. **poets（诗人表）**
   - 存储诗人基本信息
   - 包含字号、生平、诗风特点等

3. **poems（诗词表）** - 核心表
   - 存储诗词内容、赏析、背景等
   - 支持诗词类型分类（诗、词、曲、赋）

4. **tags（标签表）**
   - 诗词标签分类管理
   - 支持主题、风格、题材等多维度标签

5. **users（用户表）**
   - 用户账户管理
   - 支持用户角色权限

6. **关联表**
   - poem_tags：诗词标签关联
   - user_favorites：用户收藏
   - comments：评论系统
   - view_history：浏览历史

## 部署步骤

### 1. 创建数据库
```sql
mysql -u root -p < database_schema.sql
```

### 2. 导入示例数据
```sql
mysql -u root -p < sample_data.sql
```

### 3. 验证数据
```sql
USE poem_app;
-- 查看诗词统计
SELECT COUNT(*) as poem_count FROM poems;

-- 查看诗人作品数量
SELECT p.name, COUNT(po.id) as poem_count 
FROM poets p LEFT JOIN poems po ON p.id = po.poet_id 
GROUP BY p.id ORDER BY poem_count DESC;
```

## 常用查询示例

### 1. 查询指定诗人的所有诗词
```sql
SELECT po.title, po.content_type, d.name as dynasty
FROM poems po
JOIN poets p ON po.poet_id = p.id
JOIN dynasties d ON po.dynasty_id = d.id
WHERE p.name = '李白'
ORDER BY po.created_at DESC;
```

### 2. 按标签搜索诗词
```sql
SELECT po.title, p.name as author, t.name as tag
FROM poems po
JOIN poets p ON po.poet_id = p.id
JOIN poem_tags pt ON po.id = pt.poem_id
JOIN tags t ON pt.tag_id = t.id
WHERE t.name = '思乡'
ORDER BY po.popularity_score DESC;
```

### 3. 热门诗词排行
```sql
SELECT po.title, p.name as author, po.view_count, po.favorite_count
FROM poems po
JOIN poets p ON po.poet_id = p.id
WHERE po.is_featured = TRUE
ORDER BY po.popularity_score DESC
LIMIT 10;
```

### 4. 用户收藏统计
```sql
SELECT u.username, COUNT(uf.poem_id) as favorite_count
FROM users u
LEFT JOIN user_favorites uf ON u.id = uf.user_id
GROUP BY u.id
ORDER BY favorite_count DESC;
```

## 与前端集成

### Supabase 连接配置
项目已配置 Supabase 客户端，可通过以下方式访问数据库：

```javascript
import { getSupabaseClient } from '@/utils/supabase';

// 查询诗词列表
const { data: poems, error } = await supabase
  .from('poems')
  .select(`
    id,
    title,
    content_type,
    content,
    poets (name, dynasty_id),
    dynasties (name)
  `)
  .order('created_at', { ascending: false })
  .limit(10);
```

### API 接口设计建议
1. **诗词列表接口**：支持分页、筛选、排序
2. **诗词详情接口**：返回完整诗词信息和关联数据
3. **搜索接口**：支持标题、作者、标签搜索
4. **用户接口**：收藏、评论、浏览历史

## 数据维护

### 定期备份
```bash
mysqldump -u root -p poem_app > poem_app_backup_$(date +%Y%m%d).sql
```

### 数据优化
- 定期清理无效用户数据
- 更新诗词热度评分
- 优化索引性能

## 扩展建议

1. **诗词推荐系统**：基于用户行为推荐相关诗词
2. **智能搜索**：支持语义搜索和相似度匹配
3. **数据分析**：用户行为分析和诗词热度分析
4. **多语言支持**：扩展国际化字段

## 注意事项

1. **字符编码**：使用 utf8mb4 支持完整中文和特殊字符
2. **性能优化**：对大文本字段建立合适索引
3. **安全考虑**：用户密码使用哈希存储，防止SQL注入
4. **数据一致性**：使用外键约束保证数据完整性