import { NextRequest, NextResponse } from "next/server";
import { getSortedPostsData } from "@/lib/data/content/posts";
import { baseSEOConfig } from "@/lib/system/seo/seo";

// RSS feed 缓存
let rssCache: { content: string; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1小时缓存

// 生成RSS XML内容
function generateRSSFeed(posts: any[]): string {
  const siteUrl = baseSEOConfig.siteUrl;
  const buildDate = new Date().toUTCString();

  // 过滤已发布的文章并限制数量
  const publishedPosts = posts
    .filter((post) => post.status === "publish")
    .slice(0, 20); // 限制最新20篇文章

  const rssItems = publishedPosts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();

      // 清理内容，移除HTML标签用于描述
      const description =
        post.content
          .replace(/<[^>]*>/g, "") // 移除HTML标签
          .replace(/\n+/g, " ") // 替换换行为空格
          .trim()
          .slice(0, 300) + "..."; // 限制长度

      // 生成分类标签
      const categories = post.tags
        .map((tag: string) => `    <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${postUrl}</link>
    <guid isPermaLink="true">${postUrl}</guid>
    <description>${escapeXml(description)}</description>
    <pubDate>${pubDate}</pubDate>
    <author>${baseSEOConfig.author.email} (${
        baseSEOConfig.author.name
      })</author>
${categories}
  </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>${escapeXml(baseSEOConfig.siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(baseSEOConfig.siteDescription)}</description>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <language>zh-CN</language>
    <sy:updatePeriod>daily</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>Next.js RSS Generator</generator>
    <managingEditor>${baseSEOConfig.author.email} (${
    baseSEOConfig.author.name
  })</managingEditor>
    <webMaster>${baseSEOConfig.author.email} (${
    baseSEOConfig.author.name
  })</webMaster>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>${escapeXml(baseSEOConfig.siteName)}</title>
      <link>${siteUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
${rssItems}
  </channel>
</rss>`;
}

// XML转义函数
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();

    // 检查缓存
    if (rssCache && now - rssCache.timestamp < CACHE_DURATION) {
      return new NextResponse(rssCache.content, {
        headers: {
          "Content-Type": "application/rss+xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600", // 1小时缓存
        },
      });
    }

    // 获取文章数据
    const posts = getSortedPostsData();

    // 生成RSS内容
    const rssContent = generateRSSFeed(posts);

    // 更新缓存
    rssCache = {
      content: rssContent,
      timestamp: now,
    };

    return new NextResponse(rssContent, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // 1小时缓存
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return NextResponse.json(
      { error: "Failed to generate RSS feed" },
      { status: 500 }
    );
  }
}

// 手动刷新RSS缓存的POST方法
export async function POST(request: NextRequest) {
  try {
    // 清除缓存
    rssCache = null;

    // 重新生成RSS
    const posts = getSortedPostsData();
    const rssContent = generateRSSFeed(posts);

    // 更新缓存
    rssCache = {
      content: rssContent,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      message: "RSS feed cache refreshed",
      itemCount: posts.filter((post) => post.status === "publish").length,
    });
  } catch (error) {
    console.error("Error refreshing RSS cache:", error);
    return NextResponse.json(
      { error: "Failed to refresh RSS cache" },
      { status: 500 }
    );
  }
}
