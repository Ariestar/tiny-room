# Tiny Room 数据模型定义

## 1. 项目数据模型 (Project)

```typescript
interface Project {
  id: string; // 项目唯一标识符
  title: string; // 项目标题
  description: string; // 项目简介
  longDescription?: string; // 项目详细描述（可选）
  thumbnail: string; // 项目缩略图路径
  images?: string[]; // 项目相关图片路径数组（可选）
  tags: string[]; // 项目标签/技术栈
  link?: string; // 项目链接（可选）
  sourceCode?: string; // 源代码链接（可选）
  featured: boolean; // 是否为特色项目
  completionDate?: string; // 项目完成日期（可选）
  role?: string; // 在项目中担任的角色（可选）
}
```

## 2. 图库数据模型 (GalleryImage)

```typescript
interface GalleryImage {
  id: string; // 图片唯一标识符
  src: string; // 图片路径
  alt: string; // 图片替代文本
  title?: string; // 图片标题（可选）
  description?: string; // 图片描述（可选）
  tags?: string[]; // 图片标签（可选，用于筛选）
  date?: string; // 图片创建日期（可选）
}
```

## 3. 博客文章数据模型 (BlogPost)

```typescript
interface BlogPost {
  id: string; // 文章唯一标识符
  title: string; // 文章标题
  slug: string; // URL友好的文章标识
  content: string; // 文章内容（Markdown格式）
  excerpt: string; // 文章摘要
  coverImage?: string; // 封面图片路径（可选）
  tags: string[]; // 文章标签
  publishDate: string; // 发布日期
  lastModified?: string; // 最后修改日期（可选）
  author: {
    // 作者信息
    name: string; // 作者姓名
    avatar?: string; // 作者头像（可选）
  };
  featured: boolean; // 是否为特色文章
  status: 'draft' | 'published'; // 文章状态
}
```

## 4. 用户数据模型 (User)

```typescript
interface User {
  id: string; // 用户唯一标识符
  username: string; // 用户名
  email: string; // 电子邮件
  password: string; // 加密密码（仅存储在服务器端）
  name?: string; // 真实姓名（可选）
  avatar?: string; // 头像路径（可选）
  role: 'admin' | 'editor' | 'viewer'; // 用户角色
  createdAt: string; // 创建日期
  lastLogin?: string; // 最后登录时间（可选）
}
```

## 5. 网站设置数据模型 (SiteSettings)

```typescript
interface SiteSettings {
  siteName: string; // 网站名称
  tagline?: string; // 网站标语（可选）
  description: string; // 网站描述
  logo: string; // 网站logo路径
  favicon: string; // 网站图标路径
  contactEmail: string; // 联系邮箱
  socialLinks: {
    // 社交媒体链接
    github?: string; // GitHub链接（可选）
    linkedin?: string; // LinkedIn链接（可选）
    twitter?: string; // Twitter链接（可选）
    instagram?: string; // Instagram链接（可选）
    [key: string]: string | undefined; // 其他社交媒体
  };
  theme: 'light' | 'dark' | 'system'; // 默认主题
  metaTags: {
    // SEO元标签
    keywords: string[]; // 关键词
    ogImage?: string; // Open Graph图片（可选）
  };
}
```
