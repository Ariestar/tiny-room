import type { BlogPost } from '../types';
import { BaseDataService, DataServiceError } from './BaseDataService';

export class BlogService extends BaseDataService<BlogPost> {
  private static instance: BlogService;

  constructor() {
    super('blog_cache', {
      ttl: 5 * 60 * 1000, // 5分钟缓存，博客内容可能经常更新
      invalidateOn: ['create', 'update', 'delete'],
    });
  }

  // 单例模式
  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  // 实现抽象方法
  protected async fetchData(): Promise<BlogPost[]> {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      // 在真实应用中，这里会调用API
      // const response = await fetch('/api/blog/posts');
      // return response.json();

      // 返回模拟数据
      return [
        {
          id: 1,
          title: '如何构建现代化的前端应用',
          slug: 'how-to-build-modern-frontend-apps',
          content: '在这篇文章中，我将分享如何使用React和TypeScript构建现代化的前端应用...',
          excerpt: '学习使用React和TypeScript构建现代化前端应用的最佳实践。',
          author: 'John Doe',
          publishDate: '2023-06-15',
          lastModified: '2023-06-15',
          status: 'published',
          tags: ['React', 'TypeScript', 'Frontend', 'Development'],
          category: 'Technology',
          readingTime: 8,
          featuredImage: 'https://picsum.photos/seed/react/800/400',
          seo: {
            metaTitle: '如何构建现代化的前端应用 | My Blog',
            metaDescription: '学习使用React和TypeScript构建现代化前端应用的最佳实践和技巧。',
            keywords: ['React', 'TypeScript', 'Frontend', 'Web Development'],
          },
        },
        {
          id: 2,
          title: 'TypeScript 最佳实践指南',
          slug: 'typescript-best-practices-guide',
          content: 'TypeScript 已经成为现代JavaScript开发的标准，本文将介绍一些最佳实践...',
          excerpt: '深入了解TypeScript的最佳实践，提高代码质量和开发效率。',
          author: 'Jane Smith',
          publishDate: '2023-05-20',
          lastModified: '2023-05-22',
          status: 'published',
          tags: ['TypeScript', 'Best Practices', 'Code Quality'],
          category: 'Technology',
          readingTime: 12,
          featuredImage: 'https://picsum.photos/seed/typescript/800/400',
          seo: {
            metaTitle: 'TypeScript 最佳实践指南 | My Blog',
            metaDescription: '学习TypeScript的最佳实践，提高代码质量和开发效率。',
            keywords: ['TypeScript', 'Best Practices', 'JavaScript'],
          },
        },
        {
          id: 3,
          title: 'Web 性能优化技巧',
          slug: 'web-performance-optimization-tips',
          content: '网站性能直接影响用户体验和SEO排名，本文将分享一些实用的优化技巧...',
          excerpt: '学习如何优化网站性能，提升用户体验和搜索引擎排名。',
          author: 'Bob Johnson',
          publishDate: '2023-04-10',
          lastModified: '2023-04-10',
          status: 'published',
          tags: ['Performance', 'Optimization', 'Web Development', 'SEO'],
          category: 'Technology',
          readingTime: 15,
          featuredImage: 'https://picsum.photos/seed/performance/800/400',
          seo: {
            metaTitle: 'Web 性能优化技巧 | My Blog',
            metaDescription: '学习实用的网站性能优化技巧，提升用户体验和搜索引擎排名。',
            keywords: ['Web Performance', 'Optimization', 'SEO'],
          },
        },
        {
          id: 4,
          title: '2023年前端技术趋势',
          slug: 'frontend-tech-trends-2023',
          content: '2023年前端技术领域有很多新的发展趋势，让我们来看看有哪些值得关注的技术...',
          excerpt: '探讨2023年前端技术的发展趋势和新兴技术。',
          author: 'Alice Brown',
          publishDate: '2023-03-15',
          lastModified: '2023-03-15',
          status: 'published',
          tags: ['Frontend', 'Trends', '2023', 'Technology'],
          category: 'Technology',
          readingTime: 10,
          featuredImage: 'https://picsum.photos/seed/trends/800/400',
          seo: {
            metaTitle: '2023年前端技术趋势 | My Blog',
            metaDescription: '探讨2023年前端技术的发展趋势和值得关注的新兴技术。',
            keywords: ['Frontend Trends', 'Web Development', '2023'],
          },
        },
        {
          id: 5,
          title: 'React Hooks 深入解析',
          slug: 'react-hooks-deep-dive',
          content: 'React Hooks 彻底改变了我们编写React组件的方式，本文将深入解析各种Hook的使用...',
          excerpt: '深入了解React Hooks的原理和使用方法，掌握现代React开发。',
          author: 'Charlie Wilson',
          publishDate: '2023-02-28',
          lastModified: '2023-02-28',
          status: 'draft',
          tags: ['React', 'Hooks', 'Frontend', 'JavaScript'],
          category: 'Technology',
          readingTime: 20,
          featuredImage: 'https://picsum.photos/seed/hooks/800/400',
          seo: {
            metaTitle: 'React Hooks 深入解析 | My Blog',
            metaDescription: '深入了解React Hooks的原理和使用方法，掌握现代React开发技巧。',
            keywords: ['React Hooks', 'React', 'Frontend Development'],
          },
        },
      ];
    } catch (error) {
      throw new DataServiceError('Failed to fetch blog posts', 'FETCH_ERROR', 500);
    }
  }

  protected async saveData(data: BlogPost[]): Promise<void> {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200));

      // 在真实应用中，这里会调用API保存数据
      // await fetch('/api/blog/posts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      console.log('Blog posts saved:', data.length, 'items');
    } catch (error) {
      throw new DataServiceError('Failed to save blog posts', 'SAVE_ERROR', 500);
    }
  }

  protected generateId(): number {
    // 在真实应用中，ID应该由后端生成
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // 博客特有的方法
  async getPublishedPosts(): Promise<BlogPost[]> {
    return this.getAll({
      filters: { status: 'published' },
      sortBy: 'publishDate',
      sortOrder: 'desc',
    });
  }

  async getDraftPosts(): Promise<BlogPost[]> {
    return this.getAll({
      filters: { status: 'draft' },
      sortBy: 'lastModified',
      sortOrder: 'desc',
    });
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    return this.getAll({
      filters: { category },
      sortBy: 'publishDate',
      sortOrder: 'desc',
    });
  }

  async getPostsByAuthor(author: string): Promise<BlogPost[]> {
    return this.getAll({
      filters: { author },
      sortBy: 'publishDate',
      sortOrder: 'desc',
    });
  }

  async getPostsByTags(tags: string[]): Promise<BlogPost[]> {
    const allPosts = await this.getAll();
    return allPosts.filter(post =>
      tags.some(tag => post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase())))
    );
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const allPosts = await this.getAll();
    return allPosts.find(post => post.slug === slug);
  }

  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    const publishedPosts = await this.getPublishedPosts();
    // 简单地返回最新的几篇文章作为精选
    return publishedPosts.slice(0, limit);
  }

  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    const publishedPosts = await this.getPublishedPosts();
    return publishedPosts.slice(0, limit);
  }

  async getBlogStatistics(): Promise<{
    total: number;
    published: number;
    drafts: number;
    byCategory: Record<string, number>;
    byAuthor: Record<string, number>;
    byMonth: Record<string, number>;
  }> {
    const allPosts = await this.getAll();

    const byCategory = allPosts.reduce(
      (acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byAuthor = allPosts.reduce(
      (acc, post) => {
        acc[post.author] = (acc[post.author] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byMonth = allPosts.reduce(
      (acc, post) => {
        const month = post.publishDate.substring(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: allPosts.length,
      published: allPosts.filter(p => p.status === 'published').length,
      drafts: allPosts.filter(p => p.status === 'draft').length,
      byCategory,
      byAuthor,
      byMonth,
    };
  }

  // 内容管理方法
  async publishPost(postId: number): Promise<BlogPost> {
    const post = await this.getById(postId);
    if (!post) {
      throw new DataServiceError(`Post with id ${postId} not found`, 'NOT_FOUND', 404);
    }

    return this.update(postId, {
      status: 'published',
      publishDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    });
  }

  async unpublishPost(postId: number): Promise<BlogPost> {
    const post = await this.getById(postId);
    if (!post) {
      throw new DataServiceError(`Post with id ${postId} not found`, 'NOT_FOUND', 404);
    }

    return this.update(postId, {
      status: 'draft',
      lastModified: new Date().toISOString().split('T')[0],
    });
  }

  async generateSlug(title: string): Promise<string> {
    // 生成URL友好的slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 检查是否已存在，如果存在则添加数字后缀
    const existingPost = await this.getPostBySlug(baseSlug);
    if (!existingPost) {
      return baseSlug;
    }

    let counter = 1;
    let newSlug = `${baseSlug}-${counter}`;
    while (await this.getPostBySlug(newSlug)) {
      counter++;
      newSlug = `${baseSlug}-${counter}`;
    }

    return newSlug;
  }

  async updateReadingTime(postId: number): Promise<BlogPost> {
    const post = await this.getById(postId);
    if (!post) {
      throw new DataServiceError(`Post with id ${postId} not found`, 'NOT_FOUND', 404);
    }

    // 简单的阅读时间计算（基于字数，假设每分钟200字）
    const wordCount = post.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return this.update(postId, { readingTime });
  }
}

// 导出单例实例
export const blogService = BlogService.getInstance();
