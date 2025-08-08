/**
 * SEO 优化工具库
 * SEO Optimization Utilities
 */

import { Metadata } from "next";

export interface SEOConfig {
	title: string;
	description: string;
	keywords?: string[];
	author?: string;
	url?: string;
	image?: string;
	type?: "website" | "article" | "profile";
	publishedTime?: string;
	modifiedTime?: string;
	section?: string;
	tags?: string[];
}

/**
 * 网站基础 SEO 配置
 */
export const baseSEOConfig = {
	siteName: "Tiny Room",
	siteDescription: "一个有趣且富有个性的个人博客空间，展现创意与技术的完美融合",
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://tinyroom.dev",
	author: {
		name: "Tiny Room",
		email: "hello@tinyroom.dev",
		url: "https://tinyroom.dev",
		social: {
			twitter: "@tinyroom",
			github: "https://github.com/tinyroom",
			linkedin: "https://linkedin.com/in/tinyroom",
		},
	},
	defaultImage: "/api/og",
	favicon: "/favicon.ico",
	themeColor: "#0070f3",
};

/**
 * 生成动态OG图片URL
 */
export function generateOGImageUrl(config: {
	title: string;
	description?: string;
	tags?: string[];
	type?: string;
}): string {
	const params = new URLSearchParams({
		title: config.title,
		...(config.description && { description: config.description }),
		...(config.tags && config.tags.length > 0 && { tags: config.tags.join(",") }),
		...(config.type && { type: config.type }),
	});

	return `${baseSEOConfig.siteUrl}/api/og?${params.toString()}`;
}

/**
 * 生成页面 Metadata
 */
export function generateMetadata(config: SEOConfig): Metadata {
	const {
		title,
		description,
		keywords = [],
		author = baseSEOConfig.author.name,
		url,
		image = baseSEOConfig.defaultImage,
		type = "website",
		publishedTime,
		modifiedTime,
		section,
		tags = [],
	} = config;

	const fullTitle =
		title === baseSEOConfig.siteName ? title : `${title} | ${baseSEOConfig.siteName}`;

	const fullUrl = url ? `${baseSEOConfig.siteUrl}${url}` : baseSEOConfig.siteUrl;
	const fullImageUrl = image.startsWith("http") ? image : `${baseSEOConfig.siteUrl}${image}`;

	const metadata: Metadata = {
		// 基础元数据
		title: fullTitle,
		description,
		keywords: keywords.join(", "),
		authors: [{ name: author, url: baseSEOConfig.author.url }],
		creator: author,
		publisher: baseSEOConfig.siteName,

		// Open Graph
		openGraph: {
			type,
			title: fullTitle,
			description,
			url: fullUrl,
			siteName: baseSEOConfig.siteName,
			images: [
				{
					url: fullImageUrl,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
			locale: "zh_CN",
			...(publishedTime && { publishedTime }),
			...(modifiedTime && { modifiedTime }),
			...(section && { section }),
			...(tags.length > 0 && { tags }),
		},

		// Twitter Card
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description,
			images: [fullImageUrl],
			creator: baseSEOConfig.author.social.twitter,
			site: baseSEOConfig.author.social.twitter,
		},

		// 其他元数据
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},

		// 图标和主题
		icons: {
			icon: baseSEOConfig.favicon,
			shortcut: baseSEOConfig.favicon,
			apple: "/apple-touch-icon.png",
		},

		// 验证
		verification: {
			google: process.env.GOOGLE_SITE_VERIFICATION,
			yandex: process.env.YANDEX_VERIFICATION,
			yahoo: process.env.YAHOO_VERIFICATION,
		},

		// 分类
		category: section || "Technology",
	};

	return metadata;
}

/**
 * 生成结构化数据 (JSON-LD)
 */
