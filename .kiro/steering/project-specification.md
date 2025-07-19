# Tiny Room 项目完整规范文档

## 🎯 项目概述

### 项目定位

- **现代个人网站**：集展示、管理、分析于一体的综合性平台
- **生产级应用**：可实际部署使用的真实项目，非演示代码
- **长期维护**：架构设计考虑扩展性和可维护性
- **模块化设计**：方便后期新增功能板块

### 核心价值主张

- 将 Obsidian、GitHub、本地资源整合到统一平台
- 提供专业级的内容管理和数据分析功能
- 展现个人技术实力和创作能力

## 🛠️ 技术栈规范

### 前端技术栈

```typescript
{
  核心框架: "Next.js 15 (App Router)",
  开发语言: "TypeScript (strict模式)",
  样式方案: "Tailwind CSS + Framer Motion",
  组件库: "Headless UI + 自定义UI组件系统",
  状态管理: "Zustand (按需使用)",
  图标系统: "Lucide React",
  包管理器: "pnpm",
  工程化: "ESLint + Prettier + PostCSS"
}
```

### 后端与数据

```typescript
{
  API架构: "Next.js API Routes (RESTful)",
  数据库: "SQLite (开发) / PostgreSQL (生产)",
  文件存储: "开发阶段Vercel本地，生产阶段Cloudflare R2",
  认证方案: "NextAuth.js v5",
  外部集成: "GitHub API + Obsidian文件系统",
  部署平台: "Vercel",
  搜索功能: "PostgreSQL全文搜索"
}
```

### 开发环境设置规范

```typescript
开发环境要求: {
  Node.js版本: ">=18.0.0",
  包管理器: "pnpm (推荐)",
  IDE配置: "VS Code + 推荐插件：TypeScript、Tailwind CSS、Prettier、ESLint",
  本地服务: "PostgreSQL (开发数据库)",
  调试配置: "VS Code debug配置，浏览器开发者工具",
  开发服务器: "Next.js dev server，热更新，HTTPS本地开发"
}
```

## 📁 路由架构规范

### Next.js App Router 文件系统路由

采用 **Next.js 15 App Router** 的标准文件系统路由，通过路由组实现功能模块的清晰分离。

#### 完整路由结构

```bash
src/app/
├── layout.tsx                 # 根布局
├── page.tsx                   # 首页 "/"
├── globals.css                # 全局样式
│
├── (public)/                  # 🌐 公开访问路由组
│   ├── blog/
│   │   ├── page.tsx          # /blog
│   │   ├── [slug]/
│   │   │   └── page.tsx      # /blog/[slug]
│   │   └── layout.tsx        # 博客布局
│   ├── projects/
│   │   ├── page.tsx          # /projects
│   │   ├── [id]/
│   │   │   └── page.tsx      # /projects/[id]
│   │   └── layout.tsx        # 项目布局
│   └── gallery/
│       ├── page.tsx          # /gallery
│       ├── [category]/
│       │   └── page.tsx      # /gallery/[category]
│       └── layout.tsx        # 画廊布局
│
├── (admin)/                   # 🔐 管理员路由组
│   └── dashboard/
│       ├── page.tsx          # /dashboard
│       ├── layout.tsx        # 管理后台布局
│       ├── blog/
│       │   └── page.tsx      # /dashboard/blog
│       ├── projects/
│       │   └── page.tsx      # /dashboard/projects
│       ├── gallery/
│       │   └── page.tsx      # /dashboard/gallery
│       └── settings/
│           └── page.tsx      # /dashboard/settings
│
└── (dev)/                     # 🛠️ 开发展示路由组
    └── ui-showcase/
        ├── page.tsx          # /ui-showcase (总览导航)
        ├── layout.tsx        # UI展示布局
        ├── components/
        │   └── page.tsx      # /ui-showcase/components
        ├── animations/
        │   └── page.tsx      # /ui-showcase/animations
        └── typography/
            └── page.tsx      # /ui-showcase/typography
```

