# 咔西咔西 Admin 管理后台

这是一个基于 React + TypeScript + Ant Design 构建的现代化管理后台系统，用于管理 Typing 应用的各项功能。

## 功能特性

### 🏠 仪表板

- 系统概览统计
- 用户数量统计
- 语言和分类统计
- 错误报告统计
- 最近注册用户展示
- 系统状态监控

### 👥 用户管理

- 用户列表查看
- 用户创建
- 用户信息编辑
- 用户删除
- 用户搜索和筛选
- 分页显示

### 🌍 语言管理

- 语言列表管理
- 新增语言
- 语言状态控制（启用/禁用）
- 语言删除
- 语言搜索

### 📚 语料库分类管理

- 分类列表管理
- 新增分类
- 分类统计信息
- 按语言和难度筛选
- 分类删除

### 📝 单词管理

- 单词列表管理
- 新增单词
- 单词搜索和筛选
- 按语言和分类筛选
- 单词删除
- 语音播放功能（待实现）

### 📄 句子管理

- 句子列表管理
- 新增句子
- 句子搜索和筛选
- 按语言和分类筛选
- 句子删除

### 🐛 错误报告管理

- 错误报告列表
- 报告状态管理
- 报告详情查看
- 按状态筛选
- 报告删除
- 统计信息展示

## 技术栈

- **前端框架**: React 19
- **开发语言**: TypeScript
- **UI 组件库**: Ant Design 5
- **路由管理**: React Router DOM 6
- **状态管理**: React Context + Hooks
- **HTTP 客户端**: Alova
- **构建工具**: Vite
- **代码规范**: ESLint

## 项目结构

```
src/
├── components/          # 公共组件
│   └── Layout/         # 布局组件
├── hooks/              # 自定义 Hooks
│   └── useAuth.ts      # 认证相关 Hook
├── pages/              # 页面组件
│   ├── Login/          # 登录页面
│   ├── Dashboard/      # 仪表板
│   ├── UserManagement/        # 用户管理
│   ├── LanguageManagement/    # 语言管理
│   ├── CorpusCategoryManagement/ # 语料库分类管理
│   ├── WordManagement/        # 单词管理
│   ├── SentenceManagement/   # 句子管理
│   └── ErrorReportManagement/ # 错误报告管理
├── apis/               # API 接口
│   └── index.ts       # API 封装
├── request/            # 请求配置
│   ├── apiDefinitions.ts
│   ├── createApis.ts
│   └── globals.d.ts
├── App.tsx            # 主应用组件
├── main.tsx          # 应用入口
└── index.css         # 全局样式
```

## 安装和运行

### 1. 安装依赖

```bash
cd apps/admin
npm install
# 或
pnpm install
```

### 2. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

访问 http://localhost:5173 查看应用。

### 3. 构建生产版本

```bash
npm run build
# 或
pnpm build
```

## 使用说明

### 登录系统

1. 访问管理后台首页
2. 使用管理员账号登录
3. 登录成功后自动跳转到仪表板

### 功能导航

- 使用左侧导航菜单切换不同功能模块
- 每个模块都有独立的页面和功能
- 支持响应式设计，适配移动端

### 数据操作

- 所有列表页面都支持搜索和筛选
- 支持分页浏览大量数据
- 提供创建、编辑、删除等基本操作
- 操作结果有明确的成功/失败提示

## API 接口

管理后台使用 Alova 作为 HTTP 客户端，所有 API 接口都在 `src/apis/index.ts` 中定义。

主要接口包括：

- 认证相关：登录、获取用户信息
- 用户管理：CRUD 操作
- 语言管理：CRUD 操作
- 语料库分类：CRUD 操作
- 单词管理：CRUD 操作
- 句子管理：CRUD 操作
- 错误报告：查看、删除、统计

## 开发规范

### 代码风格

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 组件使用函数式组件 + Hooks
- 使用 Ant Design 组件库保持 UI 一致性

### 文件命名

- 组件文件使用 PascalCase
- Hook 文件使用 camelCase
- 工具文件使用 camelCase
- 常量文件使用 UPPER_SNAKE_CASE

### 组件结构

```tsx
import React, { useState, useEffect } from 'react';
import { ComponentProps } from './types';

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // 副作用逻辑
  }, []);

  // Handlers
  const handleAction = () => {
    // 处理逻辑
  };

  // Render
  return <div>{/* JSX 内容 */}</div>;
};

export default Component;
```

## 部署说明

### 环境要求

- Node.js 18+
- 现代浏览器支持

### 部署步骤

1. 构建生产版本：`npm run build`
2. 将 `dist` 目录部署到 Web 服务器
3. 配置服务器支持 SPA 路由
4. 确保 API 服务器正常运行

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    root /path/to/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-api-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 常见问题

### Q: 登录后页面空白？

A: 检查 API 服务器是否正常运行，确认网络请求是否成功。

### Q: 某些功能无法使用？

A: 检查用户权限，某些功能需要管理员权限。

### Q: 数据加载缓慢？

A: 检查网络连接和 API 服务器性能，考虑增加分页大小。

### Q: 移动端显示异常？

A: 管理后台主要针对桌面端设计，移动端可能显示不完整。

## 更新日志

### v1.0.0 (2024-01-01)

- 初始版本发布
- 实现基础管理功能
- 支持用户、语言、分类、单词、句子、错误报告管理
- 响应式设计支持

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
