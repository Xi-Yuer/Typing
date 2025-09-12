# 错词记录 API 使用指南

## 概述

错词记录API提供了完整的错词管理功能，支持记录用户拼打单词时的错误，并提供分类管理和练习功能。

## API 设计理念

API设计遵循"先查询分类，再获取错词集"的流程：

1. **第一步**：获取用户有错词的分类列表
2. **第二步**：选择特定分类，获取该分类下的错词记录
3. **第三步**：进行错词练习和管理

## 核心API接口

### 1. 记录单词错误

**POST** `/word-error-records`

记录用户拼打单词时的错误。

```json
{
  "wordId": "1",
  "categoryId": "1",
  "languageId": "1"
}
```

**响应示例：**

```json
{
  "id": "1",
  "userId": "1",
  "wordId": "1",
  "categoryId": "1",
  "languageId": "1",
  "errorCount": 1,
  "lastErrorTime": "2024-01-01T00:00:00Z",
  "firstErrorTime": "2024-01-01T00:00:00Z",
  "isPracticed": false,
  "practiceCount": 0,
  "word": {
    "id": "1",
    "word": "hello",
    "meaning": "你好"
  },
  "category": {
    "id": "1",
    "name": "日常会话",
    "difficulty": 1
  }
}
```

### 2. 获取有错词的分类列表

**GET** `/word-error-records/categories`

获取用户有错词的分类列表，按错误次数降序排列。

**响应示例：**

```json
[
  {
    "categoryId": "1",
    "categoryName": "日常会话",
    "categoryDescription": "日常生活中的常用对话",
    "difficulty": 1,
    "languageId": "1",
    "languageName": "英语",
    "errorCount": 15,
    "wordCount": 8,
    "unPracticedCount": 5
  },
  {
    "categoryId": "2",
    "categoryName": "商务英语",
    "categoryDescription": "商务场合使用的英语",
    "difficulty": 3,
    "languageId": "1",
    "languageName": "英语",
    "errorCount": 8,
    "wordCount": 4,
    "unPracticedCount": 2
  }
]
```

### 3. 按分类获取错词记录

**GET** `/word-error-records/category/{categoryId}`

获取指定分类下的所有错词记录。

**查询参数：**

- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）
- `isPracticed`: 是否已练习（可选）
- `sortBy`: 排序字段（默认lastErrorTime）
- `sortOrder`: 排序方向（ASC/DESC，默认DESC）

**响应示例：**

```json
{
  "list": [
    {
      "id": "1",
      "userId": "1",
      "wordId": "1",
      "categoryId": "1",
      "languageId": "1",
      "errorCount": 3,
      "lastErrorTime": "2024-01-01T00:00:00Z",
      "firstErrorTime": "2024-01-01T00:00:00Z",
      "isPracticed": false,
      "practiceCount": 0,
      "word": {
        "id": "1",
        "word": "hello",
        "meaning": "你好"
      },
      "category": {
        "id": "1",
        "name": "日常会话"
      }
    }
  ],
  "total": 8,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### 4. 获取未练习的错词（练习模式）

**GET** `/word-error-records/unpracticed`

获取未练习的错词记录，用于练习模式。

**查询参数：**

- `categoryId`: 分类ID（可选，不传则获取所有分类）
- `limit`: 限制数量（默认20）

**响应示例：**

```json
[
  {
    "id": "1",
    "userId": "1",
    "wordId": "1",
    "categoryId": "1",
    "languageId": "1",
    "errorCount": 3,
    "lastErrorTime": "2024-01-01T00:00:00Z",
    "firstErrorTime": "2024-01-01T00:00:00Z",
    "isPracticed": false,
    "practiceCount": 0,
    "word": {
      "id": "1",
      "word": "hello",
      "meaning": "你好"
    },
    "category": {
      "id": "1",
      "name": "日常会话"
    }
  }
]
```

### 5. 标记错词为已练习

**PATCH** `/word-error-records/{wordId}/practice`

标记指定错词为已练习，练习次数+1。

**响应示例：**

```json
{
  "id": "1",
  "userId": "1",
  "wordId": "1",
  "categoryId": "1",
  "languageId": "1",
  "errorCount": 3,
  "lastErrorTime": "2024-01-01T00:00:00Z",
  "firstErrorTime": "2024-01-01T00:00:00Z",
  "isPracticed": true,
  "practiceCount": 1,
  "lastPracticeTime": "2024-01-01T12:00:00Z",
  "word": {
    "id": "1",
    "word": "hello",
    "meaning": "你好"
  },
  "category": {
    "id": "1",
    "name": "日常会话"
  }
}
```

### 6. 获取错词统计信息

**GET** `/word-error-records/statistics`

获取用户的错词统计信息。

**响应示例：**

```json
{
  "totalErrors": 23,
  "categoryStats": [
    {
      "categoryId": "1",
      "categoryName": "日常会话",
      "errorCount": 15,
      "wordCount": 8
    }
  ],
  "languageStats": [
    {
      "languageId": "1",
      "languageName": "英语",
      "errorCount": 23,
      "wordCount": 12
    }
  ]
}
```

### 7. 删除错词记录

**DELETE** `/word-error-records/{wordId}`

删除指定的错词记录。

**DELETE** `/word-error-records/batch`

批量删除错词记录。

```json
{
  "wordIds": ["1", "2", "3"]
}
```

## 使用流程示例

### 典型使用流程

1. **用户拼打单词出错时**：

   ```javascript
   // 记录错误
   POST /word-error-records
   {
     "wordId": "123",
     "categoryId": "1",
     "languageId": "1"
   }
   ```

2. **用户查看错词分类时**：

   ```javascript
   // 获取有错词的分类列表
   GET / word - error - records / categories;
   ```

3. **用户选择分类查看错词时**：

   ```javascript
   // 获取分类下的错词记录
   GET /word-error-records/category/1?page=1&pageSize=20
   ```

4. **用户开始练习错词时**：

   ```javascript
   // 获取未练习的错词
   GET /word-error-records/unpracticed?categoryId=1&limit=10
   ```

5. **用户完成练习时**：
   ```javascript
   // 标记为已练习
   PATCH / word - error - records / 123 / practice;
   ```

## 数据模型

### WordErrorRecord 实体

```typescript
{
  id: string;                    // 错词记录ID
  userId: string;                 // 用户ID
  wordId: string;                 // 单词ID
  categoryId: string;             // 分类ID
  languageId: string;             // 语言ID
  errorCount: number;             // 错误次数
  lastErrorTime: Date;            // 最后错误时间
  firstErrorTime: Date;           // 首次错误时间
  isPracticed: boolean;           // 是否已练习
  practiceCount: number;          // 练习次数
  lastPracticeTime?: Date;        // 最后练习时间
  createdAt: Date;               // 创建时间
  updatedAt: Date;                // 更新时间
  word: Word;                     // 关联的单词信息
  category: CorpusCategory;       // 关联的分类信息
}
```

## 注意事项

1. **唯一性约束**：每个用户对每个单词只能有一条错词记录
2. **自动计数**：重复记录同一单词错误时，错误次数会自动递增
3. **关联数据**：API返回的数据包含完整的单词和分类信息
4. **分页支持**：列表查询支持分页，避免数据量过大
5. **排序优化**：默认按错误次数和最后错误时间排序，优先显示错误频率高的单词

## 错误处理

- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权访问
- `404 Not Found`: 单词、分类或错词记录不存在
- `500 Internal Server Error`: 服务器内部错误