#### 路由组功能分离

```typescript
路由组设计原则: {
  "(public)": {
    描述: "面向访客的公开内容",
    URL路径: "/blog, /projects, /gallery",
    功能特点: "SEO优化、缓存策略、社交分享",
    权限控制: "完全公开，无需认证"
  },

  "(admin)": {
    描述: "管理员功能和后台管理",
    URL路径: "/dashboard/*",
    功能特点: "内容管理、数据分析、系统配置",
    权限控制: "需要身份验证，管理员权限"
  },

  "(dev)": {
    描述: "开发工具和组件展示",
    URL路径: "/ui-showcase/*",
    功能特点: "组件库展示、设计系统、开发工具",
    权限控制: "开发环境可见，生产环境可选择隐藏"
  }
}
```

#### 生成的 URL 结构

```typescript
URL映射表: {
  // 公开页面
  首页: "/",
  博客首页: "/blog",
  博客文章: "/blog/[slug]",
  项目首页: "/projects",
  项目详情: "/projects/[id]",
  画廊首页: "/gallery",
  画廊分类: "/gallery/[category]",

  // 管理后台
  仪表板: "/dashboard",
  博客管理: "/dashboard/blog",
  项目管理: "/dashboard/projects",
  画廊管理: "/dashboard/gallery",
  系统设置: "/dashboard/settings",

  // 开发展示
  UI展示首页: "/ui-showcase",
  组件展示: "/ui-showcase/components",
  动画效果: "/ui-showcase/animations",
  字体系统: "/ui-showcase/typography"
}
```

#### 布局继承策略

```typescript
布局层次结构: {
  全局布局: "src/app/layout.tsx - 根布局，包含<html>、<body>、全局样式",

  路由组布局: {
    公开页面: "(public)/**/layout.tsx - 公开页面的通用导航、页脚",
    管理后台: "(admin)/dashboard/layout.tsx - 后台侧边栏、导航、权限检查",
    开发展示: "(dev)/ui-showcase/layout.tsx - 开发工具导航、代码展示"
  },

  功能模块布局: {
    博客布局: "blog/layout.tsx - 博客专用导航、面包屑、侧边栏",
    项目布局: "projects/layout.tsx - 项目筛选、排序、搜索",
    画廊布局: "gallery/layout.tsx - 画廊导航、分类过滤"
  }
}
```

#### 路由配置最佳实践

```typescript
路由设计原则: {
  职责分离: "每个路由组承担明确的功能职责",
  URL语义化: "路径直观反映页面内容和层级关系",
  SEO友好: "清晰的URL结构，利于搜索引擎索引",
  可扩展性: "新增功能模块时，遵循现有路由组模式",

  文件命名约定: {
    页面文件: "page.tsx - 路由页面入口",
    布局文件: "layout.tsx - 共享布局组件",
    加载状态: "loading.tsx - 页面加载状态",
    错误处理: "error.tsx - 错误边界处理",
    非路由文件: "_components/ - 下划线前缀，私有组件"
  },

  权限控制集成: {
    公开路由: "无需身份验证，SEO优化",
    保护路由: "在layout.tsx中集成身份验证检查",
    角色权限: "基于用户角色的页面访问控制"
  }
}
```

## 🎨 设计系统规范

### 视觉风格

- **设计灵感**：Vercel 官网的整体感觉和质感
- **主色调**：高质量灰度系统（从纯白到深黑的精细渐进）
- **强调色**：高饱和度鲜艳色彩作为点缀和功能性标识
- **艺术感**：注重视觉冲击力、创意表达和美观度

### Tailwind 配色系统

