/**
 * 结构化数据组件
 * Structured Data Component for SEO
 */

import { generateStructuredData } from '@/lib/seo/seo';

interface StructuredDataProps {
    data: Parameters<typeof generateStructuredData>[0];
}

/**
 * 结构化数据组件
 * 将结构化数据注入到页面头部
 */
export function StructuredData({ data }: StructuredDataProps) {
    const structuredData = generateStructuredData(data);

    return (
        <>
            {structuredData.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema, null, 2)
                    }}
                />
            ))}
        </>
    );
}

/**
 * 主页结构化数据
 */
export function HomepageStructuredData() {
    return (
        <StructuredData
            data={{
                title: "Tiny Room",
                description: "一个有趣且富有个性的个人博客空间，展现创意与技术的完美融合",
                url: "/",
                image: "/images/og-homepage.jpg",
                type: "website",
                breadcrumbs: [
                    { name: "首页", url: "/" }
                ]
            }}
        />
    );
}

/**
 * 博客文章结构化数据
 */
export function BlogPostStructuredData({
    title,
    description,
    slug,
    publishedTime,
    modifiedTime,
    tags = []
}: {
    title: string;
    description: string;
    slug: string;
    publishedTime: string;
    modifiedTime?: string;
    tags?: string[];
}) {
    return (
        <StructuredData
            data={{
                title,
                description,
                url: `/blog/${slug}`,
                type: "article",
                publishedTime,
                modifiedTime,
                tags,
                breadcrumbs: [
                    { name: "首页", url: "/" },
                    { name: "博客", url: "/blog" },
                    { name: title, url: `/blog/${slug}` }
                ]
            }}
        />
    );
}

/**
 * 项目页面结构化数据
 */
export function ProjectStructuredData({
    title,
    description,
    id
}: {
    title: string;
    description: string;
    id: string;
}) {
    return (
        <StructuredData
            data={{
                title,
                description,
                url: `/projects/${id}`,
                type: "website",
                breadcrumbs: [
                    { name: "首页", url: "/" },
                    { name: "项目", url: "/projects" },
                    { name: title, url: `/projects/${id}` }
                ]
            }}
        />
    );
}