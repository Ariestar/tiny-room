import { useEffect } from 'react';
import { useBlog } from '../contexts/DataContext';
import type { BlogPost } from '../types';

export default function Blog() {
  const { data: blogPosts, loading, actions } = useBlog();

  useEffect(() => {
    // 组件挂载时加载博客数据
    actions.getAll();
  }, []);

  if (loading.isLoading) {
    return (
      <main className="container mx-auto p-4 pt-16">
        <section className="blog-header mb-12">
          <h1 className="text-3xl font-bold mb-6">博客</h1>
          <p className="text-lg">分享我的想法、经验和技术见解。</p>
        </section>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">加载博客文章中...</div>
        </div>
      </main>
    );
  }

  if (loading.error) {
    return (
      <main className="container mx-auto p-4 pt-16">
        <section className="blog-header mb-12">
          <h1 className="text-3xl font-bold mb-6">博客</h1>
          <p className="text-lg">分享我的想法、经验和技术见解。</p>
        </section>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">加载失败: {loading.error}</div>
        </div>
      </main>
    );
  }

  // 获取所有分类
  const categories = Array.from(new Set(blogPosts.map((post: BlogPost) => post.category)));

  return (
    <main className="container mx-auto p-4 pt-16">
      <section className="blog-header mb-12">
        <h1 className="text-3xl font-bold mb-6">博客</h1>
        <p className="text-lg">分享我的想法、经验和技术见解。</p>
      </section>

      <section className="blog-categories mb-8">
        <div className="flex flex-wrap gap-2">
          <a
            href="#"
            className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full hover:bg-teal-200"
          >
            全部
          </a>
          {categories.map(category => (
            <a
              key={category}
              href="#"
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
            >
              {category}
            </a>
          ))}
        </div>
      </section>

      <section className="blog-posts">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post: BlogPost) => (
            <article
              key={post.id}
              className="blog-post-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <a href={`/blog/${post.slug}`} className="block">
                <img
                  src={post.featuredImage || 'https://picsum.photos/seed/' + post.slug + '/800/450'}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              </a>
              <div className="p-4">
                <div className="flex gap-2 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {post.readingTime}分钟阅读
                  </span>
                </div>

                <a href={`/blog/${post.slug}`} className="block">
                  <h2 className="text-xl font-semibold mb-2 hover:text-teal-600">{post.title}</h2>
                </a>

                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                  <span>{post.author}</span>
                  <span>{new Date(post.publishDate).toLocaleDateString('zh-CN')}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {blogPosts.length === 0 && !loading.isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无博客文章</p>
        </div>
      )}

      <section className="blog-pagination mt-12">
        <div className="flex justify-center gap-2">
          <a
            href="#"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            上一页
          </a>
          <a href="#" className="px-4 py-2 bg-teal-600 text-white rounded-md">
            1
          </a>
          <a href="#" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
            下一页
          </a>
        </div>
      </section>
    </main>
  );
}