```css
/* Vercel 风格配色方案 */
:root {
  /* 灰度主色调 */
  --gray-50: #fafafa; /* 页面背景 */
  --gray-100: #f5f5f5; /* 卡片背景 */
  --gray-200: #e5e5e5; /* 边框颜色 */
  --gray-400: #a3a3a3; /* 辅助文本 */
  --gray-600: #525252; /* 主要文本 */
  --gray-900: #171717; /* 深色文本 */

  /* 功能性强调色 */
  --accent-blue: #0070f3; /* Vercel 蓝 (主要) */
  --accent-purple: #7c3aed; /* 紫色 (创意) */
  --accent-pink: #ec4899; /* 粉色 (活跃) */
  --accent-green: #10b981; /* 绿色 (成功) */
  --accent-orange: #f59e0b; /* 橙色 (警告) */

  /* 渐变系统 */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-accent: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

### 设计原则

- **简洁现代**：大量留白，清晰层次结构
- **响应式设计**：移动端优先的适配策略
- **微交互**：流畅的动画和过渡效果
- **一致性**：统一的组件设计语言

### 移动端优化重点

```typescript
移动端策略: {
  响应式设计: "Tailwind的移动优先设计原则",
  触控优化: "按钮大小44px+，滑动手势，触控反馈",
  性能优化: "图片懒加载、代码分割、渐进式加载",
  用户体验: "移动端导航、手势操作、键盘适配"
}
```

## 🔍 SEO 优化策略

```typescript
SEO规范: {
  元数据管理: {
    基础Meta: "每个页面的title、description、keywords",
    OpenGraph: "社交分享的图片、标题、描述",
    TwitterCard: "Twitter分享卡片优化",
    Canonical: "规范化URL，避免重复内容"
  },

  结构化数据: {
    BlogPosting: "博客文章的JSON-LD标记",
    Person: "个人信息的结构化数据",
    WebSite: "网站整体信息标记",
    BreadcrumbList: "面包屑导航"
  },

  技术SEO: {
    站点地图: "自动生成sitemap.xml",
    robots文件: "搜索引擎爬虫指引",
    性能优化: "Core Web Vitals指标优化",
    图片优化: "alt标签、WebP格式、响应式图片"
  },

  内容优化: {
    URL结构: "简洁、语义化的URL路径",
    内链策略: "相关文章推荐、标签互联",
    内容质量: "原创性、相关性、更新频率"
  }
}
```

## 🛡️ 错误处理和用户体验

```typescript
错误处理策略: {
  全局错误边界: "React Error Boundary + 友好错误页面",
  API错误处理: "统一错误响应格式 + 用户友好提示",
  加载状态管理: {
    Loading: "骨架屏、进度条、加载动画",
    Empty: "空状态页面、引导用户操作",
    Error: "错误状态、重试机制、错误报告"
  },
  用户反馈: "Toast通知、确认弹窗、操作反馈"
}
```

## 🔧 Git 工作流程规范

```typescript
Git规范: {
  分支策略: "main (生产) + feature branches (功能开发)",
  提交规范: "Conventional Commits (feat/fix/docs/style/refactor)",
  提交信息: "feat(dashboard): 添加统计卡片组件",
  代码审查: "自我审查checklist，关键功能review",
  发布流程: "feature -> main -> 自动部署到Vercel"
}
```

## 🏗️ 功能架构规范

### 核心功能模块

```typescript
功能模块架构: {
  "Blog 系统": {
    数据源: "Obsidian Published 文件同步",
    核心功能: "文章展示、分类标签、全站搜索",
    管理功能: "同步设置、内容管理、发布控制",
    分析功能: "阅读统计、内容分析、发布趋势"
  },

  "Projects 系统": {
    数据源: "GitHub API 集成",
    核心功能: "项目展示、技术栈展示、活动图表",
    管理功能: "仓库选择、展示设置、同步配置",
    分析功能: "提交统计、语言分析、项目热度"
  },

  "Gallery 系统": {
    数据源: "本地文件上传",
    核心功能: "图片展示、相册分类、元数据展示",
    管理功能: "上传管理、分类管理、批量操作",
    分析功能: "存储统计、访问分析、上传趋势"
  },

  "Dashboard 系统": {
    概览页: "统计卡片、活动时间线、快速操作",
    管理页面: "各模块的专门管理界面",
    系统设置: "个人信息、外观设置、API配置",
    分析集成: "各页面内嵌数据分析功能"
  },

  "搜索系统": {
    搜索范围: "博客文章、项目信息、图片元数据",
    搜索功能: "关键词搜索、标签筛选、高级搜索",
    实现方案: "PostgreSQL全文搜索 + 前端搜索UI"
  }
}
```

### 📸 图片处理策略

```typescript
图片管理方案: {
  存储策略: {
    开发阶段: "Vercel本地存储，简单快速启动",
    生产阶段: "Cloudflare R2，性价比最高 (10GB免费)",
    备选方案: "AWS S3 (更成熟) 或 Vercel Blob (更简单)"
  },

  处理流程: {
    上传处理: "格式验证、大小限制、自动压缩",
    格式优化: "WebP转换、多尺寸生成",
    CDN分发: "Cloudflare CDN自动加速",
    元数据: "EXIF信息提取、地理位置、拍摄参数"
  },

  展示优化: {
    懒加载: "IntersectionObserver API",
    渐进加载: "模糊预览 -> 高清图片",
    响应式: "不同屏幕尺寸对应图片",
    瀑布流: "Masonry布局，自适应排列"
  }
}
```

### 📊 访问统计系统

```typescript
统计分析功能: {
  基础数据: {
    访问量: "PV (页面浏览量)、UV (独立访客)",
    来源分析: "直接访问、搜索引擎、社交媒体",
    设备统计: "桌面端、移动端、平板端",
    地理分布: "访客地理位置分析"
  },

  内容分析: {
    热门内容: "最受欢迎的博客文章、项目",
    阅读深度: "文章完整阅读率、停留时间",
    互动数据: "点击率、跳出率、转换率",
    搜索分析: "站内搜索关键词统计"
  },

  技术实现: {
    数据收集: "客户端埋点 + 服务端日志",
    数据存储: "PostgreSQL 时序数据表",
    数据展示: "Chart.js 可视化图表",
    隐私保护: "匿名化处理，符合隐私法规"
  },

  Dashboard集成: {
    实时概览: "当日访问数据、趋势图表",
    详细报告: "周报、月报、年度总结",
    内容优化: "基于数据的内容策略建议"
  }
}
```

### 页面结构设计

```typescript
// 网站完整结构
tiny-room/
├── 🏠 首页 (/) - 暂时简单展示，后期完善
├── 📝 Blog (/blog) - 暂时留白，后期实现
├── 💻 Projects (/projects) - 暂时留白，后期实现
├── 📸 Gallery (/gallery) - 暂时留白，后期实现
└── ⚙️ Dashboard (/dashboard) - 优先实现的核心功能
    ├── 概览页面 - 数据统计 + 快速操作
    ├── Blog管理 - Obsidian同步 + 内容管理 + 分析
    ├── Projects管理 - GitHub集成 + 项目管理 + 统计
    ├── Gallery管理 - 图片上传 + 相册管理 + 分析
    └── 系统设置 - 配置管理 + API设置
