# 网站流量增长策略 - 设计文档

## 概述

本设计文档基于已确认的 10 个核心需求，提供了一套完整的技术实现方案。设计充分利用现有的 Next.js 15 + TypeScript + Tailwind CSS 技术栈，以及已有的 SEO 基础设施，通过渐进式优化实现短期内的流量增长目标。

## 架构设计

### 系统架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                    前端展示层 (Next.js 15)                    │
├─────────────────────────────────────────────────────────────┤
│  博客页面优化  │  社交分享  │  移动端导航  │  RSS订阅        │
│  - SEO元数据   │  - 分享按钮 │  - 响应式UI  │  - Feed生成     │
│  - 结构化数据  │  - OG优化  │  - 触控优化  │  - 自动更新     │
├─────────────────────────────────────────────────────────────┤
│                    业务逻辑层 (API Routes)                    │
├─────────────────────────────────────────────────────────────┤
│  SEO服务      │  分享统计   │  用户反馈    │  RSS生成        │
│  - 元数据生成  │  - 分享追踪 │  - 搜索分析  │  - Feed API     │
│  - Schema生成 │  - 数据统计 │  - FAQ管理   │  - 订阅统计     │
├─────────────────────────────────────────────────────────────┤
│                    数据存储层                                │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL   │  Upstash Redis │  文件系统    │  外部服务     │
│  - 用户数据    │  - 浏览统计    │  - Markdown  │  - CDN        │
│  - 评论数据    │  - 分享统计    │  - 图片资源  │  - 图片优化   │
└─────────────────────────────────────────────────────────────┘
```

### 核心组件架构

基于现有项目结构，新组件将按以下方式组织：

```typescript
// 组件层次结构（基于现有项目结构）
src/
├── components/
│   ├── seo/                    // SEO优化组件（已存在，需扩展）
│   │   └── StructuredData.tsx  // 已存在，需增强
│   ├── feature/
│   │   ├── blog/              // 博客功能组件（已存在）
│   │   │   ├── SocialShare.tsx     // 新增：社交分享
│   │   │   ├── RelatedPosts.tsx    // 新增：相关文章推荐
│   │   │   ├── FAQ.tsx             // 新增：FAQ系统
│   │   │   ├── RSSSubscribe.tsx    // 新增：RSS订阅
│   │   │   └── BlogPreview.tsx     // 已存在，可复用
│   │   └── search/            // 搜索功能（已存在，可复用）
│   │       ├── Search.tsx          // 已存在
│   │       ├── SearchModal.tsx     // 已存在
│   │       └── SearchButton.tsx    // 已存在
│   ├── layout/                // 布局组件（已存在）
│   │   ├── Navigation.tsx          // 已存在，需移动端优化
│   │   └── MobileOptimizedContainer.tsx // 已存在，可复用
│   └── ui/                    // 基础UI组件（已存在，可复用）
│       ├── Card.tsx               // 已存在，可复用
│       ├── Button.tsx             // 已存在，可复用
│       ├── OptimizedImage.tsx     // 已存在，需增强
│       └── ViewCounter.tsx        // 已存在，可复用
├── lib/
│   ├── system/seo/            // SEO工具库（已存在，需扩展）
│   ├── shared/utils.ts        // 通用工具（已存在，可复用）
│   └── data/                  // 数据处理（已存在）
└── app/
    ├── api/
    │   ├── analytics/         // 分析API（已存在，可扩展）
    │   ├── search/            // 搜索API（已存在）
    │   └── rss/               // RSS API（新增）
    └── (public)/
        ├── blog/              // 博客页面（已存在，需优化）
        └── rss.xml            // RSS Feed（新增）
```

### 可复用的现有组件

项目中已有丰富的组件库，可以直接复用：

**UI 组件库：**

- `Card` 系列：Card, CreativeCard, StatCard
- `Button`：支持多种变体和动画
- `Input`：表单输入组件
- `Loading`：加载状态组件
- `OptimizedImage`：图片优化组件（需增强 SEO 功能）

**功能组件：**

- `Search` 系列：Search, SearchModal, SearchButton
- `BlogPreview`：博客预览组件
- `ViewCounter`：浏览量统计
- `Navigation`：导航组件（需移动端优化）

**动画组件：**

- `ScrollReveal`：滚动动画
- `AnimatedDiv`：通用动画容器
- `PageTransition`：页面过渡动画

**工具函数：**

- `cn()`：className 合并工具
- `formatFileSize`、`formatNumber`：格式化工具
- `debounce`、`throttle`：性能优化工具

## 详细设计

### 1. 博客文章 SEO 深度优化

#### 技术实现方案

**1.1 增强的元数据生成系统**

```typescript
// src/lib/seo/enhanced-metadata.ts
interface EnhancedSEOConfig extends SEOConfig {
  readingTime?: string;
  wordCount?: number;
  lastModified?: string;
  relatedKeywords?: string[];
  contentCategory?: string;
  technicalLevel?: "beginner" | "intermediate" | "advanced";
}

