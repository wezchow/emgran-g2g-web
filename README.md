# G2G Web - Frontend

G2G Server 前端项目，基于 Next.js 16、React 19、TypeScript 和 Tailwind CSS 4。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **React**: React 19
- **Linting**: ESLint 9

## 项目结构

```
g2g-web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 首页
│   │   └── globals.css      # 全局样式
│   ├── components/          # React 组件
│   │   ├── ui/              # 基础 UI 组件
│   │   ├── chat/            # 聊天相关组件
│   │   └── provider/        # Provider 相关组件
│   ├── lib/                 # 工具库
│   │   ├── api.ts           # API 客户端
│   │   └── websocket.ts     # WebSocket 客户端
│   ├── hooks/               # React Hooks
│   │   └── use-websocket.ts # WebSocket Hook
│   └── types/               # TypeScript 类型定义
│       └── index.ts
├── public/                  # 静态资源
├── next.config.ts           # Next.js 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目依赖
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm start

# 代码检查
npm run lint
```

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## 功能

- ✅ Provider 列表和详情页面
- ✅ 实时聊天界面
- ✅ WebSocket 连接管理
- ✅ 会话管理
- ✅ 响应式设计

## API 端点

后端 API 基础路径: `/api/v1`

### Providers
- `GET /providers` - 获取 Provider 列表
- `GET /providers/:id` - 获取 Provider 详情
- `POST /providers/register` - 注册 Provider

### Sessions
- `POST /sessions` - 创建会话
- `GET /sessions/:id` - 获取会话详情
- `DELETE /sessions/:id` - 结束会话

### WebSocket
- `WS /ws?session_id=xxx` - WebSocket 连接

## 开发

```bash
# 启动开发服务器 (端口 3000)
npm run dev
```

## License

MIT