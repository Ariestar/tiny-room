/**
 * 统一图片优化工具
 * Unified Image Optimization Utilities
 */

/**
 * 图片格式检测和转换
 */
export class ImageFormatOptimizer {
  private static supportedFormats: Set<string> = new Set();

  static {
    this.detectSupportedFormats();
  }

  /**
   * 检测浏览器支持的图片格式
   */
  private static detectSupportedFormats() {
    if (typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;

    // 检测 WebP 支持
    if (canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0) {
      this.supportedFormats.add("webp");
    }

    // 检测 AVIF 支持
    if (canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0) {
      this.supportedFormats.add("avif");
    }

    // 基础格式支持
    this.supportedFormats.add("jpeg");
    this.supportedFormats.add("png");
    this.supportedFormats.add("gif");
  }

  /**
   * 获取最优图片格式
   */
  static getBestFormat(originalFormat: string = "jpeg"): string {
    if (this.supportedFormats.has("avif")) return "avif";
    if (this.supportedFormats.has("webp")) return "webp";
    return originalFormat;
  }

  /**
   * 检查是否支持特定格式
   */
  static supportsFormat(format: string): boolean {
    return this.supportedFormats.has(format.toLowerCase());
  }
}

/**
 * 图片预加载管理器
 */
export class ImagePreloader {
  private static cache = new Map<string, Promise<HTMLImageElement>>();
  private static loadedImages = new Set<string>();

  /**
   * 预加载单个图片
   */
  static preload(
    src: string,
    priority: "high" | "low" = "low"
  ): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.loadedImages.add(src);
        resolve(img);
      };

      img.onerror = () => {
        this.cache.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };

      // 设置优先级
      if (priority === "high") {
        (img as any).fetchPriority = "high";
      }

      img.src = src;
    });

    this.cache.set(src, promise);
    return promise;
  }

  /**
   * 批量预加载图片
   */
  static preloadBatch(
    sources: string[],
    options: {
      priority?: "high" | "low";
      maxConcurrent?: number;
      onProgress?: (loaded: number, total: number) => void;
    } = {}
  ): Promise<HTMLImageElement[]> {
    const { priority = "low", maxConcurrent = 3, onProgress } = options;

    let loaded = 0;

    // 分批处理，避免同时加载太多图片
    const batches: string[][] = [];
    for (let i = 0; i < sources.length; i += maxConcurrent) {
      batches.push(sources.slice(i, i + maxConcurrent));
    }

    const processBatch = async (batch: string[]) => {
      const batchPromises = batch.map((src) =>
        this.preload(src, priority).then((img) => {
          loaded++;
          onProgress?.(loaded, sources.length);
          return img;
        })
      );
      return Promise.all(batchPromises);
    };

    // 顺序处理批次
    return batches.reduce(async (acc, batch) => {
      const previous = await acc;
      const current = await processBatch(batch);
      return [...previous, ...current];
    }, Promise.resolve([] as HTMLImageElement[]));
  }

  /**
   * 检查图片是否已加载
   */
  static isLoaded(src: string): boolean {
    return this.loadedImages.has(src);
  }

  /**
   * 清理缓存
   */
  static clearCache() {
    this.cache.clear();
    this.loadedImages.clear();
  }
}

/**
 * 响应式图片尺寸计算器
 */
export class ResponsiveImageCalculator {
  /**
   * 根据容器尺寸和设备像素比计算最优图片尺寸
   */
  static calculateOptimalSize(
    containerWidth: number,
    containerHeight: number,
    devicePixelRatio: number = typeof window !== "undefined"
      ? window.devicePixelRatio || 1
      : 1
  ): { width: number; height: number } {
    // 考虑设备像素比，但限制最大倍数以节省带宽
    const maxPixelRatio = Math.min(devicePixelRatio, 2);

    return {
      width: Math.ceil(containerWidth * maxPixelRatio),
      height: Math.ceil(containerHeight * maxPixelRatio),
    };
  }

  /**
   * 生成响应式 sizes 属性
   */
  static generateSizes(
    breakpoints: Array<{
      condition: string;
      size: string;
    }>
  ): string {
    return breakpoints.map((bp) => `${bp.condition} ${bp.size}`).join(", ");
  }

  /**
   * 预设的响应式配置
   */
  static presets = {
    hero: "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px",
    card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    avatar: "(max-width: 640px) 80px, (max-width: 1024px) 120px, 160px",
    gallery: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
    thumbnail: "(max-width: 640px) 100px, (max-width: 1024px) 150px, 200px",
  };
}

/**
 * 图片懒加载观察器
 */
export class LazyLoadObserver {
  private static instance: LazyLoadObserver;
  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<Element, () => void>();

  private constructor() {
    if (typeof window !== "undefined") {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const callback = this.callbacks.get(entry.target);
              if (callback) {
                callback();
                this.unobserve(entry.target);
              }
            }
          });
        },
        {
          rootMargin: "50px", // 提前50px开始加载
          threshold: 0.1,
        }
      );
    }
  }

  static getInstance(): LazyLoadObserver {
    if (!LazyLoadObserver.instance) {
      LazyLoadObserver.instance = new LazyLoadObserver();
    }
    return LazyLoadObserver.instance;
  }

  observe(element: Element, callback: () => void) {
    if (!this.observer) return;

    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    if (!this.observer) return;

    this.callbacks.delete(element);
    this.observer.unobserve(element);
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.callbacks.clear();
    }
  }
}

/**
 * 图片质量自适应管理器
 */
export class AdaptiveQualityManager {
  private static networkQuality: "slow" | "fast" = "fast";
  private static dataSaver = false;

  static {
    this.detectNetworkConditions();
  }