export function generateEnhancedMetadata(config: EnhancedSEOConfig): Metadata {
  // 基于现有SEO工具库扩展
  const baseMetadata = generateMetadata(config);

  return {
    ...baseMetadata,
    // 增强的关键词策略
    keywords: [
      ...config.keywords,
      ...config.relatedKeywords,
      `${config.contentCategory} 教程`,
      `${config.technicalLevel} 级别`,
    ].join(", "),

    // 更丰富的描述
    description: generateSmartDescription(config),

    // 增强的Open Graph
    openGraph: {
      ...baseMetadata.openGraph,
      article: {
        publishedTime: config.publishedTime,
        modifiedTime: config.lastModified,
        section: config.contentCategory,
        tags: config.relatedKeywords,
      },
    },
  };
}
```

**1.2 结构化数据增强**

```typescript
// src/lib/seo/structured-data.ts
export function generateBlogPostingSchema(post: PostData) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.featuredImage,
    author: {
      "@type": "Person",
      name: "Tiny Room",
      url: "https://tinyroom.dev/about",
      sameAs: [
        "https://github.com/your-github",
        "https://twitter.com/your-twitter",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Tiny Room",
      logo: {
        "@type": "ImageObject",
        url: "https://tinyroom.dev/logo.png",
      },
    },
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tinyroom.dev/blog/${post.slug}`,
    },
    // 技术文章特有的结构化数据
    about: post.tags.map((tag) => ({
      "@type": "Thing",
      name: tag,
    })),
    // 阅读时间和难度级别
    timeRequired: `PT${post.readingTime}M`,
    educationalLevel: post.technicalLevel,
    // FAQ结构化数据（如果文章包含FAQ）
    ...(post.faq && {
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    }),
  };
}
```

#### 组件设计

**1.3 增强的博客页面组件**

```typescript
// src/app/(public)/blog/[slug]/page.tsx (优化版)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const decodedSlug = decodeURIComponent((await params).slug);
  const post = await getPostBySlug(decodedSlug);

  if (!post) {
    return notFound();
  }

  // 使用增强的元数据生成
  return generateEnhancedMetadata({
    title: post.title,
    description: generateSmartDescription(post),
    keywords: extractKeywordsFromContent(post.content),
    relatedKeywords: await getRelatedKeywords(post.tags),
    readingTime: post.readingTime,
    lastModified: post.modifiedDate,
    contentCategory: post.primaryTag,
    technicalLevel: determineTechnicalLevel(post.content),
    url: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.modifiedDate,
  });
}
```

### 2. 图片 SEO 和媒体优化

#### 技术实现方案

**2.1 智能图片优化系统**

```typescript
// src/lib/media/image-seo.ts
interface ImageSEOConfig {
  src: string;
  alt?: string;
  title?: string;
  context?: string; // 图片所在的内容上下文
  articleTitle?: string;
  tags?: string[];
}

export function generateImageSEO(config: ImageSEOConfig) {
  return {
    // 智能生成alt标签
    alt: config.alt || generateSmartAlt(config),
    // SEO友好的title属性
    title: config.title || `${config.articleTitle} - ${config.context}`,
    // 结构化数据
    schema: {
      "@type": "ImageObject",
      url: config.src,
      description: config.alt,
      contentUrl: config.src,
      // 图片相关的关键词
      keywords: config.tags?.join(", "),
    },
  };
}

function generateSmartAlt(config: ImageSEOConfig): string {
  // 基于上下文智能生成alt标签
  const contextKeywords = extractKeywordsFromContext(config.context);
  return `${config.articleTitle}相关的${contextKeywords.join("、")}示例图片`;
}
```

**2.2 图片优化组件（增强现有组件）**

基于现有的 `src/components/ui/OptimizedImage.tsx`，增加 SEO 功能：

```typescript
// 增强现有的 src/components/ui/OptimizedImage.tsx
interface EnhancedOptimizedImageProps extends OptimizedImageProps {
  context?: string;
  articleTitle?: string;
  seoAlt?: string;
}

export function OptimizedImage({
  src,
  alt,
  context,
  articleTitle,
  seoAlt,
  priority = false,
  className,
  ...props
}: EnhancedOptimizedImageProps) {
  // 复用现有的图片优化逻辑
  const imageSEO = generateImageSEO({
    src,
    alt: seoAlt || alt,
    context,
    articleTitle,
  });

  return (
    <div className="relative">
      {/* 复用现有的OptimizedImage组件逻辑 */}
      <Image
        src={src}
        alt={imageSEO.alt}
        title={imageSEO.title}
        priority={priority}
        className={cn("rounded-lg", className)}
        placeholder="blur"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />

      {/* 新增：结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageSEO.schema),
        }}
      />
    </div>
  );
}
```

### 3. 内部链接网络建设

#### 技术实现方案

**3.1 智能相关文章推荐系统**

该系统可用于博客详情页和首页博客区域，提供智能的文章推荐：

```typescript
// src/lib/content/related-posts.ts
interface RelatedPostsConfig {
  currentPost?: PostData; // 可选，用于博客详情页
  allPosts: PostData[];
  maxResults?: number;
  context?: "detail" | "homepage"; // 使用场景
}

export function getRelatedPosts({
  currentPost,
  allPosts,
  maxResults = 5,
  context = "detail",
}: RelatedPostsConfig): PostData[] {
  if (context === "homepage") {
    // 首页场景：推荐热门和最新文章
    return allPosts
      .map((post) => ({
        ...post,
        relevanceScore: calculateHomepageScore(post),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  // 博客详情页场景：基于当前文章推荐相关文章
  return allPosts
    .filter((post) => post.slug !== currentPost!.slug)
    .map((post) => ({
      ...post,
      relevanceScore: calculateRelevanceScore(currentPost!, post),
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}

function calculateRelevanceScore(
  current: PostData,
  candidate: PostData
): number {
  let score = 0;

  // 标签相似度 (权重: 40%)
  const commonTags = current.tags.filter((tag) => candidate.tags.includes(tag));
  score +=
    (commonTags.length / Math.max(current.tags.length, candidate.tags.length)) *
    0.4;

  // 内容相似度 (权重: 30%)
  const contentSimilarity = calculateContentSimilarity(
    current.content,
    candidate.content
  );
  score += contentSimilarity * 0.3;

  // 发布时间相近度 (权重: 20%)
  const timeSimilarity = calculateTimeSimilarity(
    current.publishedDate,
    candidate.publishedDate
  );
  score += timeSimilarity * 0.2;

  // 阅读量相似度 (权重: 10%)
  const popularitySimilarity = calculatePopularitySimilarity(
    current.views,
    candidate.views
  );
  score += popularitySimilarity * 0.1;

  return score;
}

function calculateHomepageScore(post: PostData): number {
  let score = 0;

  // 发布时间新鲜度 (权重: 40%)
  const daysSincePublished = Math.floor(
    (Date.now() - new Date(post.publishedDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const freshnessScore = Math.max(0, 1 - daysSincePublished / 30); // 30天内为新鲜
  score += freshnessScore * 0.4;

  // 浏览量热度 (权重: 35%)
  const viewsScore = Math.min(1, (post.views || 0) / 1000); // 1000浏览量为满分
  score += viewsScore * 0.35;

  // 内容质量指标 (权重: 25%)
  const qualityScore =
    (post.wordCount > 500 ? 0.3 : 0) + // 长文章加分
    (post.tags.length >= 3 ? 0.3 : 0) + // 标签丰富度
    (post.description ? 0.4 : 0); // 有描述加分
  score += qualityScore * 0.25;

  return score;
}
```

**3.2 面包屑导航组件**

新增组件，位置：`src/components/layout/BreadcrumbNav.tsx`

```typescript
// src/components/layout/BreadcrumbNav.tsx
interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://tinyroom.dev${item.href}`,
    })),
  };

  return (
    <>
      <nav
        className={cn("flex items-center space-x-2 text-sm", className)}
        aria-label="面包屑导航"
      >
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
            )}
            {item.isCurrentPage ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
```

### 4. Core Web Vitals 性能优化

#### 技术实现方案

**4.1 性能监控和优化系统**

```typescript
// src/lib/performance/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

export function initWebVitalsTracking() {
  // 监控所有Core Web Vitals指标
  getCLS(onPerfEntry);
  getFID(onPerfEntry);
  getFCP(onPerfEntry);
  getLCP(onPerfEntry);
  getTTFB(onPerfEntry);
}

function onPerfEntry(metric: WebVitalsMetric) {
  // 发送到分析服务
  sendToAnalytics({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    url: window.location.pathname,
    timestamp: Date.now(),
  });

  // 开发环境下的性能警告
  if (process.env.NODE_ENV === "development") {
    console.log(`${metric.name}: ${metric.value} (${metric.rating})`);

    if (metric.rating === "poor") {
      console.warn(`⚠️ Poor ${metric.name} performance detected!`);
    }
  }
}
```

**4.2 图片懒加载优化（增强现有组件）**

基于现有的 `src/components/ui/OptimizedImage.tsx` 和 `src/hooks/useInView.ts`：

```typescript
// 增强现有的图片组件，复用现有的懒加载逻辑
// 可以直接使用现有的 OptimizedImage 组件，它已经包含了懒加载功能
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

export function LazyImage({
  src,
  alt,
  className,
  priority = false,
  onLoad,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // 提前50px开始加载
      }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const shouldLoad = priority || isInView;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* 占位符 */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}

      {/* 实际图片 */}
      {shouldLoad && (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          priority={priority}
        />
      )}
    </div>
  );
}
```

### 5. 社交分享和传播优化

#### 技术实现方案

**5.1 社交分享组件系统**

新增组件，位置：`src/components/feature/blog/SocialShare.tsx`

```typescript
// src/components/feature/blog/SocialShare.tsx
// 复用现有的Button组件和动画组件
import { Button } from "@/components/ui";
import { AnimatedDiv } from "@/components/animation";

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
  hashtags?: string[];
  className?: string;
}

