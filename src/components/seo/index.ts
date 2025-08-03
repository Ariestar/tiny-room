// 增强的结构化数据组件
export {
  StructuredData,
  WebsiteStructuredData,
  ArticleStructuredData,
  TechArticleStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
  PersonStructuredData,
  OrganizationStructuredData,
} from "./EnhancedStructuredData";

// 类型定义
export type {
  FAQItem,
  BreadcrumbItem,
  TechArticleData,
} from "./EnhancedStructuredData";

// 原有的结构化数据组件（保持向后兼容）
export {
  StructuredData as LegacyStructuredData,
  HomepageStructuredData,
  BlogPostStructuredData,
  ProjectStructuredData,
} from "./StructuredData";
