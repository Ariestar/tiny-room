// 导出空对象确保文件被识别为模块
export {};

// 项目接口
export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  techStack: string[];
  category: string;
  featured: boolean;
  status: 'planning' | 'in-progress' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
  role: string;
  tags: string[];
  date?: string;
  link?: string;
  client?: string;
  duration?: string;
  details?: string;
  technologies?: string[];
}

// 图库图片接口
export interface GalleryImage {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  captureDate: string;
  location?: string;
  camera?: string;
  settings?: {
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: string;
  };
}

// Blog related types
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  lastModified: string;
  status: 'draft' | 'pending_review' | 'published' | 'scheduled' | 'archived';
  tags: string[];
  category: string;
  readingTime: number;
  featuredImage?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface Comment {
  id: number;
  postId: number;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  approved: boolean;
  parentId?: number;
}

// User related types
export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  avatar?: string;
  bio?: string;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
}

// Authentication types
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  displayName: string;
  role: User['role'];
  avatar?: string;
  permissions: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// Content Management types
export interface ContentVersion {
  id: number;
  contentId: number;
  contentType: 'project' | 'blog' | 'gallery' | 'page';
  content: string;
  author: number;
  version: number;
  createdAt: string;
  comment?: string;
}

export interface FileUpload {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: number;
  uploadedAt: string;
  category: 'image' | 'document' | 'video' | 'audio';
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    [key: string]: any;
  };
}

export interface ContentDraft {
  id: number;
  contentType: 'project' | 'blog' | 'gallery' | 'page';
  title: string;
  content: string;
  author: number;
  createdAt: string;
  lastModified: string;
  autoSaved: boolean;
}

// Website configuration types
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  socialMedia: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  seo: {
    defaultMetaTitle: string;
    defaultMetaDescription: string;
    defaultKeywords: string[];
    ogImage?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
  };
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  external?: boolean;
  requiresAuth?: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  ipAddress?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// CMS Permission types
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'publish';
  granted: boolean;
}

export interface RolePermissions {
  role: User['role'];
  permissions: Permission[];
}
