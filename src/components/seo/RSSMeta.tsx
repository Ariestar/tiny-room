import { baseSEOConfig } from "@/lib/system/seo/seo";

interface RSSMetaProps {
    title?: string;
    description?: string;
}

export function RSSMeta({
    title = baseSEOConfig.siteName,
    description = baseSEOConfig.siteDescription
}: RSSMetaProps) {
    const rssUrl = `${baseSEOConfig.siteUrl}/api/rss`;

    return (
        <>
            {/* RSS Feed 声明 */}
            <link
                rel="alternate"
                type="application/rss+xml"
                title={`${title} - RSS Feed`}
                href={rssUrl}
            />

            {/* Atom Feed 声明（可选） */}
            <link
                rel="alternate"
                type="application/atom+xml"
                title={`${title} - Atom Feed`}
                href={rssUrl}
            />

            {/* RSS 相关的 meta 标签 */}
            <meta name="msapplication-rss" content={rssUrl} />

            {/* 为搜索引擎提供RSS信息 */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={baseSEOConfig.siteUrl} />

            {/* RSS 结构化数据 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": title,
                        "description": description,
                        "url": baseSEOConfig.siteUrl,
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": `${baseSEOConfig.siteUrl}/search?q={search_term_string}`,
                            },
                            "query-input": "required name=search_term_string",
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": baseSEOConfig.siteName,
                            "logo": {
                                "@type": "ImageObject",
                                "url": `${baseSEOConfig.siteUrl}/logo.png`,
                            },
                        },
                        "mainEntity": {
                            "@type": "Blog",
                            "name": `${title} Blog`,
                            "description": description,
                            "url": `${baseSEOConfig.siteUrl}/blog`,
                            "author": {
                                "@type": "Person",
                                "name": baseSEOConfig.author.name,
                                "url": baseSEOConfig.author.url,
                            },
                        },
                        "feed": {
                            "@type": "DataFeed",
                            "name": `${title} RSS Feed`,
                            "url": rssUrl,
                            "encodingFormat": "application/rss+xml",
                        },
                    }),
                }}
            />
        </>
    );
}

// 博客专用的RSS Meta组件
export function BlogRSSMeta() {
    return (
        <RSSMeta
            title={`${baseSEOConfig.siteName} 博客`}
            description="获取最新的技术文章、编程教程和开发经验分享"
        />
    );
}