  /**
   * 检测网络条件
   */
  private static detectNetworkConditions() {
    if (typeof navigator === "undefined") return;

    // 检测数据节省模式
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.dataSaver = connection.saveData || false;

        // 根据连接类型调整质量
        const slowConnections = ["slow-2g", "2g", "3g"];
        if (slowConnections.includes(connection.effectiveType)) {
          this.networkQuality = "slow";
        }
      }
    }

    // 监听网络变化
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.networkQuality = "fast";
      });

      window.addEventListener("offline", () => {
        this.networkQuality = "slow";
      });
    }
  }

  /**
   * 根据网络条件获取推荐质量
   */
  static getRecommendedQuality(baseQuality: number = 85): number {
    if (this.dataSaver) return Math.min(baseQuality, 60);
    if (this.networkQuality === "slow") return Math.min(baseQuality, 70);
    return baseQuality;
  }

  /**
   * 获取推荐的图片尺寸缩放比例
   */
  static getRecommendedScale(): number {
    if (this.dataSaver) return 0.7;
    if (this.networkQuality === "slow") return 0.8;
    return 1;
  }
}

/**
 * 图片错误处理和重试机制
 */
export class ImageErrorHandler {
  private static retryAttempts = new Map<string, number>();
  private static maxRetries = 3;

  /**
   * 处理图片加载错误，支持重试和降级
   */
  static async handleError(
    src: string,
    fallbackSources: string[] = [],
    onRetry?: (attempt: number) => void
  ): Promise<string | null> {
    const attempts = this.retryAttempts.get(src) || 0;

    if (attempts < this.maxRetries) {
      // 重试原图片
      this.retryAttempts.set(src, attempts + 1);
      onRetry?.(attempts + 1);

      // 延迟重试
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      return src;
    }

    // 尝试降级到备用图片
    for (const fallback of fallbackSources) {
      try {
        await ImagePreloader.preload(fallback);
        return fallback;
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * 重置重试计数
   */
  static resetRetries(src: string) {
    this.retryAttempts.delete(src);
  }

  /**
   * 清理所有重试记录
   */
  static clearRetries() {
    this.retryAttempts.clear();
  }
}

/**
 * 图片性能监控
 */
export class ImagePerformanceMonitor {
  private static metrics = new Map<
    string,
    {
      loadTime: number;
      size: number;
      format: string;
      cached: boolean;
    }
  >();

  /**
   * 记录图片加载性能
   */
  static recordLoad(
    src: string,
    startTime: number,
    size?: number,
    format?: string,
    cached = false
  ) {
    const loadTime = performance.now() - startTime;

    this.metrics.set(src, {
      loadTime,
      size: size || 0,
      format: format || "unknown",
      cached,
    });

    // 在开发环境下输出性能信息
    if (process.env.NODE_ENV === "development") {
      console.log(`📸 Image loaded: ${src}`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        size: size ? `${(size / 1024).toFixed(2)}KB` : "unknown",
        format,
        cached,
      });
    }
  }

  /**
   * 获取性能统计
   */
  static getStats() {
    const metrics = Array.from(this.metrics.values());

    if (metrics.length === 0) {
      return {
        totalImages: 0,
        averageLoadTime: 0,
        totalSize: 0,
        cacheHitRate: 0,
        formatDistribution: {},
      };
    }

    return {
      totalImages: metrics.length,
      averageLoadTime:
        metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length,
      totalSize: metrics.reduce((sum, m) => sum + m.size, 0),
      cacheHitRate: metrics.filter((m) => m.cached).length / metrics.length,
      formatDistribution: metrics.reduce((acc, m) => {
        acc[m.format] = (acc[m.format] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  /**
   * 清理监控数据
   */
  static clearMetrics() {
    this.metrics.clear();
  }
}

/**
 * 图片工具函数
 */
export const imageUtils = {
  /**
   * 获取图片的实际尺寸
   */
  getImageDimensions: (
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
  },

  /**
   * 检查图片是否存在
   */
  imageExists: (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  },

  /**
   * 生成图片的缩略图URL（如果有CDN支持）
   */
  generateThumbnail: (src: string, width: number, height?: number): string => {
    // 这里可以根据实际的CDN服务进行调整
    // 例如：Cloudinary, ImageKit, 等
    const params = height ? `w_${width},h_${height}` : `w_${width}`;

    // 如果是外部URL，直接返回
    if (src.startsWith("http")) {
      return src;
    }

    // 如果有CDN配置，可以在这里处理
    return src;
  },

  /**
   * 获取图片的主要颜色（简单版本）
   */
  getDominantColor: (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Cannot get canvas context"));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          let r = 0,
            g = 0,
            b = 0;
          const pixelCount = data.length / 4;

          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }

          r = Math.floor(r / pixelCount);
          g = Math.floor(g / pixelCount);
          b = Math.floor(b / pixelCount);

          resolve(`rgb(${r}, ${g}, ${b})`);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = reject;
      img.src = src;
    });
  },
};

/**
 * 图片优化工具集合
 */
export const ImageOptimizationUtils = {
  formatOptimizer: ImageFormatOptimizer,
  preloader: ImagePreloader,
  responsiveCalculator: ResponsiveImageCalculator,
  lazyLoader: LazyLoadObserver,
  qualityManager: AdaptiveQualityManager,
  errorHandler: ImageErrorHandler,
  performanceMonitor: ImagePerformanceMonitor,
  utils: imageUtils,
};

// 导出便捷函数
export const {
  formatOptimizer,
  preloader,
  responsiveCalculator,
  lazyLoader,
  qualityManager,
  errorHandler,
  performanceMonitor,
  utils,
} = ImageOptimizationUtils;
