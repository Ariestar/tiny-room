import { Project } from "@/components/feature/projects/ProjectShowcase";

/**
 * 示例项目数据
 * 在实际应用中，这些数据应该从GitHub API获取
 */
export const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Tiny Room",
    fullName: "user/tiny-room",
    description:
      "一个现代化的个人网站和博客平台，基于Next.js 15构建，集成了丰富的动画效果和交互体验",
    language: "TypeScript",
    stars: 128,
    forks: 23,
    watchers: 45,
    updatedAt: "2024-01-15T10:30:00Z",
    createdAt: "2023-12-01T08:00:00Z",
    url: "https://github.com/user/tiny-room",
    topics: ["nextjs", "typescript", "tailwindcss", "framer-motion", "blog"],
    isPrivate: false,
    isFork: false,
    isArchived: false,
    homepage: "https://tiny-room.vercel.app",
    featured: true,
    priority: "high",
    status: "active",
    demoUrl: "https://tiny-room.vercel.app",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Prisma",
    ],
  },
  {
    id: "2",
    name: "React Dashboard",
    fullName: "user/react-dashboard",
    description:
      "一个功能丰富的React管理后台模板，包含数据可视化、用户管理、权限控制等功能",
    language: "JavaScript",
    stars: 89,
    forks: 34,
    watchers: 67,
    updatedAt: "2024-01-10T14:20:00Z",
    createdAt: "2023-10-15T09:30:00Z",
    url: "https://github.com/user/react-dashboard",
    topics: ["react", "dashboard", "admin", "charts", "material-ui"],
    isPrivate: false,
    isFork: false,
    isArchived: false,
    homepage: "https://react-dashboard-demo.vercel.app",
    featured: true,
    priority: "high",
    status: "active",
    demoUrl: "https://react-dashboard-demo.vercel.app",
    techStack: ["React", "Material-UI", "Chart.js", "Redux", "Node.js"],
  },
  {
    id: "3",
    name: "Vue E-commerce",
    fullName: "user/vue-ecommerce",
    description:
      "基于Vue 3和Vite构建的现代电商平台，支持商品管理、购物车、支付集成等完整功能",
    language: "Vue",
    stars: 156,
    forks: 42,
    watchers: 78,
    updatedAt: "2024-01-08T16:45:00Z",
    createdAt: "2023-09-20T11:15:00Z",
    url: "https://github.com/user/vue-ecommerce",
    topics: ["vue3", "vite", "ecommerce", "pinia", "element-plus"],
    isPrivate: false,
    isFork: false,
    isArchived: false,
    homepage: "https://vue-ecommerce-demo.netlify.app",
    featured: false,
    priority: "medium",
    status: "active",
    demoUrl: "https://vue-ecommerce-demo.netlify.app",
    techStack: ["Vue 3", "Vite", "Pinia", "Element Plus", "Stripe"],
  },
  {
    id: "4",
    name: "Python Data Analyzer",
    fullName: "user/python-data-analyzer",
    description:
      "强大的数据分析工具，支持CSV、Excel、JSON等多种格式，提供可视化图表和统计分析功能",
    language: "Python",
    stars: 73,
    forks: 18,
    watchers: 29,
    updatedAt: "2024-01-05T09:10:00Z",
    createdAt: "2023-11-10T13:45:00Z",
    url: "https://github.com/user/python-data-analyzer",
    topics: ["python", "data-analysis", "pandas", "matplotlib", "jupyter"],
    isPrivate: false,
    isFork: false,
    isArchived: false,
    featured: false,
    priority: "medium",
    status: "maintenance",
    techStack: ["Python", "Pandas", "Matplotlib", "Jupyter", "NumPy"],
  },
  {
    id: "5",
    name: "Mobile App Flutter",
    fullName: "user/mobile-app-flutter",
    description:
      "跨平台移动应用，使用Flutter开发，包含用户认证、数据同步、离线存储等功能",
    language: "Dart",
    stars: 45,
    forks: 12,
    watchers: 23,
    updatedAt: "2023-12-28T12:30:00Z",
    createdAt: "2023-08-15T10:20:00Z",
    url: "https://github.com/user/mobile-app-flutter",
    topics: ["flutter", "dart", "mobile", "firebase", "sqlite"],
    isPrivate: false,
    isFork: false,
    isArchived: false,
    featured: false,
    priority: "low",
    status: "experimental",
    techStack: ["Flutter", "Dart", "Firebase", "SQLite", "Provider"],
  },
  {
    id: "6",
    name: "Go Microservices",
    fullName: "user/go-microservices",
    description:
      "基于Go语言的微服务架构示例，包含API网关、服务发现、负载均衡、监控等组件",
    language: "Go",
    stars: 92,
    forks: 28,
    watchers: 41,
    updatedAt: "2024-01-12T15:20:00Z",
    createdAt: "2023-07-30T14:10:00Z",
    url: "https://github.com/user/go-microservices",
    topics: ["go", "microservices", "docker", "kubernetes", "grpc"],
    isPrivate: false,
    isFork: false,
    isArchived: false,
    featured: false,
    priority: "medium",
    status: "active",
    techStack: ["Go", "Docker", "Kubernetes", "gRPC", "Redis"],
  },
];

