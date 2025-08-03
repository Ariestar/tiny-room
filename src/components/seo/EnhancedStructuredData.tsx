/**
 * 增强的结构化数据组件
 * Enhanced Structured Data Component for SEO
 */

import { baseSEOConfig } from '@/lib/system/seo/seo';

interface FAQItem {
    question: string;
    answer: string;
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface TechArticleData {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    tags?: string[];
    readingTime?: string;
    technicalLevel?: "beginner" | "intermediate" | "advanced";
    codeExamples?: string[];
    prerequisites?: string[];
    learningOutcomes?: string[];
    programmingLanguages?: string[];
}

interface StructuredDataProps {
    type: "website" | "article" | "person" | "organization" | "faq" | "breadcrumb" | "techarticle";
    data: {
        title?: string;
        description?: string;
        url?: string;
        image?: string;
        datePublished?: string;
        dateModified?: string;
        author?: {
            name: string;
            url?: string;
            jobTitle?: string;
            knowsAbout?: string[];
        };
        publisher?: {
            name: string;
            logo?: string;
        };
        // FAQ 特有数据
        faqItems?: FAQItem[];
        // 面包屑特有数据
        breadcrumbs?: BreadcrumbItem[];
        // 技术文章特有数据
        techArticle?: TechArticleData;
        // 通用扩展字段
        tags?: string[];
        category?: string;
        keywords?: string[];
    };
}

export function StructuredData({ type, data }: StructuredDataProps) {
    const generateSchema = () => {
        const getSchemaType = () => {
            switch (type) {
                case "website": return "WebSite";
                case "article": return "BlogPosting";
                case "person": return "Person";
                case "organization": return "Organization";
                case "faq": return "FAQPage";
                case "breadcrumb": return "BreadcrumbList";
                case "techarticle": return ["BlogPosting", "TechArticle"];
                default: return "Thing";
            }
        };

        const baseSchema = {
            "@context": "https://schema.org",
            "@type": getSchemaType(),
        };

        switch (type) {
            case "website":
                return {
                    ...baseSchema,
                    name: data.title || baseSEOConfig.siteName,
                    description: data.description || baseSEOConfig.siteDescription,
                    url: data.url || baseSEOConfig.siteUrl,
                    potentialAction: {
                        "@type": "SearchAction",
                        target: {
                            "@type": "EntryPoint",
                            urlTemplate: `${baseSEOConfig.siteUrl}/search?q={search_term_string}`,
                        },
                        "query-input": "required name=search_term_string",
                    },
                    publisher: {
                        "@type": "Organization",
                        name: baseSEOConfig.siteName,
                        logo: {
                            "@type": "ImageObject",
                            url: `${baseSEOConfig.siteUrl}/logo.png`,
                        },
                    },
                };

            case "article":
                return {
                    ...baseSchema,
                    headline: data.title,
                    description: data.description,
                    url: data.url,
                    datePublished: data.datePublished,
                    dateModified: data.dateModified || data.datePublished,
                    author: {
                        "@type": "Person",
                        name: data.author?.name || baseSEOConfig.author.name,
                        url: data.author?.url || baseSEOConfig.author.url,
                        jobTitle: data.author?.jobTitle || "Full Stack Developer",
                        ...(data.author?.knowsAbout && { knowsAbout: data.author.knowsAbout }),
                    },
                    publisher: {
                        "@type": "Organization",
                        name: data.publisher?.name || baseSEOConfig.siteName,
                        logo: {
                            "@type": "ImageObject",
                            url: data.publisher?.logo || `${baseSEOConfig.siteUrl}/logo.png`,
                        },
                    },
                    image: data.image,
                    ...(data.tags && { keywords: data.tags.join(", ") }),
                    ...(data.category && { articleSection: data.category }),
                    mainEntityOfPage: {
                        "@type": "WebPage",
                        "@id": data.url,
                    },
                };

            case "techarticle":
                const techData = data.techArticle!;
                return {
                    ...baseSchema,
                    headline: techData.title,
                    description: techData.description,
                    url: techData.url,
                    datePublished: techData.datePublished,
                    dateModified: techData.dateModified || techData.datePublished,
                    author: {
                        "@type": "Person",
                        name: data.author?.name || baseSEOConfig.author.name,
                        url: data.author?.url || baseSEOConfig.author.url,
                        jobTitle: "Full Stack Developer",
                        knowsAbout: techData.tags || [],
                    },
                    publisher: {
                        "@type": "Organization",
                        name: baseSEOConfig.siteName,
                        logo: {
                            "@type": "ImageObject",
                            url: `${baseSEOConfig.siteUrl}/logo.png`,
                        },
                    },
                    // 技术文章特有字段
                    ...(techData.programmingLanguages && { programmingLanguage: techData.programmingLanguages }),
                    ...(techData.codeExamples && techData.codeExamples.length > 0 && {
                        codeRepository: {
                            "@type": "SoftwareSourceCode",
                            codeRepository: baseSEOConfig.author.social.github,
                            programmingLanguage: techData.programmingLanguages?.[0] || techData.tags?.[0],
                        },
                    }),
                    ...(techData.learningOutcomes && { teaches: techData.learningOutcomes }),
                    ...(techData.prerequisites && { coursePrerequisites: techData.prerequisites }),
                    ...(techData.technicalLevel && { educationalLevel: techData.technicalLevel }),
                    ...(techData.readingTime && {
                        timeRequired: `PT${techData.readingTime.replace(/\D/g, '')}M`
                    }),
                    keywords: techData.tags?.join(", ") || "",
                    mainEntityOfPage: {
                        "@type": "WebPage",
                        "@id": techData.url,
                    },
                };

            case "person":
                return {
                    ...baseSchema,
                    name: data.author?.name || baseSEOConfig.author.name,
                    url: data.author?.url || baseSEOConfig.author.url,
                    jobTitle: data.author?.jobTitle || "Full Stack Developer",
                    worksFor: {
                        "@type": "Organization",
                        name: baseSEOConfig.siteName,
                        url: baseSEOConfig.siteUrl,
                    },
                    ...(data.author?.knowsAbout && { knowsAbout: data.author.knowsAbout }),
                    sameAs: [
                        baseSEOConfig.author.social.github,
                        baseSEOConfig.author.social.twitter,
                        baseSEOConfig.author.social.linkedin,
                    ].filter(Boolean),
                };

            case "organization":
                return {
                    ...baseSchema,
                    name: baseSEOConfig.siteName,
                    url: baseSEOConfig.siteUrl,
                    logo: {
                        "@type": "ImageObject",
                        url: `${baseSEOConfig.siteUrl}/logo.png`,
                    },
                    description: baseSEOConfig.siteDescription,
                    founder: {
                        "@type": "Person",
                        name: baseSEOConfig.author.name,
                        url: baseSEOConfig.author.url,
                    },
                    sameAs: [
                        baseSEOConfig.author.social.github,
                        baseSEOConfig.author.social.twitter,
                        baseSEOConfig.author.social.linkedin,
                    ].filter(Boolean),
                };

            case "faq":
                if (!data.faqItems || data.faqItems.length === 0) {
                    return baseSchema;
                }
                return {
                    ...baseSchema,
                    mainEntity: data.faqItems.map((item) => ({
                        "@type": "Question",
                        name: item.question,
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: item.answer,
                        },
                    })),
                };

            case "breadcrumb":
                if (!data.breadcrumbs || data.breadcrumbs.length === 0) {
                    return baseSchema;
                }
                return {
                    ...baseSchema,
                    itemListElement: data.breadcrumbs.map((item, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        name: item.name,
                        item: item.url,
                    })),
                };

            default:
                return baseSchema;
        }
    };

    const schema = generateSchema();

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema),
            }}
        />
    );
}

