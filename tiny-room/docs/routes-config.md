# Tiny Room 路由配置

## 当前路由结构

```typescript
// app/routes.ts
import { type RouteConfig, index, route } from '@react-router/dev/routes';
export default [
  index('routes/home.tsx'), // 首页路由 (/)
  route('gallery', 'routes/gallery.tsx'), // 图库路由 (/gallery)
  route('projects', 'routes/projects.tsx'), // 项目路由 (/projects)
] satisfies RouteConfig;
```

## 计划路由结构

```typescript
// app/routes.ts (计划)
import { type RouteConfig, index, route } from '@react-router/dev/routes';
export default [
  // 基本页面
  index('routes/home.tsx'), // 首页路由 (/)
  route('gallery', 'routes/gallery.tsx'), // 图库路由 (/gallery)
  route('projects', 'routes/projects.tsx'), // 项目路由 (/projects)
  route('about', 'routes/about.tsx'), // 关于页面 (/about)
  route('contact', 'routes/contact.tsx'), // 联系页面 (/contact)

  // 博客相关路由
  route('blog', 'routes/blog/index.tsx'), // 博客首页 (/blog)
  route('blog/$slug', 'routes/blog/post.tsx'), // 博客文章页 (/blog/:slug)
  route('blog/tags/$tag', 'routes/blog/tag.tsx'), // 博客标签页 (/blog/tags/:tag)

  // 项目详情页
  route('projects/$id', 'routes/projects/project.tsx'), // 项目详情 (/projects/:id)

  // 管理后台路由（需要身份验证）
  route('admin', 'routes/admin/index.tsx'), // 管理首页 (/admin)
  route('admin/posts', 'routes/admin/posts.tsx'), // 文章管理 (/admin/posts)
  route('admin/posts/new', 'routes/admin/posts/new.tsx'), // 新建文章 (/admin/posts/new)
  route('admin/posts/$id/edit', 'routes/admin/posts/edit.tsx'), // 编辑文章 (/admin/posts/:id/edit)
  route('admin/projects', 'routes/admin/projects.tsx'), // 项目管理 (/admin/projects)
  route('admin/gallery', 'routes/admin/gallery.tsx'), // 图库管理 (/admin/gallery)
  route('admin/settings', 'routes/admin/settings.tsx'), // 网站设置 (/admin/settings)

  // 错误页面
  route('*', 'routes/not-found.tsx'), // 404页面
] satisfies RouteConfig;
```

## 路由权限控制

```typescript
// 示例：路由权限控制
import { redirect } from '@react-router/node';

// 管理员权限检查
export async function loader({ request }) {
  const session = await getSession(request);
  if (!session.user || session.user.role !== 'admin') {
    return redirect('/login?redirectTo=' + encodeURIComponent(new URL(request.url).pathname));
  }
  return { user: session.user };
}
```

## 布局结构

```
Layout组织结构:
- RootLayout (app/root.tsx)
  |- Header
  |- {Outlet} - 页面内容
  |- Footer

- AdminLayout (app/routes/admin.tsx)
  |- AdminHeader
  |- AdminSidebar
  |- {Outlet} - 管理页面内容
```
