// 博客时间线数据处理函数
// 简化设计，移除复杂的位置计算

import type { getSortedPostsData } from "./posts";
import type {
  TimelineData,
  TimelinePost,
  YearGroup,
} from "@/components/feature/blog/timeline/types";

// 使用 getSortedPostsData 的返回类型
type PostSummary = ReturnType<typeof getSortedPostsData>[number];

// 颜色缓存，避免重复计算
const COLOR_CACHE = new Map<number, string>();

// 时间线数据缓存，提高性能
const TIMELINE_DATA_CACHE = new Map<string, TimelineData>();

/**
 * 生成时间线颜色
 * 使用现代化的渐变色彩方案，确保视觉和谐
 */
const generateTimelineColor = (year: number): string => {
  if (COLOR_CACHE.has(year)) {
    return COLOR_CACHE.get(year)!;
  }

  // 现代化的颜色方案 - 更柔和、更有层次
  const colors = [
    "hsl(217, 91%, 60%)", // 现代蓝 - 类似 Vercel 蓝
    "hsl(262, 83%, 58%)", // 优雅紫 - 深度感
    "hsl(333, 71%, 51%)", // 活力粉 - 创意感
    "hsl(158, 64%, 52%)", // 清新绿 - 自然感
    "hsl(25, 95%, 53%)", // 温暖橙 - 活力感
    "hsl(199, 89%, 48%)", // 科技青 - 专业感
    "hsl(291, 64%, 42%)", // 神秘紫 - 深邃感
    "hsl(346, 77%, 49%)", // 热情红 - 激情感
    "hsl(142, 71%, 45%)", // 生机绿 - 成长感
    "hsl(43, 96%, 56%)", // 阳光黄 - 明亮感
  ];

  // 使用年份的数字特征来生成更稳定的颜色映射
  const yearDigits = year.toString().split("").map(Number);
  const colorIndex =
    yearDigits.reduce((sum, digit) => sum + digit, 0) % colors.length;

  const color = colors[colorIndex];
  COLOR_CACHE.set(year, color);
  return color;
};

/**
 * 按年份分组文章
 */
const groupPostsByYear = (posts: PostSummary[]): YearGroup[] => {
  const yearMap = new Map<number, PostSummary[]>();

  // 按年份分组
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear();
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(post);
  });

  // 转换为 YearGroup 数组并排序
  return Array.from(yearMap.entries())
    .map(([year, yearPosts]) => ({
      year,
      posts: yearPosts.map((post, index) => ({
        slug: post.slug,
        title: post.title,
        date: post.date,
        tags: post.tags,
        status: post.status,
        readingTime: post.readingTime,
        nodeColor: generateTimelineColor(year),
        year,
        isFirstOfYear: index === 0, // 第一篇文章标记为年份开始
      })),
      color: generateTimelineColor(year),
    }))
    .sort((a, b) => b.year - a.year); // 按年份降序排列
};

/**
 * 生成时间线数据
 * 简化版本，移除复杂的位置计算
 */
export const generateTimelineData = (posts: PostSummary[]): TimelineData => {
  if (posts.length === 0) {
    return { posts: [] };
  }

  // 按时间排序（最新的在前）
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 按年份分组
  const yearGroups = groupPostsByYear(sortedPosts);

  // 扁平化所有文章，保持时间顺序
  const timelinePosts: TimelinePost[] = [];
  yearGroups.forEach((group) => {
    // 每个年份组内的文章按时间降序排列
    const sortedGroupPosts = group.posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    timelinePosts.push(...sortedGroupPosts);
  });

  return { posts: timelinePosts };
};

/**
 * 获取时间线数据（带缓存优化）
 */
export const getTimelineDataForPosts = (posts: PostSummary[]): TimelineData => {
  // 创建缓存键
  const cacheKey =
    posts.length > 0 ? `${posts.length}-${posts[0]?.date || "empty"}` : "empty";

  if (TIMELINE_DATA_CACHE.has(cacheKey)) {
    return TIMELINE_DATA_CACHE.get(cacheKey)!;
  }

  const timelineData = generateTimelineData(posts);
  TIMELINE_DATA_CACHE.set(cacheKey, timelineData);

  // 限制缓存大小
  if (TIMELINE_DATA_CACHE.size > 10) {
    const firstKey = TIMELINE_DATA_CACHE.keys().next().value;
    if (firstKey) {
      TIMELINE_DATA_CACHE.delete(firstKey);
    }
  }

  return timelineData;
};

/**
 * 获取按年份分组的数据（用于年份标签显示）
 */
export const getYearGroups = (posts: PostSummary[]): YearGroup[] => {
  if (posts.length === 0) return [];

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return groupPostsByYear(sortedPosts);
};
