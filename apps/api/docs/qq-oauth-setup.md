# QQ OAuth 配置指南

本文档介绍如何配置 QQ OAuth 登录功能。

## 1. 创建 QQ 应用

1. 访问 [QQ 互联开放平台](https://connect.qq.com/)
2. 登录你的 QQ 账号
3. 点击「应用管理」->「网站应用」->「创建应用」
4. 填写应用信息：
   - 应用名称：你的应用名称
   - 应用简介：应用描述
   - 应用网址：你的网站地址
   - 回调地址：`http://localhost:3000/auth/qq/callback`（开发环境）

## 2. 获取应用凭据

创建应用后，你将获得：
- **APP ID**：应用的唯一标识符
- **APP Key**：应用的密钥

## 3. 配置环境变量

在 `apps/api/.env.dev` 文件中添加以下配置：

```env
# QQ OAuth配置
QQ_CLIENT_ID=your-qq-app-id
QQ_CLIENT_SECRET=your-qq-app-key
QQ_CALLBACK_URL=http://localhost:3000/auth/qq/callback
```

将 `your-qq-app-id` 和 `your-qq-app-key` 替换为你从 QQ 互联获得的实际值。

## 4. 生产环境配置

在生产环境中，需要：

1. 在 QQ 互联平台添加生产环境的回调地址
2. 更新环境变量中的回调 URL
3. 确保域名已备案（如果在中国大陆部署）

## 5. API 端点

配置完成后，以下端点将可用：

- `GET /auth/qq` - QQ OAuth 登录
- `GET /auth/qq/callback` - QQ OAuth 回调处理
- `GET /auth/bind/qq` - 绑定 QQ 账户（需要 JWT 认证）
- `POST /auth/bind/qq/manual` - 手动绑定 QQ 账户（需要 JWT 认证）
- `POST /auth/unbind/qq` - 解绑 QQ 账户（需要 JWT 认证）

## 6. 前端集成示例

### 登录
```javascript
// 重定向到 QQ 登录
window.location.href = '/api/auth/qq';
```

### 绑定账户
```javascript
// 绑定 QQ 账户（需要用户已登录）
const response = await fetch('/api/auth/bind/qq', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 或手动绑定
const response = await fetch('/api/auth/bind/qq/manual', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    qqId: 'user-qq-id',
    username: 'qq-username',
    email: 'user@example.com',
    avatarUrl: 'https://avatar-url.com/avatar.jpg'
  })
});
```

### 解绑账户
```javascript
const response = await fetch('/api/auth/unbind/qq', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 注意事项

1. QQ 互联需要网站备案（如果在中国大陆部署）
2. 回调地址必须与在 QQ 互联平台配置的地址完全一致
3. 确保应用的隐私政策和用户协议符合相关法规要求
4. 妥善保管 APP Key，不要在前端代码中暴露