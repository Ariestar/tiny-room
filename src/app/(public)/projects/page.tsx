import { Metadata } from "next";
import { ProjectShowcase } from "@/components/feature/projects/ProjectShowcase";

export const metadata: Metadata = {
    title: "项目展示 - Tiny Room",
    description: "展示我的开源项目和技术作品，包括 Web 应用、工具库和实验性项目。",
    keywords: ["项目", "开源", "GitHub", "Web开发", "技术作品"],
    openGraph: {
        title: "项目展示 - Tiny Room",
        description: "展示我的开源项目和技术作品",
        type: "website",
    },
};

export default function ProjectsPage() {
    // 示例项目数据
    const sampleProjects = [
        {
            id: "1",
            name: "Tiny Room",
            fullName: "user/tiny-room",
            description: "现代化的个人网站和博客平台，基于 Next.js 15 构建",
            language: "TypeScript",
            stars: 42,
            forks: 8,
            watchers: 15,
            updatedAt: "2024-01-15T10:30:00Z",
            createdAt: "2023-12-01T09:00:00Z",
            url: "https://github.com/user/tiny-room",
            topics: ["nextjs", "react", "typescript", "tailwindcss", "blog"],
            isPrivate: false,
            isFork: false,
            isArchived: false,
            homepage: "https://tiny-room.vercel.app",
            featured: true,
            status: "active" as const,
            priority: "high" as const,
        },
        {
            id: "2",
            name: "React Components",
            fullName: "user/react-components",
            description: "可复用的 React 组件库，包含常用的 UI 组件和工具函数",
            language: "JavaScript",
            stars: 28,
            forks: 5,
            watchers: 12,
            updatedAt: "2024-01-10T14:20:00Z",
            createdAt: "2023-11-15T16:45:00Z",
            url: "https://github.com/user/react-components",
            topics: ["react", "components", "ui", "storybook"],
            isPrivate: false,
            isFork: false,
            isArchived: false,
            status: "active" as const,
            priority: "medium" as const,
        },
        {
            id: "3",
            name: "API Tools",
            fullName: "user/api-tools",
            description: "用于 API 开发和测试的工具集合",
            language: "Python",
            stars: 15,
            forks: 3,
            watchers: 8,
            updatedAt: "2024-01-05T11:15:00Z",
            createdAt: "2023-10-20T13:30:00Z",
            url: "https://github.com/user/api-tools",
            topics: ["python", "api", "testing", "tools"],
            isPrivate: false,
            isFork: false,
            isArchived: false,
            status: "maintenance" as const,
            priority: "low" as const,
        },
        {
            id: "4",
            name: "Data Visualizer",
            fullName: "user/data-visualizer",
            description: "数据可视化工具，支持多种图表类型和交互功能",
            language: "Vue",
            stars: 35,
            forks: 7,
            watchers: 18,
            updatedAt: "2024-01-12T09:45:00Z",
            createdAt: "2023-09-10T08:20:00Z",
            url: "https://github.com/user/data-visualizer",
            topics: ["vue", "d3", "charts", "visualization"],
            isPrivate: false,
            isFork: false,
            isArchived: false,
            homepage: "https://data-viz-demo.vercel.app",
            status: "active" as const,
            priority: "high" as const,
        },
        {
            id: "5",
            name: "Mobile App",
            fullName: "user/mobile-app",
            description: "跨平台移动应用，使用 React Native 开发",
            language: "JavaScript",
            stars: 22,
            forks: 4,
            watchers: 10,
            updatedAt: "2023-12-28T15:30:00Z",
            createdAt: "2023-08-05T12:00:00Z",
            url: "https://github.com/user/mobile-app",
            topics: ["react-native", "mobile", "ios", "android"],
            isPrivate: false,
            isFork: false,
            isArchived: false,
            status: "experimental" as const,
            priority: "medium" as const,
        },
        {
            id: "6",
            name: "CLI Tool",
            fullName: "user/cli-tool",
            description: "命令行工具，用于自动化日常开发任务",
            language: "Go",
            stars: 18,
            forks: 2,
            watchers: 6,
            updatedAt: "2023-12-20T10:15:00Z",
            createdAt: "2023-07-15T14:30:00Z",
            url: "https://github.com/user/cli-tool",
            topics: ["go", "cli", "automation", "devtools"],
            isPrivate: false,
            isFork: false,
            isArchived: false,
            status: "active" as const,
            priority: "medium" as const,
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* 页面头部 */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            项目展示
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            这里展示了我的开源项目和技术作品，涵盖 Web 开发、工具库和实验性项目。
                            每个项目都体现了我对技术的探索和实践。
                        </p>
                    </div>
                </div>
            </div>

            {/* 项目展示区域 */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <ProjectShowcase projects={sampleProjects} />
            </div>

            {/* 技术栈说明 */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            主要技术栈
                        </h2>
                        <p className="text-gray-600">
                            我在项目中使用的主要技术和工具
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "React", description: "前端框架" },
                            { name: "Next.js", description: "全栈框架" },
                            { name: "TypeScript", description: "类型安全" },
                            { name: "Tailwind CSS", description: "样式框架" },
                            { name: "Node.js", description: "后端运行时" },
                            { name: "PostgreSQL", description: "数据库" },
                            { name: "Prisma", description: "ORM工具" },
                            { name: "Vercel", description: "部署平台" }
                        ].map((tech, index) => (
                            <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                                <div className="font-semibold text-gray-900 mb-1">
                                    {tech.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {tech.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 联系方式 */}
            <div className="bg-white py-12">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        有项目想法？
                    </h2>
                    <p className="text-gray-600 mb-6">
                        如果你有有趣的项目想法或者想要合作，欢迎联系我！
                    </p>
                    <div className="flex justify-center space-x-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            查看 GitHub
                        </a>
                        <a
                            href="mailto:contact@example.com"
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            发送邮件
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}