export function generateStructuredData(
	config: SEOConfig & {
		breadcrumbs?: Array<{ name: string; url: string }>;
		faq?: Array<{ question: string; answer: string }>;
		reviews?: Array<{ rating: number; author: string; text: string }>;
	}
) {
	const { title, description, url, image, type, breadcrumbs, faq, reviews } = config;
	const fullUrl = url ? `${baseSEOConfig.siteUrl}${url}` : baseSEOConfig.siteUrl;
	const fullImageUrl = image?.startsWith("http") ? image : `${baseSEOConfig.siteUrl}${image}`;

	const structuredData: any[] = [];

	// 网站基础信息
	structuredData.push({
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: baseSEOConfig.siteName,
		description: baseSEOConfig.siteDescription,
		url: baseSEOConfig.siteUrl,
		author: {
			"@type": "Person",
			name: baseSEOConfig.author.name,
			url: baseSEOConfig.author.url,
			sameAs: Object.values(baseSEOConfig.author.social),
		},
		potentialAction: {
			"@type": "SearchAction",
			target: `${baseSEOConfig.siteUrl}/search?q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	});

	// 个人信息
	structuredData.push({
		"@context": "https://schema.org",
		"@type": "Person",
		name: baseSEOConfig.author.name,
		url: baseSEOConfig.author.url,
		image: fullImageUrl,
		sameAs: Object.values(baseSEOConfig.author.social),
		jobTitle: "Full Stack Developer",
		worksFor: {
			"@type": "Organization",
			name: baseSEOConfig.siteName,
		},
	});

	// 页面特定结构化数据
	if (type === "article") {
		structuredData.push({
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			headline: title,
			description,
			url: fullUrl,
			image: fullImageUrl,
			author: {
				"@type": "Person",
				name: baseSEOConfig.author.name,
				url: baseSEOConfig.author.url,
			},
			publisher: {
				"@type": "Organization",
				name: baseSEOConfig.siteName,
				logo: {
					"@type": "ImageObject",
					url: `${baseSEOConfig.siteUrl}/logo.png`,
				},
			},
			datePublished: config.publishedTime,
			dateModified: config.modifiedTime || config.publishedTime,
		});
	}

	// 面包屑导航
	if (breadcrumbs && breadcrumbs.length > 0) {
		structuredData.push({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: breadcrumbs.map((crumb, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: crumb.name,
				item: `${baseSEOConfig.siteUrl}${crumb.url}`,
			})),
		});
	}

	// FAQ 结构化数据
	if (faq && faq.length > 0) {
		structuredData.push({
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: faq.map(item => ({
				"@type": "Question",
				name: item.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: item.answer,
				},
			})),
		});
	}

	// 评价结构化数据
	if (reviews && reviews.length > 0) {
		const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

		structuredData.push({
			"@context": "https://schema.org",
			"@type": "Product",
			name: title,
			description,
			image: fullImageUrl,
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: avgRating.toFixed(1),
				reviewCount: reviews.length,
				bestRating: 5,
				worstRating: 1,
			},
			review: reviews.map(review => ({
				"@type": "Review",
				reviewRating: {
					"@type": "Rating",
					ratingValue: review.rating,
					bestRating: 5,
					worstRating: 1,
				},
				author: {
					"@type": "Person",
					name: review.author,
				},
				reviewBody: review.text,
			})),
		});
	}

	return structuredData;
}

/**
 * 生成 Sitemap 数据
 */
export interface SitemapEntry {
	url: string;
	lastModified?: Date;
	changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
	priority?: number;
}

export function generateSitemapEntries(): SitemapEntry[] {
	const baseUrl = baseSEOConfig.siteUrl;

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/projects`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/gallery`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
	];
}

/**
 * 生成 robots.txt 内容
 */
export function generateRobotsTxt(): string {
	const baseUrl = baseSEOConfig.siteUrl;

	return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /blog
Allow: /projects
Allow: /gallery
Allow: /about`;
}

/**
 * SEO 工具集合
 */
export const SEOUtils = {
	generateMetadata,
	generateStructuredData,
	generateSitemapEntries,
	generateRobotsTxt,
	baseSEOConfig,
};
