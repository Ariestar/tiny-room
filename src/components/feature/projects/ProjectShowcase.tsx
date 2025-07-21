"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreativeCard } from "@/components/ui/CreativeCard";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "@/components/animation/ScrollReveal";
import {
    Star,
    GitFork,
    ExternalLink,
    Github,
    Calendar,
    Code,
    Trophy,
    Eye,
    ArrowRight
} from "lucide-react";

export interface Project {
    id: string;
    name: string;
    fullName: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    watchers: number;
    updatedAt: string;
    createdAt: string;
    url: string;
    topics: string[];
    isPrivate: boolean;
    isFork: boolean;
    isArchived: boolean;
    homepage?: string | null;
    // 扩展字段
    featured?: boolean;
    priority?: "high" | "medium" | "low";
    status?: "active" | "maintenance" | "archived" | "experimental";
    thumbnail?: string;
    demoUrl?: string;
    techStack?: string[];
}

export interface ProjectShowcaseProps {
    projects: Project[];
    maxProjects?: number;
    showGitHubLink?: boolean;
    className?: string;
}

/**
 * 项目展示组件
 * 用于在首页展示精选项目
 */
export function ProjectShowcase({
    projects,
    maxProjects = 6,
    showGitHubLink = true,
    className,
}: ProjectShowcaseProps) {
    const [displayProjects, setDisplayProjects] = useState<Project[]>([]);

    useEffect(() => {
        // 优先显示featured项目，然后按stars排序
        const sortedProjects = [...projects]
            .sort((a, b) => {
                // 优先级排序
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;

                // 按stars排序
                return b.stars - a.stars;
            })
            .slice(0, maxProjects);

        setDisplayProjects(sortedProjects);
    }, [projects, maxProjects]);

    if (displayProjects.length === 0) {
        return (
            <div className={cn("text-center py-12", className)}>
                <div className="text-6xl mb-4">💻</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                    暂无项目展示
                </h3>
                <p className="text-muted-foreground">
                    精彩项目正在开发中，敬请期待！
                </p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-8", className)}>
            {/* 项目网格 */}
            <ScrollRevealContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProjects.map((project, index) => (
                    <ScrollRevealItem key={project.id}>
                        <ProjectCard
                            project={project}
                            index={index}
                        />
                    </ScrollRevealItem>
                ))}
            </ScrollRevealContainer>

            {/* 查看更多链接 */}
            {showGitHubLink && (
                <ScrollReveal animation="fadeIn" delay={300}>
                    <div className="text-center pt-4">
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
                        >
                            查看所有项目
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </ScrollReveal>
            )}
        </div >
    );
}

/**
 * 单个项目卡片
 */
