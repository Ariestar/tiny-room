# 学习与经验总结

## 2025-07-16: 修复博客文章渲染问题

在将 Obsidian 的 Markdown 文件渲染到 Next.js 页面时，遇到了两个顽固的问题：一个是关于 `params.slug` 的报错，另一个是 LaTeX 公式重复渲染。

### 经验教训

1.  **URL 编码与解码是关键**：当 Next.js 的动态路由`slug`包含中文等非英文字符时，从`params`中获取到的是编码后的字符串。在用于文件查找等操作前，必须使用`decodeURIComponent()`进行解码，否则会导致"文件未找到"的底层错误。

2.  **Next.js 中的误导性错误**：Next.js 中的`params should be awaited`错误有时并非根源，它可能是由其他底层问题（如此次的"文件未找到"）引发的表层症状。排查问题时需审视完整的数据流，而不能只看最终的报错信息。

3.  **修复 LaTeX 重复渲染**：在使用`remark`/`rehype`处理数学公式时，为避免公式和源码重复显示，需要在`unified`管道中对`remark-rehype`插件设置`{ allowDangerousHtml: true }`选项，并紧接着使用`rehype-raw`插件。这确保了 KaTeX 生成的复杂 HTML 能够被正确解析。

### 2025-07-06：解决 Next.js 动态路由中`params`为 Promise 的异步问题

**问题场景：**

在 Next.js App Router 中，对于一个动态路由页面（例如 `/blog/[slug]/page.tsx`），如果同时使用了 `generateStaticParams` 来预生成静态页面，那么在 `page.tsx` 组件及其 `generateMetadata` 函数中接收到的 `params` 对象，在某些情况下可能不是一个普通的对象，而是一个 **Promise**。

之前的代码直接通过 `params.slug` 来访问 slug，这实际上是试图在一个未解析的 Promise 对象上获取属性，导致得到 `undefined`，从而引发一系列难以追踪的异步数据获取失败问题。

**解决方案：**

通过 `await` 关键字，强制代码在访问 `slug` 属性前，必须等待 `params` 这个 Promise 解析完成。

**错误代码示例：**

```typescript
// 在 page.tsx 或 generateMetadata 中
// 这里的 params 实际上是 Promise<{ slug: string }>
const decodedSlug = decodeURIComponent(params.slug); // 错误！params.slug 是 undefined
```

**正确代码示例：**

```typescript
// 在 page.tsx 或 generateMetadata 中
async function Page({ params }: { params: Promise<{ slug: string }> }) {
	// 正确做法：先 await，再访问属性
	const decodedSlug = decodeURIComponent((await params).slug);
	// ... 后续逻辑
}
```

**核心经验：**

当在 Next.js 的动态路由页面中遇到与 `params` 相关的、难以理解的异步问题时，要首先检查 `params` 是否可能是一个 Promise。可以通过 `console.log(params)` 来验证，如果它打印出一个 Promise 对象，那么所有对它的属性访问都必须先使用 `await`。这是 Next.js 为了优化构建过程而采用的一种机制，但同时也容易成为一个开发陷阱。

# 项目经验总结

## 2025-07-07: 主题化重构与 BUG 修复

### 1. 专注重构，避免范围蔓延

在进行大规模重构（如本次颜色系统主题化）时，应保持专注，避免在过程中引入新的功能需求。在重构时尝试添加侧边栏切换功能，不仅分散了注意力，还引入了不相关的错误，最终不得不回滚。这提醒我们，应将重构与新功能开发作为独立的任务分开处理，确保目标清晰。

### 2. TailwindCSS `prose` 插件的正确使用姿势

为 Markdown 渲染的富文本内容应用主题样式是一个常见痛点。本次经验证明，直接在全局 CSS 中覆盖 `.prose` 类往往行不通，正确的解法是：

-   **检查插件是否安装**：最关键也是最容易忽略的一步，是确保 `@tailwindcss/typography` 已经添加到了 `tailwind.config.js` 的 `plugins` 数组中。没有这一步，所有配置都无效。
-   **使用 `theme.extend` 配置**：最可靠的自定义 `prose` 样式的方式是在 `tailwind.config.js` 中通过 `theme.extend.typography` 进行配置。
-   **警惕全局样式覆盖**：务必检查 `globals.css` 中是否存在对 `p`, `h1`, `li` 等裸标签的全局样式定义。这些全局样式会覆盖 `prose` 的预设，导致样式不生效，且极难排查。

### 3. 数据处理必须进行防御性编程

处理外部数据源（如 Markdown 文件的 frontmatter）时，绝对不能想当然地认为所有字段都必然存在。在修复博客文章页时发现，缺失 `title` 或 `date` 会导致页面崩溃或显示 "Invalid Date"。正确的做法是为关键字段提供回退值（fallbacks），例如当 `title` 不存在时使用文件名作为标题，当 `date` 不存在时使用文件的创建时间，从而保证程序的健壮性。

### 4. 客户端组件的状态与动画

在 Next.js App Router 中，处理依赖客户端环境的组件（如主题切换器）时，需要特别注意：

-   **安全处理挂载状态**：为了避免 "hydration mismatch" 错误，必须使用 `useState` 和 `useEffect` 来创建一个 `mounted` 状态，确保依赖 `window` 或 `theme` 的逻辑只在组件挂载到客户端后执行。
-   **优选动画库**：对于依赖状态变化的复杂动画（如旋转、淡入淡出），应优先使用 `framer-motion` 这样的专业动画库，而不是手写 CSS `transition`。它提供了更精细的控制，能更好地处理组件的进入和退出动画，代码也更健壮。