export function ShareButtons({
  url,
  title,
  description,
  hashtags = [],
  className,
}: ShareButtonsProps) {
  const shareData = {
    url: `https://tinyroom.dev${url}`,
    title,
    text: description,
    hashtags: hashtags.join(","),
  };

  const shareConfigs = [
    {
      name: "Twitter",
      icon: Twitter,
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(shareData.url)}&hashtags=${
        shareData.hashtags
      }`,
      color: "hover:bg-blue-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareData.url
      )}`,
      color: "hover:bg-blue-700",
    },
    {
      name: "微博",
      icon: MessageCircle,
      shareUrl: `https://service.weibo.com/share/share.php?title=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(shareData.url)}`,
      color: "hover:bg-red-500",
    },
  ];

  const handleShare = async (platform: string, shareUrl: string) => {
    // 记录分享事件
    await trackShareEvent({
      platform,
      url: shareData.url,
      title,
      timestamp: Date.now(),
    });

    // 打开分享窗口
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="text-sm text-muted-foreground">分享到：</span>
      {shareConfigs.map((config) => (
        <button
          key={config.name}
          onClick={() => handleShare(config.name, config.shareUrl)}
          className={cn(
            "p-2 rounded-full transition-colors",
            "hover:text-white",
            config.color
          )}
          aria-label={`分享到${config.name}`}
        >
          <config.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
```

**5.2 分享数据追踪系统**

```typescript
// src/lib/analytics/share-tracking.ts
interface ShareEvent {
  platform: string;
  url: string;
  title: string;
  timestamp: number;
  userAgent?: string;
  referrer?: string;
}

export async function trackShareEvent(event: ShareEvent) {
  try {
    await fetch("/api/analytics/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...event,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      }),
    });
  } catch (error) {
    console.error("Failed to track share event:", error);
  }
}

// API路由实现
// src/app/api/analytics/share/route.ts
export async function POST(request: NextRequest) {
  try {
    const shareEvent = await request.json();

    // 存储到Redis
    const shareKey = `share:${shareEvent.platform}:${shareEvent.url}`;
    await redis.incr(shareKey);

    // 存储详细数据
    const detailKey = `share_detail:${Date.now()}`;
    await redis.setex(detailKey, 86400 * 30, JSON.stringify(shareEvent)); // 保存30天

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to track share" },
      { status: 500 }
    );
  }
}
```

## 数据模型设计

### 扩展的内容数据模型

```typescript
// src/lib/types/content.ts
interface EnhancedPostData extends PostData {
  // SEO相关
  metaKeywords: string[];
  relatedKeywords: string[];
  technicalLevel: "beginner" | "intermediate" | "advanced";
  contentCategory: string;

  // 社交分享相关
  shareCount: {
    twitter: number;
    linkedin: number;
    weibo: number;
    total: number;
  };

  // 用户反馈相关
  faq?: FAQItem[];
  userQuestions: string[];

  // 性能相关
  imageCount: number;
  wordCount: number;
  estimatedReadTime: number;

  // 内部链接相关
  relatedPosts: string[]; // post slugs
  internalLinks: InternalLink[];
  backlinks: BacklinkData[];
}

interface FAQItem {
  question: string;
  answer: string;
  isFromUserFeedback: boolean;
  popularity: number;
}

interface InternalLink {
  targetSlug: string;
  anchorText: string;
  context: string;
  relevanceScore: number;
}

interface BacklinkData {
  sourceSlug: string;
  anchorText: string;
  linkStrength: number;
}
```

### 分析数据模型

```typescript
// src/lib/types/analytics.ts
interface SEOAnalytics {
  // 页面性能数据
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
  };

  // 搜索相关数据
  searchQueries: {
    query: string;
    count: number;
    clickThrough: number;
    noResults: boolean;
  }[];

  // 社交分享数据
  shareMetrics: {
    platform: string;
    shares: number;
    clicks: number;
    engagement: number;
  }[];

  // 用户反馈数据
  userFeedback: {
    searchFailures: string[];
    commonQuestions: string[];
    contentRequests: string[];
  };
}
```

## 错误处理策略

### 渐进式增强策略

```typescript
// src/lib/utils/progressive-enhancement.ts
export function withFallback<T>(
  enhancedFunction: () => Promise<T>,
  fallbackFunction: () => T,
  errorHandler?: (error: Error) => void
): Promise<T> {
  return enhancedFunction().catch((error) => {
    errorHandler?.(error);
    return fallbackFunction();
  });
}

// 使用示例
const relatedPosts = await withFallback(
  () => getAIGeneratedRelatedPosts(currentPost),
  () => getBasicRelatedPosts(currentPost),
  (error) =>
    console.warn("AI related posts failed, using basic algorithm:", error)
);
```

### 性能降级策略

```typescript
// src/lib/performance/adaptive-loading.ts
export function getOptimizationLevel(): "high" | "medium" | "low" {
  // 基于网络状况和设备性能决定优化级别
  const connection = (navigator as any).connection;
  const deviceMemory = (navigator as any).deviceMemory;

  if (connection?.effectiveType === "4g" && deviceMemory >= 4) {
    return "high";
  } else if (connection?.effectiveType === "3g" || deviceMemory >= 2) {
    return "medium";
  } else {
    return "low";
  }
}

export function adaptiveImageLoading(level: "high" | "medium" | "low") {
  switch (level) {
    case "high":
      return { format: "webp", quality: 90, lazyThreshold: "50px" };
    case "medium":
      return { format: "webp", quality: 75, lazyThreshold: "100px" };
    case "low":
      return { format: "jpeg", quality: 60, lazyThreshold: "200px" };
  }
}
```

## 实施优先级

基于现有项目结构和可复用组件，建议按以下优先级实施：

### 第一阶段：SEO 基础优化（复用现有组件）

1. 增强现有的 `src/lib/system/seo/seo.ts` 工具库
2. 优化现有的 `src/components/seo/StructuredData.tsx` 组件
3. 增强现有的 `src/components/ui/OptimizedImage.tsx` 组件

### 第二阶段：新功能组件开发

1. 社交分享：`src/components/feature/blog/SocialShare.tsx`
2. 智能相关文章推荐：`src/components/feature/blog/RelatedPosts.tsx`
   - 支持博客详情页的相关文章推荐
   - 支持首页博客区域的智能推荐（基于热度和新鲜度）
3. 面包屑导航：`src/components/layout/BreadcrumbNav.tsx`

### 第三阶段：用户体验优化

1. 移动端导航优化（基于现有 Navigation 组件）
2. FAQ 系统：`src/components/feature/blog/FAQ.tsx`
3. RSS 订阅：`src/components/feature/blog/RSSSubscribe.tsx`

### 第四阶段：分析和监控

1. 扩展现有的 `src/app/api/analytics/` API
2. 增强现有的 `src/components/ui/ViewCounter.tsx` 组件
3. 性能监控集成

这个设计文档充分利用了现有的技术栈和组件库，通过渐进式优化和组件复用，实现短期内的 SEO 效果提升。每个新组件都明确了在项目中的位置，并指出了可以复用的现有资源。