function ProjectCard({
    project,
    index,
}: {
    project: Project;
    index: number;
}) {
    // 获取项目状态颜色
    const getStatusColor = (status?: string) => {
        switch (status) {
            case "active":
                return "text-accent-green bg-accent-green/10";
            case "maintenance":
                return "text-accent-orange bg-accent-orange/10";
            case "archived":
                return "text-muted-foreground bg-muted/50";
            case "experimental":
                return "text-accent-purple bg-accent-purple/10";
            default:
                return "text-accent-blue bg-accent-blue/10";
        }
    };

    // 获取语言颜色
    const getLanguageColor = (language: string | null) => {
        const colors: Record<string, string> = {
            JavaScript: "#f1e05a",
            TypeScript: "#2b7489",
            Python: "#3572A5",
            Java: "#b07219",
            "C++": "#f34b7d",
            C: "#555555",
            Go: "#00ADD8",
            Rust: "#dea584",
            PHP: "#4F5D95",
            Ruby: "#701516",
            Swift: "#ffac45",
            Kotlin: "#F18E33",
            Dart: "#00B4AB",
            HTML: "#e34c26",
            CSS: "#1572B6",
            Vue: "#4FC08D",
            React: "#61DAFB",
        };
        return colors[language || ""] || "#6b7280";
    };

    // 格式化数字
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toString();
    };

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "昨天更新";
        if (diffDays <= 7) return `${diffDays}天前更新`;
        if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}周前更新`;

        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // 获取卡片变体
    const getCardVariant = () => {
        if (project.featured) return "floating";
        if (index % 3 === 0) return "tilted";
        if (index % 3 === 1) return "morphing";
        return "default";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <CreativeCard
                variant={getCardVariant()}
                size="md"
                enable3D={true}
                enableHover={true}
                tiltAngle={project.featured ? 0 : (index % 2 === 0 ? -1 : 1)}
                className="h-full relative group"
            >
                {/* 特色项目标识 */}
                {project.featured && (
                    <div className="absolute -top-2 -right-2 z-20">
                        <div className="bg-gradient-to-r from-accent-orange to-accent-pink text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            精选
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* 项目头部 */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-lg mb-1 truncate group-hover:text-primary transition-colors">
                                {project.name}
                            </h3>
                            {project.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {project.description}
                                </p>
                            )}
                        </div>

                        {/* 项目状态 */}
                        {project.status && (
                            <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2",
                                getStatusColor(project.status)
                            )}>
                                {project.status === "active" && "活跃"}
                                {project.status === "maintenance" && "维护"}
                                {project.status === "archived" && "归档"}
                                {project.status === "experimental" && "实验"}
                            </span>
                        )}
                    </div>

                    {/* 技术栈标签 */}
                    {(project.topics.length > 0 || project.language) && (
                        <div className="flex flex-wrap gap-1">
                            {project.language && (
                                <span
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md"
                                    style={{
                                        backgroundColor: `${getLanguageColor(project.language)}20`,
                                        color: getLanguageColor(project.language)
                                    }}
                                >
                                    <Code className="w-3 h-3" />
                                    {project.language}
                                </span>
                            )}
                            {project.topics.slice(0, 3).map((topic) => (
                                <span
                                    key={topic}
                                    className="px-2 py-1 bg-accent-blue/10 text-accent-blue text-xs rounded-md"
                                >
                                    {topic}
                                </span>
                            ))}
                            {project.topics.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                    +{project.topics.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* 项目统计 */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span>{formatNumber(project.stars)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <GitFork className="w-4 h-4" />
                            <span>{formatNumber(project.forks)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(project.watchers)}</span>
                        </div>
                    </div>

                    {/* 更新时间 */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(project.updatedAt)}</span>
                    </div>

                    {/* 项目链接 */}
                    <div className="flex items-center gap-2 pt-2">
                        <Link
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-sm rounded-lg transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            <span>源码</span>
                        </Link>

                        {(project.homepage || project.demoUrl) && (
                            <Link
                                href={project.homepage || project.demoUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm rounded-lg transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>演示</span>
                            </Link>
                        )}
                    </div>
                </div>
            </CreativeCard>
        </motion.div>
    );
}

/**
 * 项目统计组件
 */
export function ProjectStats({
    projects,
    className,
}: {
    projects: Project[];
    className?: string;
}) {
    const totalProjects = projects.length;
    const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
    const totalForks = projects.reduce((sum, project) => sum + project.forks, 0);
    const languages = new Set(projects.map(p => p.language).filter(Boolean)).size;

    const stats = [
        { label: "项目总数", value: totalProjects, emoji: "💻", color: "text-accent-blue" },
        { label: "获得星标", value: totalStars, emoji: "⭐", color: "text-accent-orange" },
        { label: "被Fork", value: totalForks, emoji: "🍴", color: "text-accent-green" },
        { label: "编程语言", value: languages, emoji: "🔧", color: "text-accent-purple" },
    ];

    return (
        <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    className="text-center p-4 rounded-lg bg-muted/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="text-2xl mb-2">{stat.emoji}</div>
                    <div className={cn("text-lg font-semibold", stat.color)}>{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
            ))}
        </div>
    );
}

/**
 * 紧凑版项目展示
 */
export function CompactProjectShowcase({
    projects,
    maxProjects = 3,
    className,
}: {
    projects: Project[];
    maxProjects?: number;
    className?: string;
}) {
    const displayProjects = projects
        .sort((a, b) => b.stars - a.stars)
        .slice(0, maxProjects);

    return (
        <div className={cn("space-y-3", className)}>
            {displayProjects.map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Link
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                    {project.name}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        {project.stars}
                                    </span>
                                    {project.language && (
                                        <span>{project.language}</span>
                                    )}
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}