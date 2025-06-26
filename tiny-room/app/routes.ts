import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('projects', 'routes/projects.tsx'),
  route('projects/:id', 'routes/project-detail.tsx'),
  route('gallery', 'routes/gallery.tsx'),
  route('about', 'routes/about.tsx'),
  route('blog', 'routes/blog.tsx'),
  route('blog/:slug', 'routes/blog-post.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('editor', 'routes/editor.tsx'),
] satisfies RouteConfig;
