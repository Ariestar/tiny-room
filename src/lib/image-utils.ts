/**
 * 图片优化工具函数
 * 提供图片处理、优化和懒加载相关功能
 */

// 图片格式检测
export const getImageFormat = (src: string): string => {
  const extension = src.split(".").pop()?.toLowerCase();
  return extension || "unknown";
};

// 检查是否支持WebP
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  });
};

// 检查是否支持AVIF
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=";
  });
};

// 生成响应式图片尺寸
export const generateResponsiveSizes = (
  breakpoints: { [key: string]: number } = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  }
): string => {
  const sizes = Object.entries(breakpoints)
    .sort(([, a], [, b]) => a - b)
    .map(
      ([name, width]) => `(max-width: ${width}px) ${Math.round(width * 0.9)}px`
    )
    .join(", ");

  return `${sizes}, 100vw`;
};

// 计算图片的最佳质量
export const calculateOptimalQuality = (
  width: number,
  height: number,
  fileSize?: number
): number => {
  const pixelCount = width * height;

  // 基于像素数量调整质量
  if (pixelCount > 2000000) return 70; // 大图片使用较低质量
  if (pixelCount > 1000000) return 80; // 中等图片
  if (pixelCount > 500000) return 85; // 小图片
  return 90; // 很小的图片使用高质量
};

// 生成模糊占位符数据URL
export const generateBlurDataURL = (
  width: number = 10,
  height: number = 10,
  color: string = "#f3f4f6"
): string => {
  // 创建SVG模糊占位符
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

// 图片预加载
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// 批量预加载图片
export const preloadImages = async (
  sources: string[],
  maxConcurrent: number = 3
): Promise<void> => {
  const chunks = [];
  for (let i = 0; i < sources.length; i += maxConcurrent) {
    chunks.push(sources.slice(i, i + maxConcurrent));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(preloadImage));
  }
};

// 图片尺寸检测
export const getImageDimensions = (
  src: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
};

// 图片压缩（客户端）
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      // 计算新尺寸
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制并压缩
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve!, "image/jpeg", quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// 图片格式转换
export const convertImageFormat = (
  src: string,
  format: "webp" | "jpeg" | "png",
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${format}`;
      const dataURL = canvas.toDataURL(mimeType, quality);
      resolve(dataURL);
    };

    img.src = src;
  });
};

// 懒加载观察器配置
export const createLazyLoadObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      callback(entry);
    }
  }, defaultOptions);
};

// 图片性能监控
export const imagePerformanceMonitor = {
  // 监控图片加载时间
  measureLoadTime: (src: string): Promise<number> => {
    const startTime = performance.now();

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        console.log(`Image ${src} loaded in ${loadTime.toFixed(2)}ms`);
        resolve(loadTime);
      };
      img.onerror = reject;
      img.src = src;
    });
  },

  // 监控图片内存使用
  getImageMemoryUsage: (width: number, height: number): number => {
    // 估算图片内存使用（字节）
    return width * height * 4; // RGBA 每像素4字节
  },

  // 检查图片是否在视口中
  isImageInViewport: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};

// 图片缓存管理
export const imageCache = {
  cache: new Map<string, string>(),

  // 添加到缓存
  set: (key: string, value: string): void => {
    imageCache.cache.set(key, value);
  },

  // 从缓存获取
  get: (key: string): string | undefined => {
    return imageCache.cache.get(key);
  },

  // 检查是否在缓存中
  has: (key: string): boolean => {
    return imageCache.cache.has(key);
  },

  // 清除缓存
  clear: (): void => {
    imageCache.cache.clear();
  },

  // 获取缓存大小
  size: (): number => {
    return imageCache.cache.size;
  },
};

// 图片优化建议
export const getImageOptimizationSuggestions = (
  width: number,
  height: number,
  fileSize: number,
  format: string
): string[] => {
  const suggestions: string[] = [];
  const pixelCount = width * height;
  const bytesPerPixel = fileSize / pixelCount;

  // 尺寸建议
  if (width > 2000 || height > 2000) {
    suggestions.push("考虑减小图片尺寸以提高加载速度");
  }

  // 格式建议
  if (format === "png" && bytesPerPixel > 3) {
    suggestions.push("PNG格式可能不是最佳选择，考虑使用JPEG或WebP");
  }

  if (format === "jpeg" && bytesPerPixel < 1) {
    suggestions.push("JPEG质量可能过低，考虑提高质量或使用PNG");
  }

  // 文件大小建议
  if (fileSize > 500000) {
    // 500KB
    suggestions.push("文件大小较大，考虑压缩或使用更高效的格式");
  }

  // WebP建议
  if (format !== "webp") {
    suggestions.push("考虑使用WebP格式以获得更好的压缩效果");
  }

  return suggestions;
};

// 导出默认配置
export const defaultImageConfig = {
  quality: 85,
  formats: ["webp", "jpeg"],
  sizes: generateResponsiveSizes(),
  lazyLoading: true,
  placeholder: "blur",
  priority: false,
};
