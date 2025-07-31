// 博客时间线布局相关类型定义
// 简化设计，移除复杂的位置计算

export interface TimelineData {
  posts: TimelinePost[];
}

export interface YearGroup {
  year: number;
  posts: TimelinePost[];
  color: string;
}

// 简化的时间线文章类型
export interface TimelinePost {
  // 基础文章属性
  slug: string;
  title: string;
  date: string;
  tags: string[];
  status: string;
  readingTime: string;

  // 时间线特有属性
  nodeColor: string; // HSL 格式颜色值
  year: number; // 文章年份
  isFirstOfYear: boolean; // 是否是该年份的第一篇文章
}

// 时间线布局配置
export interface TimelineConfig {
  showYearLabels: boolean;
  showConnectors: boolean;
  variant: "vertical" | "horizontal";
}