```

### Dashboard 核心结构设计

#### Dashboard 页面架构

```typescript
tiny-room/dashboard/
├── 📈 概览页 (/dashboard)
│   ├── 快速统计卡片
│   ├── 最近活动时间线
│   ├── 系统状态监控
│   └── 快速操作面板
│
├── 📝 Blog 管理 (/dashboard/blog)
│   ├── 文章列表 + 内嵌数据分析
│   ├── Obsidian 同步设置
│   ├── 文章编辑/预览
│   └── 发布状态管理
│
├── 💻 Projects 管理 (/dashboard/projects)
│   ├── GitHub 同步状态 + 统计图表
│   ├── 项目列表管理
│   ├── 项目展示设置
│   └── API 配置管理
│
├── 📸 Gallery 管理 (/dashboard/gallery)
│   ├── 图片上传 + 存储统计
│   ├── 相册分类管理
│   ├── 图片批量操作
│   └── 元数据编辑
│
└── ⚙️ 系统设置 (/dashboard/settings)
    ├── 个人信息设置
    ├── 主题和外观
    ├── API 密钥管理
    └── 系统维护工具
```

#### Dashboard 详细功能设计

**1. Dashboard 概览页**

```typescript
概览页组件布局: {
  顶部统计卡片: [
    "博客文章总数 + 本周新增 + 阅读趋势",
    "GitHub 项目数量 + 最近提交 + 活跃度",
    "Gallery 图片总数 + 存储使用 + 上传趋势",
    "本月访问量 + 增长趋势 + 用户分析"
  ],

  中部内容区域: [
    "最近活动时间线 (文章发布、项目更新、图片上传)",
    "待处理任务 (同步失败、需要review的内容)",
    "系统状态 (磁盘空间、API配额、同步状态)",
    "内容统计图表 (访问量趋势、内容分布)"
  ],

  侧边快速操作: [
    "快速发布文章",
    "上传新图片",
    "同步GitHub数据",
    "导入Obsidian文件",
    "查看访问统计"
  ]
}
```

**2. Blog 管理页面**

```typescript
Blog管理功能: {
  主要区域: {
    文章列表: "表格形式，支持搜索、筛选、批量操作",
    统计分析: "阅读量排行、发布频率、标签热度",
    同步状态: "Obsidian同步日志、错误报告",
    内容分析: "文章质量评分、SEO建议"
  },

  功能操作: {
    文件同步: "手动/自动同步Obsidian文件",
    内容编辑: "在线Markdown编辑器，实时预览",
    发布管理: "草稿/发布状态控制",
    SEO优化: "meta信息编辑、关键词建议"
  },

  数据分析: {
    阅读统计: "单篇文章详细访问数据",
    用户行为: "阅读时长、跳出率、分享数",
    内容优化: "基于数据的写作建议",
    趋势分析: "发布频率与阅读量关系"
  }
}
```

**3. Projects 管理页面**

```typescript
Projects管理功能: {
  主要区域: {
    项目列表: "GitHub仓库列表，展示状态设置",
    同步配置: "GitHub API配置，数据更新频率",
    展示设置: "选择展示的仓库，排序规则",
    统计图表: "提交活动、语言分布、star趋势"
  },

  GitHub集成: {
    仓库管理: "选择/隐藏特定仓库",
    数据同步: "自动拉取仓库信息、README、统计",
    展示优化: "项目描述编辑、分类标签",
    活动追踪: "提交历史、issue状态、PR统计"
  },

  数据分析: {
    代码统计: "语言占比、代码行数、文件结构",
    活跃度分析: "提交频率、贡献者统计",
    项目热度: "star增长、fork数量、访问量",
    技术栈分析: "使用技术的分布和趋势"
  }
}
```

**4. Gallery 管理页面**

```typescript
Gallery管理功能: {
  主要区域: {
    图片网格: "缩略图展示，支持多选操作",
    上传区域: "拖拽上传，进度显示，批量处理",
    分类管理: "相册创建、图片分类、标签系统",
    存储统计: "空间使用情况、文件大小分布"
  },

  图片处理: {
    批量上传: "多文件选择，进度追踪",
    格式优化: "自动压缩、WebP转换",
    元数据管理: "EXIF信息、地理位置、拍摄参数",
    版本管理: "原图保存、多尺寸生成"
  },

  组织功能: {
    相册分类: "按主题、时间、地点分类",
    标签系统: "自定义标签、批量标记",
    搜索筛选: "按日期、标签、文件名搜索",
    展示设置: "公开/私有、展示顺序"
  },

  数据分析: {
    存储分析: "文件大小、格式分布、增长趋势",
    访问统计: "图片浏览量、下载次数",
    用户偏好: "最受欢迎的图片、相册",
    性能监控: "加载速度、CDN命中率"
  }
}
```

**5. 系统设置页面**

```typescript
系统设置功能: {
  个人信息: {
    基础信息: "姓名、头像、个人简介",
    联系方式: "邮箱、社交媒体链接",
    专业信息: "技能标签、工作经历"
  },

  外观设置: {
    主题配置: "浅色/深色模式切换",
    色彩定制: "主题色、强调色调整",
    布局选项: "导航方式、页面布局",
    字体设置: "字体大小、行间距"
  },

  API配置: {
    GitHub设置: "Personal Access Token配置",
    存储配置: "Cloudflare R2访问密钥",
    Obsidian设置: "文件路径、同步规则",
    统计服务: "Google Analytics等第三方服务"
  },

  系统维护: {
    数据备份: "内容导出、数据库备份",
    清理工具: "缓存清理、无用文件删除",
    日志查看: "系统日志、错误报告",
    性能监控: "网站性能、资源使用情况"
  }
}
```

## 🗂️ 项目文件结构规范

### 现代样式文件结构

```typescript
tiny-room/
├── src/
│   ├── app/                    // Next.js App Router
│   │   ├── globals.css         // Tailwind基础样式 + 全局样式
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                 // 基础UI组件
│   │   │   ├── Button/
│   │   │   │   ├── index.tsx   // 组件逻辑
│   │   │   │   └── variants.ts // Tailwind变体配置
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   └── Input/
│   │   ├── layout/             // 布局组件
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Navigation/
│   │   ├── features/           // 功能模块组件
│   │   │   ├── Blog/
│   │   │   ├── Projects/
│   │   │   ├── Gallery/
│   │   │   └── Dashboard/
│   │   └── shared/             // 共享组件
│   │       ├── SearchBar/
│   │       ├── LoadingSpinner/
│   │       └── ErrorBoundary/
│   ├── styles/                 // 样式文件目录
│   │   ├── globals.css         // 全局样式
│   │   ├── components/         // 组件特定样式（如需）
│   │   └── utilities/          // 自定义工具类
│   ├── lib/                    // 工具函数
│   │   ├── utils.ts           // 通用工具函数
│   │   ├── cn.ts              // className工具
│   │   ├── api.ts             // API封装
│   │   └── constants.ts       // 常量定义
│   ├── hooks/                  // 自定义Hooks
│   │   ├── useSearch.ts
│   │   ├── useGitHub.ts
│   │   └── useStatistics.ts
│   ├── types/                  // TypeScript类型定义
│   │   ├── api.ts
│   │   ├── blog.ts
│   │   ├── projects.ts
│   │   └── gallery.ts
│   └── store/                  // 状态管理（Zustand）
│       ├── blogStore.ts
│       ├── projectsStore.ts
│       └── galleryStore.ts
├── public/                     // 静态资源
│   ├── images/
│   ├── icons/
│   └── uploads/
├── docs/                       // 项目文档
│   └── project-specification.md
├── tailwind.config.js          // Tailwind配置
├── postcss.config.js           // PostCSS配置
├── next.config.js              // Next.js配置
├── tsconfig.json               // TypeScript配置
├── .eslintrc.json              // ESLint配置
├── .prettierrc                 // Prettier配置
├── package.json                // 项目依赖
└── pnpm-lock.yaml              // pnpm锁文件
```

### 组件开发规范

```typescript
// 组件命名和结构规范
Component规范: {
  命名: "PascalCase，语义化命名",
  目录结构: "每个组件一个文件夹",
  文件组成: "index.tsx + variants.ts (如需)",
  Props类型: "interface定义，导出复用",
  样式方案: "Tailwind classes + cn()工具函数"
}