/**
 * 获取精选项目
 */
export function getFeaturedProjects(): Project[] {
  return sampleProjects.filter((project) => project.featured);
}

/**
 * 获取所有项目，按星标数排序
 */
export function getAllProjects(): Project[] {
  return [...sampleProjects].sort((a, b) => b.stars - a.stars);
}

/**
 * 根据状态筛选项目
 */
export function getProjectsByStatus(status: Project["status"]): Project[] {
  return sampleProjects.filter((project) => project.status === status);
}

/**
 * 根据编程语言筛选项目
 */
export function getProjectsByLanguage(language: string): Project[] {
  return sampleProjects.filter((project) => project.language === language);
}

/**
 * 获取项目统计信息
 */
export function getProjectStats() {
  const totalProjects = sampleProjects.length;
  const totalStars = sampleProjects.reduce(
    (sum, project) => sum + project.stars,
    0
  );
  const totalForks = sampleProjects.reduce(
    (sum, project) => sum + project.forks,
    0
  );
  const languages = new Set(
    sampleProjects.map((p) => p.language).filter(Boolean)
  );

  const languageStats = Array.from(languages)
    .map((language) => ({
      language,
      count: sampleProjects.filter((p) => p.language === language).length,
      stars: sampleProjects
        .filter((p) => p.language === language)
        .reduce((sum, p) => sum + p.stars, 0),
    }))
    .sort((a, b) => b.stars - a.stars);

  const statusStats = {
    active: sampleProjects.filter((p) => p.status === "active").length,
    maintenance: sampleProjects.filter((p) => p.status === "maintenance")
      .length,
    archived: sampleProjects.filter((p) => p.status === "archived").length,
    experimental: sampleProjects.filter((p) => p.status === "experimental")
      .length,
  };

  return {
    totalProjects,
    totalStars,
    totalForks,
    totalLanguages: languages.size,
    languageStats,
    statusStats,
    featuredProjects: sampleProjects.filter((p) => p.featured).length,
    averageStars: Math.round(totalStars / totalProjects),
    mostPopularLanguage: languageStats[0]?.language || null,
  };
}

/**
 * 搜索项目
 */
export function searchProjects(query: string): Project[] {
  const searchTerm = query.toLowerCase();
  return sampleProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.description?.toLowerCase().includes(searchTerm) ||
      project.language?.toLowerCase().includes(searchTerm) ||
      project.topics.some((topic) => topic.toLowerCase().includes(searchTerm))
  );
}

/**
 * 获取最近更新的项目
 */
export function getRecentlyUpdatedProjects(limit: number = 5): Project[] {
  return [...sampleProjects]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);
}

/**
 * 获取最受欢迎的项目
 */
export function getMostPopularProjects(limit: number = 5): Project[] {
  return [...sampleProjects].sort((a, b) => b.stars - a.stars).slice(0, limit);
}
