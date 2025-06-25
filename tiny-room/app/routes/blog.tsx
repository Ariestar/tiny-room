export default function Blog() {
  // 在实际应用中，这些数据会从API或数据文件中获取
  const blogPosts = [
    {
      id: 'getting-started-with-react',
      title: 'React入门指南',
      excerpt: '学习React的基础知识，从组件、props到状态管理。',
      date: '2023-06-15',
      author: '张三',
      tags: ['React', '前端', '教程'],
      category: '编程',
      coverImage: 'https://picsum.photos/seed/react/800/450',
    },
    {
      id: 'css-grid-explained',
      title: 'CSS Grid详解',
      excerpt: '深入了解CSS Grid布局系统，掌握现代网页布局技术。',
      date: '2023-05-22',
      author: '李四',
      tags: ['CSS', '前端', '布局'],
      category: '设计',
      coverImage: 'https://picsum.photos/seed/css/800/450',
    },
    {
      id: 'typescript-best-practices',
      title: 'TypeScript最佳实践',
      excerpt: '提高代码质量的TypeScript技巧和模式。',
      date: '2023-04-10',
      author: '王五',
      tags: ['TypeScript', '前端', '最佳实践'],
      category: '编程',
      coverImage: 'https://picsum.photos/seed/typescript/800/450',
    },
  ];

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
          <a
            href="#"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
          >
            编程
          </a>
          <a
            href="#"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
          >
            设计
          </a>
          <a
            href="#"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
          >
            思考
          </a>
        </div>
      </section>

      <section className="blog-posts">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <article
              key={post.id}
              className="blog-post-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <a href={`/blog/${post.id}`} className="block">
                <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" />
              </a>
              <div className="p-4">
                <div className="flex gap-2 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <a href={`/blog/${post.id}`} className="block">
                  <h2 className="text-xl font-semibold mb-2 hover:text-teal-600">{post.title}</h2>
                </a>

                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

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
            2
          </a>
          <a href="#" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
            3
          </a>
          <a href="#" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
            下一页
          </a>
        </div>
      </section>
    </main>
  );
}