// 示例组件结构
Button/
├── index.tsx           // 主组件文件
├── variants.ts         // 变体配置
└── Button.stories.tsx  // Storybook故事文件（可选）
```

## 🚀 开发工作流程

### 项目初始化

```bash
# 项目创建和依赖安装
pnpm create next-app@latest tiny-room --typescript --tailwind --eslint --app
cd tiny-room
pnpm install

# 添加必要依赖
pnpm add @headlessui/react @heroicons/react lucide-react framer-motion
pnpm add zustand @next/bundle-analyzer

# 开发工具
pnpm add -D prettier eslint-config-prettier
```

### 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器
pnpm lint         # 代码检查
pnpm lint:fix     # 自动修复lint问题
pnpm type-check   # TypeScript类型检查
```

### 代码质量保证

```typescript
代码规范: {
  TypeScript: "strict模式，严格类型检查",
  ESLint: "Next.js推荐规则 + 自定义规则",
  Prettier: "统一代码格式化",
  Husky: "Git hooks，提交前检查",
  "lint-staged": "仅检查暂存文件"
}
```

## 📊 性能监控与优化

### Core Web Vitals 优化

```typescript
性能指标: {
  LCP: "Largest Contentful Paint < 2.5s",
  FID: "First Input Delay < 100ms",
  CLS: "Cumulative Layout Shift < 0.1",
  TTFB: "Time to First Byte < 600ms"
}

优化策略: {
  图片优化: "WebP格式，响应式图片，懒加载",
  代码分割: "动态导入，路由级别代码分割",
  缓存策略: "静态资源缓存，API响应缓存",
  资源预加载: "关键资源预加载，预连接"
}
```

