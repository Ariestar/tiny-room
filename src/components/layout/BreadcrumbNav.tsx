"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BreadcrumbStructuredData } from "@/components/seo/EnhancedStructuredData";

interface BreadcrumbItem {
    name: string;
    url: string;
    isActive?: boolean;
}

interface BreadcrumbNavProps {
    items?: BreadcrumbItem[];
    className?: string;
    showHome?: boolean;
    separator?: "slash" | "arrow" | "chevron";
    maxItems?: number;
    showStructuredData?: boolean;
}

// 分隔符组件
const Separator = ({ type }: { type: "slash" | "arrow" | "chevron" }) => {
    const separators = {
        slash: "/",
        arrow: "→",
        chevron: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        ),
    };

    return (
        <span className="mx-2 text-gray-400 dark:text-gray-500 select-none">
            {separators[type]}
        </span>
    );
};

// 自动生成面包屑导航
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
        { name: "首页", url: "/" }
    ];

    let currentPath = "";

    segments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        // 解码URL段
        const decodedSegment = decodeURIComponent(segment);

        // 根据路径段生成名称
        let name = decodedSegment;
        switch (segment) {
            case "blog":
                name = "博客";
                break;
            case "projects":
                name = "项目";
                break;
            case "gallery":
                name = "画廊";
                break;
            case "about":
                name = "关于";
                break;
            case "dashboard":
                name = "仪表板";
                break;
            default:
                // 如果是最后一个段且看起来像文章标题，保持原样
                if (index === segments.length - 1 && decodedSegment.length > 10) {
                    name = decodedSegment.length > 30
                        ? decodedSegment.slice(0, 30) + "..."
                        : decodedSegment;
                } else {
                    // 首字母大写
                    name = decodedSegment.charAt(0).toUpperCase() + decodedSegment.slice(1);
                }
        }

        breadcrumbs.push({
            name,
            url: currentPath,
            isActive: index === segments.length - 1
        });
    });

    return breadcrumbs;
}

export function BreadcrumbNav({
    items,
    className = "",
    showHome = true,
    separator = "chevron",
    maxItems = 5,
    showStructuredData = true,
}: BreadcrumbNavProps) {
    const pathname = usePathname();

    // 使用提供的items或自动生成
    const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname);

    // 如果不显示首页，移除第一项
    const displayItems = showHome ? breadcrumbItems : breadcrumbItems.slice(1);

    // 处理过长的面包屑导航
    const processedItems = displayItems.length > maxItems
        ? [
            ...displayItems.slice(0, 1),
            { name: "...", url: "#", isActive: false },
            ...displayItems.slice(-maxItems + 2)
        ]
        : displayItems;

    if (displayItems.length <= 1) {
        return null; // 只有首页时不显示面包屑
    }

    return (
        <>
            {/* 结构化数据 */}
            {showStructuredData && (
                <BreadcrumbStructuredData
                    breadcrumbs={breadcrumbItems.map(item => ({
                        name: item.name,
                        url: item.url.startsWith('http') ? item.url : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tinyroom.dev'}${item.url}`
                    }))}
                />
            )}

            {/* 面包屑导航 */}
            <nav
                className={`flex items-center text-sm ${className}`}
                aria-label="面包屑导航"
            >
                <ol className="flex items-center space-x-0">
                    {processedItems.map((item, index) => (
                        <motion.li
                            key={`${item.url}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center"
                        >
                            {index > 0 && <Separator type={separator} />}

                            {item.isActive || item.name === "..." ? (
                                <span
                                    className={`${item.isActive
                                            ? "text-gray-900 dark:text-white font-medium"
                                            : "text-gray-400 dark:text-gray-500"
                                        } truncate max-w-xs`}
                                    aria-current={item.isActive ? "page" : undefined}
                                >
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={item.url}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 truncate max-w-xs"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </motion.li>
                    ))}
                </ol>
            </nav>
        </>
    );
}

// 预设的便捷组件
export function BlogBreadcrumb({
    postTitle,
    postSlug,
    className = ""
}: {
    postTitle?: string;
    postSlug?: string;
    className?: string;
}) {
    const items: BreadcrumbItem[] = [
        { name: "首页", url: "/" },
        { name: "博客", url: "/blog" },
    ];

    if (postTitle && postSlug) {
        items.push({
            name: postTitle.length > 30 ? postTitle.slice(0, 30) + "..." : postTitle,
            url: `/blog/${postSlug}`,
            isActive: true
        });
    }

    return (
        <BreadcrumbNav
            items={items}
            className={className}
            separator="chevron"
            showStructuredData={true}
        />
    );
}

export function ProjectBreadcrumb({
    projectTitle,
    projectId,
    className = ""
}: {
    projectTitle?: string;
    projectId?: string;
    className?: string;
}) {
    const items: BreadcrumbItem[] = [
        { name: "首页", url: "/" },
        { name: "项目", url: "/projects" },
    ];

    if (projectTitle && projectId) {
        items.push({
            name: projectTitle.length > 30 ? projectTitle.slice(0, 30) + "..." : projectTitle,
            url: `/projects/${projectId}`,
            isActive: true
        });
    }

    return (
        <BreadcrumbNav
            items={items}
            className={className}
            separator="chevron"
            showStructuredData={true}
        />
    );
}

export function DashboardBreadcrumb({
    section,
    subsection,
    className = ""
}: {
    section?: string;
    subsection?: string;
    className?: string;
}) {
    const items: BreadcrumbItem[] = [
        { name: "首页", url: "/" },
        { name: "仪表板", url: "/dashboard" },
    ];

    if (section) {
        const sectionNames: Record<string, string> = {
            blog: "博客管理",
            projects: "项目管理",
            gallery: "画廊管理",
            settings: "系统设置",
        };

        items.push({
            name: sectionNames[section] || section,
            url: `/dashboard/${section}`,
            isActive: !subsection
        });

        if (subsection) {
            items.push({
                name: subsection,
                url: `/dashboard/${section}/${subsection}`,
                isActive: true
            });
        }
    }

    return (
        <BreadcrumbNav
            items={items}
            className={className}
            separator="chevron"
            showStructuredData={true}
        />
    );
}