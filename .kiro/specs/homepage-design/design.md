# 主页设计文档

## 概述

Tiny Room 主页将作为一个有趣且富有个性的个人博客入口，结合丰富的视觉设计元素和清晰的信息层次。设计遵循现代博客美学，注重创意表达和视觉冲击力，营造轻松有趣的氛围，吸引访客深入探索内容。

## 架构设计

### 视觉层次结构

主页采用**渐进式展示**的方式，通过四个主要区域营造有趣的浏览体验：

1. **欢迎区域** - 个性化问候和创意展示
2. **内容精选** - 最新博客、项目和图片的有趣预览
3. **个人介绍** - 轻松有趣的自我介绍
4. **互动联系** - 社交媒体和联系方式

### 布局系统

```
┌─────────────────────────────────────────┐
│            欢迎区域 HERO                 │
│      (创意动画 + 个性化问候)              │
├─────────────────────────────────────────┤
│           内容精选 FEATURED              │
│   [最新博客] [酷炫项目] [精美图片]        │
├─────────────────────────────────────────┤
│           关于我 ABOUT                   │
│        (有趣的个人介绍)                  │
├─────────────────────────────────────────┤
│         联系互动 CONTACT                 │
│       (社交媒体 + 有趣互动)              │
└─────────────────────────────────────────┘
```

## 组件设计

### 1. 欢迎区域组件

**视觉设计：**

- **背景效果**: 动态渐变网格 + 漂浮的几何图形
- **文字展示**: 大胆的字体设计，带有打字机效果
- **互动动画**: 鼠标跟随的粒子效果，滚动视差
- **个性元素**: 随机问候语、时间相关的问候、emoji 装饰

**技术规格：**

```typescript
interface HeroSectionProps {
  greetings: string[]; // 随机问候语数组
  name: string;
  subtitle: string; // 有趣的个人标签
  funFacts: string[]; // 有趣的个人事实
  currentActivity?: string; // 当前在做什么
}
```

**设计元素：**

- 动态背景：渐变 + 几何图形动画
- 文字效果：打字机动画、彩虹渐变文字
- 互动元素：点击触发彩蛋、鼠标悬停效果
- 个性化：根据时间显示不同问候语

### 2. 内容精选组件

**视觉设计：**

- **卡片设计**: 不规则形状的卡片，带有倾斜和阴影效果
- **图片处理**: 圆角、滤镜效果、悬停放大
- **文字排版**: 有趣的字体组合，突出重点内容
- **动画效果**: 卡片入场动画，悬停时的微交互

**技术规格：**

```typescript
interface FeaturedContentProps {
  latestPosts: Array<{
    title: string;
    excerpt: string;
    publishedAt: string;
    slug: string;
    emoji: string; // 文章emoji标识
    readTime: number;
    tags: string[];
  }>;
  coolProjects: Array<{
    title: string;
    description: string;
    image: string;
    techStack: string[];
    githubUrl: string;
    liveUrl?: string;
    isHighlight: boolean; // 是否为重点项目
  }>;
  recentPhotos: Array<{
    src: string;
    alt: string;
    caption?: string;
    location?: string;
    takenAt: string;
  }>;
}
```

### 3. 个人介绍组件

**视觉设计：**

- **布局方式**: 创意的非对称布局
- **头像处理**: 有趣的头像边框，可能带有动画效果
- **文字内容**: 轻松幽默的自我介绍，避免过于正式
- **互动元素**: 点击展开更多信息，有趣的个人标签

**技术规格：**

```typescript
interface AboutSectionProps {
  avatar: {
    src: string;
    alt: string;
    hasAnimation: boolean;
  };
  introduction: {
    greeting: string; // 个性化问候
    description: string; // 有趣的自我描述
    interests: string[]; // 兴趣爱好
    currentlyLearning?: string; // 正在学习什么
    funFact: string; // 有趣的个人事实
  };
  personalTags: string[]; // 个人标签
  currentStatus: {
    mood: string; // 当前心情
    activity: string; // 在做什么
    location?: string; // 当前位置
  };
}
```

### 4. 互动联系组件

**视觉设计：**

- **社交图标**: 彩色图标，悬停时有有趣的动画
- **联系方式**: 创意的展示方式，避免传统列表
- **互动游戏**: 小游戏或彩蛋，增加趣味性
- **状态显示**: 在线状态、回复速度等有趣信息

**技术规格：**

```typescript
interface ContactSectionProps {
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
    color: string;
    hoverEffect: "bounce" | "rotate" | "scale" | "shake";
  }>;
  contactInfo: {
    email: string;
    responseTime: string; // 预期回复时间
    preferredContact: string; // 偏好的联系方式
  };
  interactiveElements: {
    hasEasterEgg: boolean;
    miniGame?: string; // 小游戏类型
    funMessage: string; // 有趣的联系提示
  };
}
```

## 数据模型

### 主页内容模型

```typescript
interface HomepageContent {
  hero: {
    greetings: string[];
    name: string;
    subtitle: string;
    funFacts: string[];
    currentActivity?: string;
    backgroundAnimation: "gradient" | "particles" | "geometric";
  };
  featured: {
    posts: BlogPost[];
    projects: Project[];
    photos: Photo[];
  };
  about: {
    avatar: string;
    introduction: PersonalIntro;
    tags: string[];
    currentStatus: CurrentStatus;
  };
  contact: {
    socialLinks: SocialLink[];
    contactInfo: ContactInfo;
    interactiveElements: InteractiveElements;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
}
```

