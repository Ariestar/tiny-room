// 导出空对象确保文件被识别为模块
export {};

// 项目接口
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  tags: string[];
  category: string;
  date: string;
  featured: boolean;
  client?: string;
  duration?: string;
  details?: string;
  technologies?: string[];
  images?: {
    url: string;
    caption?: string;
  }[];
}

// 图库图片接口
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  tags: string[];
  date: string;
  description?: string;
  width: number;
  height: number;
  thumbnail?: string;
  location?: {
    name: string;
    coordinates?: [number, number];
  };
  exif?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
  };
}
