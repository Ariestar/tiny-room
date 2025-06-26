import { useState } from 'react';
import type { MetaFunction } from 'react-router';
import RichTextEditor from '../components/RichTextEditor';

export const meta: MetaFunction = () => {
  return [
    { title: '富文本编辑器测试 - Tiny Room' },
    { name: 'description', content: '富文本编辑器功能测试页面' },
  ];
};

export default function EditorTest() {
  const [content, setContent] = useState(`
    <h1>富文本编辑器测试</h1>
    <p>这是一个功能完整的富文本编辑器，支持以下功能：</p>
    <ul>
      <li><strong>基础格式</strong>：粗体、斜体、删除线</li>
      <li><strong>标题</strong>：H1-H6 多级标题</li>
      <li><strong>列表</strong>：有序列表和无序列表</li>
      <li><strong>代码</strong>：行内代码和代码块</li>
      <li><strong>链接</strong>：支持添加和编辑链接</li>
      <li><strong>图片</strong>：支持图片上传和插入</li>
    </ul>
    
    <h2>代码高亮示例</h2>
    <pre><code class="language-javascript">// JavaScript 代码示例
function hello(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to Tiny Room, \${name}!\`;
}

// 调用函数
const message = hello("World");
console.log(message);</code></pre>
    
    <h2>引用示例</h2>
    <blockquote>
      <p>这是一个引用块的示例。富文本编辑器可以很好地处理各种格式。</p>
    </blockquote>
    
    <p>你可以在上面的编辑器中尝试各种功能！</p>
  `);

  const [savedContent, setSavedContent] = useState('');

  // 模拟图片上传函数
  const handleImageUpload = async (file: File): Promise<string> => {
    // 这里是模拟上传，实际项目中需要实现真实的上传逻辑
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = () => {
    setSavedContent(content);
    alert('内容已保存！');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">富文本编辑器测试</h1>
          <p className="text-gray-600">
            这是一个基于 Tiptap 的富文本编辑器，支持 Markdown 语法、代码高亮、图片上传等功能。
          </p>
        </header>

        <div className="space-y-6">
          {/* 编辑器 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">编辑器</h2>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="开始写作..."
              onImageUpload={handleImageUpload}
            />
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                保存内容
              </button>
              <button
                onClick={() => setContent('')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                清空内容
              </button>
            </div>
          </div>

          {/* 预览模式 */}
          {savedContent && (
            <div>
              <h2 className="text-xl font-semibold mb-4">保存的内容预览</h2>
              <div className="border rounded-lg p-4 bg-gray-50">
                <RichTextEditor content={savedContent} editable={false} />
              </div>
            </div>
          )}

          {/* HTML源码 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">HTML 源码</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{content}</code>
            </pre>
          </div>

          {/* 功能说明 */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">功能说明</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">格式化功能</h3>
                <ul className="text-sm space-y-1">
                  <li>• 粗体、斜体、删除线</li>
                  <li>• H1-H3 标题</li>
                  <li>• 有序和无序列表</li>
                  <li>• 链接插入和编辑</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">高级功能</h3>
                <ul className="text-sm space-y-1">
                  <li>• 代码块与语法高亮</li>
                  <li>• 图片上传和插入</li>
                  <li>• 撤销/重做操作</li>
                  <li>• 响应式工具栏</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