// 便捷的专用组件
export function WebsiteStructuredData(props: {
    title?: string;
    description?: string;
    url?: string;
}) {
    return <StructuredData type="website" data={props} />;
}

export function ArticleStructuredData(props: {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    tags?: string[];
    category?: string;
    image?: string;
}) {
    return <StructuredData type="article" data={props} />;
}

export function TechArticleStructuredData(props: {
    techArticle: TechArticleData;
    author?: {
        name: string;
        url?: string;
        knowsAbout?: string[];
    };
}) {
    return <StructuredData type="techarticle" data={props} />;
}

export function FAQStructuredData(props: { faqItems: FAQItem[] }) {
    return <StructuredData type="faq" data={props} />;
}

export function BreadcrumbStructuredData(props: { breadcrumbs: BreadcrumbItem[] }) {
    return <StructuredData type="breadcrumb" data={props} />;
}

export function PersonStructuredData(props: {
    author?: {
        name: string;
        url?: string;
        jobTitle?: string;
        knowsAbout?: string[];
    };
}) {
    return <StructuredData type="person" data={props} />;
}

export function OrganizationStructuredData() {
    return <StructuredData type="organization" data={{}} />;
}

// 导出类型定义供其他组件使用
export type { FAQItem, BreadcrumbItem, TechArticleData };