### 动画配置模型

```typescript
interface AnimationConfig {
  reducedMotion: boolean;
  heroAnimations: {
    typingSpeed: number;
    particleCount: number;
    geometricShapes: boolean;
  };
  cardAnimations: {
    staggerDelay: number;
    hoverScale: number;
    entranceAnimation: "slideUp" | "fadeIn" | "bounceIn";
  };
  interactiveEffects: {
    mouseFollower: boolean;
    clickRipple: boolean;
    hoverGlow: boolean;
  };
}
```

## 错误处理

### 加载状态

- **骨架屏**: 有趣的加载动画，而不是传统的灰色块
- **渐进加载**: 内容逐步显示，保持用户兴趣
- **错误边界**: 友好的错误提示，带有幽默元素
- **图片回退**: 有趣的占位图片

### 性能优化

- **代码分割**: 按需加载动画和互动元素
- **图片优化**: WebP 格式，响应式图片
- **动画性能**: 使用 CSS transforms 和 opacity
- **懒加载**: 滚动到视口时才加载内容

## 测试策略

### 视觉回归测试

- **截图对比**: 自动化视觉测试
- **跨浏览器**: Chrome、Firefox、Safari 兼容性
- **设备测试**: 移动端、平板、桌面响应式
- **无障碍测试**: 屏幕阅读器和键盘导航

### 用户体验测试

- **可用性测试**: 导航流程和交互模式
- **趣味性测试**: 内容是否足够吸引人
- **加载速度**: 各种网络条件下的表现
- **互动效果**: 动画和特效的流畅度

## 设计系统集成

### 色彩方案

```css
/* 主要灰度系统 */
--gray-50: #fafafa; /* 页面背景 */
--gray-100: #f5f5f5; /* 卡片背景 */
--gray-200: #e5e5e5; /* 边框 */
--gray-400: #a3a3a3; /* 辅助文字 */
--gray-600: #525252; /* 主要文字 */
--gray-900: #171717; /* 标题 */

/* 有趣的强调色 */
--accent-blue: #0070f3; /* 主要按钮 */
--accent-purple: #7c3aed; /* 创意元素 */
--accent-pink: #ec4899; /* 互动高亮 */
--accent-green: #10b981; /* 成功状态 */
--accent-orange: #f59e0b; /* 警告提示 */
--accent-rainbow: linear-gradient(
  45deg,
  #ff6b6b,
  #4ecdc4,
  #45b7d1,
  #96ceb4,
  #feca57
);
```

### 字体系统

```css
/* 标题字体 */
.text-hero {
  font-size: 4rem;
  font-weight: 800;
} /* 主标题 */
.text-section {
  font-size: 2.5rem;
  font-weight: 700;
} /* 区域标题 */
.text-card {
  font-size: 1.5rem;
  font-weight: 600;
} /* 卡片标题 */

/* 正文字体 */
.text-intro {
  font-size: 1.25rem;
  line-height: 1.6;
} /* 介绍文字 */
.text-body {
  font-size: 1rem;
  line-height: 1.5;
} /* 正文 */
.text-caption {
  font-size: 0.875rem;
  color: var(--gray-400);
} /* 说明文字 */

/* 特殊效果字体 */
.text-gradient {
  background: var(--accent-rainbow);
  -webkit-background-clip: text;
}
.text-typing {
  border-right: 2px solid;
  animation: typing 2s steps(20), blink 1s infinite;
}
```

### 间距系统

```css
/* 一致的间距比例 */
--space-xs: 0.5rem; /* 8px */
--space-sm: 1rem; /* 16px */
--space-md: 1.5rem; /* 24px */
--space-lg: 2rem; /* 32px */
--space-xl: 3rem; /* 48px */
--space-2xl: 4rem; /* 64px */
--space-3xl: 6rem; /* 96px */
```

## 响应式设计

### 断点系统

```css
/* 移动优先设计 */
/* 基础: 320px+ (手机) */
/* sm: 640px+ (大屏手机) */
/* md: 768px+ (平板) */
/* lg: 1024px+ (桌面) */
/* xl: 1280px+ (大屏桌面) */
```

### 组件适配

- **欢迎区域**: 桌面全屏，移动端适中高度
- **内容精选**: 3 列 → 2 列 → 1 列
- **个人介绍**: 左右布局 → 上下堆叠
- **联系方式**: 横向排列 → 网格布局

## 无障碍考虑

### WCAG 2.1 AA 合规

- **颜色对比**: 正常文字最低 4.5:1 对比度
- **焦点管理**: 所有交互元素的可见焦点指示器
- **键盘导航**: 完整的键盘可访问性
- **屏幕阅读器**: 适当的 ARIA 标签和语义化 HTML
- **动画控制**: 尊重 `prefers-reduced-motion` 设置

### 实现细节

- **替代文字**: 所有图片的描述性 alt 文字
- **标题结构**: 逻辑的标题层次 (h1 → h2 → h3)
- **链接上下文**: 清晰的链接目的和目标
- **表单标签**: 所有表单元素的适当标签
- **跳转链接**: 屏幕阅读器的导航跳转链接
