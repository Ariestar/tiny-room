// 性能优化工具库
import { lazy } from "react";

// 懒加载组件工厂
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFn);

  if (fallback) {
    return (props: React.ComponentProps<T>) => (
      <React.Suspense fallback={<fallback />}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  }

  return LazyComponent;
}

// 图片预加载
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// 批量预加载图片
export async function preloadImages(srcs: string[]): Promise<void> {
  const promises = srcs.map((src) => preloadImage(src));
  await Promise.allSettled(promises);
}

// 资源预加载
export function preloadResource(href: string, as: string = "script"): void {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// DNS 预解析
export function prefetchDNS(hostname: string): void {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "dns-prefetch";
  link.href = `//${hostname}`;
  document.head.appendChild(link);
}

// 预连接
export function preconnect(href: string, crossorigin?: boolean): void {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = href;
  if (crossorigin) link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 交集观察器工厂
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  });
}

// 懒加载图片
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  placeholder?: string
): void {
  const observer = createIntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement;
        target.src = src;
        target.classList.remove("lazy");
        observer?.unobserve(target);
      }
    });
  });

  if (observer) {
    if (placeholder) img.src = placeholder;
    img.classList.add("lazy");
    observer.observe(img);
  } else {
    // 降级处理
    img.src = src;
  }
}

// 虚拟滚动配置
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function calculateVirtualScrollItems(
  scrollTop: number,
  totalItems: number,
  options: VirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options;

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    totalItems - 1
  );

  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(totalItems - 1, visibleEnd + overscan);

  return {
    start,
    end,
    offsetY: start * itemHeight,
  };
}

// 内存使用监控
export function getMemoryUsage(): MemoryInfo | null {
  if (typeof window === "undefined" || !("performance" in window)) {
    return null;
  }

  const performance = window.performance as any;
  return performance.memory || null;
}

// 网络状态检测
export function getNetworkInfo(): {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
} {
  if (typeof window === "undefined") return {};

  const navigator = window.navigator as any;
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) return {};

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  };
}

// 自适应加载策略
export function getLoadingStrategy(): {
  shouldPreload: boolean;
  shouldLazyLoad: boolean;
  imageQuality: "low" | "medium" | "high";
} {
  const networkInfo = getNetworkInfo();
  const memoryInfo = getMemoryUsage();

  // 默认策略
  let strategy = {
    shouldPreload: true,
    shouldLazyLoad: false,
    imageQuality: "high" as const,
  };

  // 基于网络状况调整
  if (
    networkInfo.saveData ||
    networkInfo.effectiveType === "slow-2g" ||
    networkInfo.effectiveType === "2g"
  ) {
    strategy.shouldPreload = false;
    strategy.shouldLazyLoad = true;
    strategy.imageQuality = "low";
  } else if (networkInfo.effectiveType === "3g") {
    strategy.shouldPreload = false;
    strategy.shouldLazyLoad = true;
    strategy.imageQuality = "medium";
  }

  // 基于内存状况调整
  if (
    memoryInfo &&
    memoryInfo.usedJSHeapSize > memoryInfo.totalJSHeapSize * 0.8
  ) {
    strategy.shouldPreload = false;
    strategy.shouldLazyLoad = true;
  }

  return strategy;
}

// 缓存管理
class CacheManager {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // 清理过期缓存
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();

// 定期清理缓存
if (typeof window !== "undefined") {
  setInterval(() => {
    cacheManager.cleanup();
  }, 5 * 60 * 1000); // 每5分钟清理一次
}

// 代码分割点标记
export const SPLIT_POINTS = {
  // 页面级分割
  BLOG_PAGE: () => import("@/app/(public)/blog/page"),
  BLOG_POST: () => import("@/app/(public)/blog/[slug]/page"),

  // 组件级分割
  SMART_RECOMMENDATIONS: () =>
    import("@/components/feature/blog/SmartRecommendations"),
  PERFORMANCE_MONITOR: () =>
    import("@/components/analytics/PerformanceMonitor"),
  SEO_ANALYZER: () => import("@/components/seo/SEOAnalyzer"),
  SOCIAL_SHARE: () => import("@/components/feature/blog/SocialShare"),
  FAQ: () => import("@/components/feature/blog/FAQ"),

  // 功能级分割
  SEARCH: () => import("@/components/feature/search/SearchBox"),
  ANALYTICS: () => import("@/lib/analytics/webVitals"),
  RECOMMENDATION_ENGINE: () => import("@/lib/algorithms/recommendation"),
} as const;

// 预加载关键组件
export function preloadCriticalComponents(): void {
  if (typeof window === "undefined") return;

  // 在空闲时间预加载
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      SPLIT_POINTS.SMART_RECOMMENDATIONS();
      SPLIT_POINTS.SOCIAL_SHARE();
    });
  } else {
    // 降级到 setTimeout
    setTimeout(() => {
      SPLIT_POINTS.SMART_RECOMMENDATIONS();
      SPLIT_POINTS.SOCIAL_SHARE();
    }, 2000);
  }
}

// 性能监控
export function measurePerformance(name: string, fn: () => void): void {
  if (typeof window === "undefined" || !("performance" in window)) {
    fn();
    return;
  }

  const start = performance.now();
  fn();
  const end = performance.now();

  console.log(`Performance: ${name} took ${end - start} milliseconds`);
}

// 异步组件包装器
export function withAsyncComponent<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent?: React.ComponentType
) {
  return function AsyncWrapper(props: P) {
    return (
      <React.Suspense
        fallback={
          LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>
        }
      >
        <Component {...props} />
      </React.Suspense>
    );
  };
}
