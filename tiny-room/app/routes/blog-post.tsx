import { useParams } from 'react-router';
import { useState, useEffect } from 'react';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);

  // 模拟博客文章数据（实际应用中会从API或数据文件中获取）
  const [post, setPost] = useState({
    id: 'getting-started-with-react',
    title: 'React入门指南',
    content: `
# React入门指南

React是一个用于构建用户界面的JavaScript库。它由Facebook开发，并于2013年开源。React让开发者可以创建大型应用，这些应用可以改变数据而无需重新加载页面。

## 为什么选择React？

- **组件化开发**：React的核心思想是将UI拆分为独立、可复用的组件。
- **虚拟DOM**：React使用虚拟DOM提高性能。
- **单向数据流**：使应用中的数据流向更加清晰可预测。
- **强大的生态系统**：有大量的第三方库和工具支持。

## 基础概念

### 组件

组件是React应用的基石。一个组件可以是一个按钮、一个表单、一个对话框，甚至是整个页面。

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

### Props

Props是React组件的输入。它们是从父组件传递给子组件的数据。

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return <Welcome name="Sara" />;
}
\`\`\`

### State

State是组件的内部状态，可以随时间变化。

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## 开始使用React

要开始使用React，你可以使用Create React App工具：

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

或者使用更现代的工具如Vite：

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

## 结论

React是一个强大而灵活的库，可以帮助你构建复杂的用户界面。通过掌握组件、props和state等基础概念，你已经可以开始构建自己的React应用了。

随着你对React的深入学习，你还可以探索更多高级主题，如Hooks、Context API、Redux等。
    `,
    date: '2023-06-15',
    author: '张三',
    tags: ['React', '前端', '教程'],
    category: '编程',
    coverImage: 'https://picsum.photos/seed/react/800/450',
    readTime: 8,
  });

  useEffect(() => {
    // 模拟加载数据
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <main className="container mx-auto p-4 pt-16">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p>加载中...</p>
        </div>
      </main>
    );
  }

  // 将Markdown格式的内容转换为HTML（简化版，实际应用中应使用marked或其他Markdown解析库）
  const renderContent = () => {
    const lines = post.content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold my-6">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold my-5">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold my-4">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2">
            {line.substring(2)}
          </li>
        );
      } else if (line.startsWith('```')) {
        return null; // 简化处理，忽略代码块
      } else {
        return line ? (
          <p key={index} className="my-3">
            {line}
          </p>
        ) : null;
      }
    });
  };

  return (
    <main className="container mx-auto p-4 pt-16">
      <article className="blog-post max-w-3xl mx-auto">
        <div className="mb-8">
          <a href="/blog" className="text-teal-600 hover:underline mb-4 inline-block">
            ← 返回博客列表
          </a>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="text-sm bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{post.author}</span>
            <span className="mx-2">•</span>
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime} 分钟阅读</span>
          </div>
        </header>

        <div className="blog-cover mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        <div className="blog-content prose prose-lg max-w-none">{renderContent()}</div>

        <div className="blog-author mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">关于作者</h3>
          <p>
            {post.author}是一名资深前端开发者，拥有多年React开发经验。
            热衷于分享技术知识和最佳实践。
          </p>
        </div>

        <div className="blog-related mt-12">
          <h3 className="text-xl font-semibold mb-4">相关文章</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="#" className="block p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-medium hover:text-teal-600">React Hooks完全指南</h4>
              <p className="text-sm text-gray-500 mt-1">深入了解React Hooks的使用方法和最佳实践</p>
            </a>
            <a href="#" className="block p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-medium hover:text-teal-600">构建高性能React应用</h4>
              <p className="text-sm text-gray-500 mt-1">学习优化React应用性能的技巧和工具</p>
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