### 监控工具

```typescript
监控方案: {
  性能监控: "Web Vitals API，Real User Monitoring",
  错误追踪: "Sentry (可选)，自定义错误上报",
  分析工具: "Google Analytics，内置统计系统",
  构建分析: "@next/bundle-analyzer，包大小分析"
}
```

## 🚀 部署配置

### Vercel 部署设置

```typescript
// vercel.json 配置
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://your-domain.vercel.app"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

### 环境变量配置

```bash
# .env.local (本地开发)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

GITHUB_TOKEN=your-github-token
CLOUDFLARE_R2_ACCESS_KEY=your-r2-key
CLOUDFLARE_R2_SECRET_KEY=your-r2-secret
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name

DATABASE_URL=postgresql://user:password@localhost:5432/tinyroom
```

## 📝 开发阶段规划

### 第一阶段：基础架构 (Week 1-2)

- ✅ 项目初始化和基础配置
- ✅ 设计系统和 UI 组件库
- ✅ 路由结构和页面框架
- ✅ 数据库设计和 API 基础

### 第二阶段：Dashboard 核心功能 (Week 3-4)

- 📊 Dashboard 概览页面
- ⚙️ 系统设置页面
- 🔐 用户认证系统
- 📈 基础统计功能

### 第三阶段：内容管理系统 (Week 5-6)

- 📝 Blog 管理功能
- 💻 Projects 管理功能
- 📸 Gallery 管理功能
- 🔍 全站搜索系统

### 第四阶段：优化和完善 (Week 7-8)

- 🚀 性能优化和 SEO
- 📱 移动端体验优化
- 📊 完整统计系统
- 🐛 测试和 Bug 修复

### 第五阶段：前台页面 (Week 9-10)

- 🏠 首页设计和实现
- 📝 Blog 展示页面
- 💻 Projects 展示页面
- 📸 Gallery 展示页面

---

## 📋 项目检查清单

### 开发完成标准

- [ ] 所有 Dashboard 功能完整实现
- [ ] 移动端适配完成
- [ ] SEO 优化到位
- [ ] 性能指标达标
- [ ] 错误处理完善
- [ ] 统计系统正常运行
- [ ] 部署流程验证
- [ ] 安全性检查通过

### 质量保证

- [ ] TypeScript 类型覆盖 100%
- [ ] ESLint 无错误
- [ ] Prettier 格式统一
- [ ] Core Web Vitals 绿色
- [ ] 无控制台错误
- [ ] API 响应时间 < 500ms
- [ ] 图片加载优化
- [ ] 跨浏览器兼容性测试

---

_这份规范文档将作为 Tiny Room 项目开发的指导原则，确保项目的质量、一致性和可维护性。_
