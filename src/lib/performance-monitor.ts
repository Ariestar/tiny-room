/**
 * 性能监控工具
 * 提供 Core Web Vitals 监控和性能分析功能
 */

// Core Web Vitals 类型定义
export interface WebVitalsMetric {
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB" | "INP";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: "navigate" | "reload" | "back-forward" | "prerender";
}

// 性能指标阈值
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

// 获取性能评级
const getRating = (
  name: WebVitalsMetric["name"],
  value: number
): WebVitalsMetric["rating"] => {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
};

// 性能监控类
export class PerformanceMonitor {
  private metrics: Map<string, WebVitalsMetric> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();
  private callbacks: ((metric: WebVitalsMetric) => void)[] = [];

  constructor() {
    this.initializeObservers();
  }

  // 初始化性能观察器
  private initializeObservers() {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint (LCP)
    this.observeLCP();

    // First Input Delay (FID)
    this.observeFID();

    // Cumulative Layout Shift (CLS)
    this.observeCLS();

    // First Contentful Paint (FCP)
    this.observeFCP();

    // Time to First Byte (TTFB)
    this.observeTTFB();

    // Interaction to Next Paint (INP)
    this.observeINP();
  }

  // 监控 LCP
  private observeLCP() {
    if (!("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        renderTime?: number;
        loadTime?: number;
      };

      if (lastEntry) {
        const value =
          lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;
        this.recordMetric("LCP", value);
      }
    });

    try {
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.set("LCP", observer);
    } catch (e) {
      console.warn("LCP observation not supported");
    }
  }

  // 监控 FID
  private observeFID() {
    if (!("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.processingStart && entry.startTime) {
          const value = entry.processingStart - entry.startTime;
          this.recordMetric("FID", value);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ["first-input"] });
      this.observers.set("FID", observer);
    } catch (e) {
      console.warn("FID observation not supported");
    }
  }

  // 监控 CLS
  private observeCLS() {
    if (!("PerformanceObserver" in window)) return;

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (
            sessionValue &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            this.recordMetric("CLS", clsValue);
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ["layout-shift"] });
      this.observers.set("CLS", observer);
    } catch (e) {
      console.warn("CLS observation not supported");
    }
  }

  // 监控 FCP
  private observeFCP() {
    if (!("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(
        (entry) => entry.name === "first-contentful-paint"
      );

      if (fcpEntry) {
        this.recordMetric("FCP", fcpEntry.startTime);
      }
    });

    try {
      observer.observe({ entryTypes: ["paint"] });
      this.observers.set("FCP", observer);
    } catch (e) {
      console.warn("FCP observation not supported");
    }
  }

  // 监控 TTFB
  private observeTTFB() {
    if (!("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.responseStart && entry.requestStart) {
          const value = entry.responseStart - entry.requestStart;
          this.recordMetric("TTFB", value);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ["navigation"] });
      this.observers.set("TTFB", observer);
    } catch (e) {
      console.warn("TTFB observation not supported");
    }
  }

  // 监控 INP
  private observeINP() {
    if (!("PerformanceObserver" in window)) return;

    let longestInteraction = 0;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.duration > longestInteraction) {
          longestInteraction = entry.duration;
          this.recordMetric("INP", longestInteraction);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ["event"] });
      this.observers.set("INP", observer);
    } catch (e) {
      console.warn("INP observation not supported");
    }
  }

  // 记录性能指标
  private recordMetric(name: WebVitalsMetric["name"], value: number) {
    const existing = this.metrics.get(name);
    const delta = existing ? value - existing.value : value;

    const metric: WebVitalsMetric = {
      name,
      value,
      rating: getRating(name, value),
      delta,
      id: `${name}-${Date.now()}`,
      navigationType: this.getNavigationType(),
    };

    this.metrics.set(name, metric);
    this.callbacks.forEach((callback) => callback(metric));
  }

  // 获取导航类型
  private getNavigationType(): WebVitalsMetric["navigationType"] {
    if (typeof window === "undefined") return "navigate";

    const navigation = (performance as any).navigation;
    if (navigation) {
      return navigation.type;
    }

    // 回退到 performance.navigation
    const legacyNavigation = (performance as any).navigation;
    if (legacyNavigation) {
      switch (legacyNavigation.type) {
        case 1:
          return "reload";
        case 2:
          return "back-forward";
        default:
          return "navigate";
      }
    }

    return "navigate";
  }

  // 添加回调函数
  onMetric(callback: (metric: WebVitalsMetric) => void) {
    this.callbacks.push(callback);
  }

  // 获取所有指标
  getMetrics(): WebVitalsMetric[] {
    return Array.from(this.metrics.values());
  }

  // 获取特定指标
  getMetric(name: WebVitalsMetric["name"]): WebVitalsMetric | undefined {
    return this.metrics.get(name);
  }

  // 获取性能评分
  getPerformanceScore(): number {
    const metrics = this.getMetrics();
    if (metrics.length === 0) return 0;

    const scores = metrics.map((metric) => {
      switch (metric.rating) {
        case "good":
          return 100;
        case "needs-improvement":
          return 50;
        case "poor":
          return 0;
        default:
          return 0;
      }
    });

    return Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
  }

  // 清理观察器
  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
    this.callbacks = [];
  }
}

// 资源加载监控
export class ResourceMonitor {
  private resources: Map<string, PerformanceResourceTiming> = new Map();

  constructor() {
    this.initializeObserver();
  }

  private initializeObserver() {
    if (typeof window === "undefined" || !("PerformanceObserver" in window))
      return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      entries.forEach((entry) => {
        this.resources.set(entry.name, entry);
      });
    });

    try {
      observer.observe({ entryTypes: ["resource"] });
    } catch (e) {
      console.warn("Resource observation not supported");
    }
  }

  // 获取资源加载统计
  getResourceStats() {
    const resources = Array.from(this.resources.values());

    const stats = {
      total: resources.length,
      byType: {} as Record<string, number>,
      totalSize: 0,
      totalDuration: 0,
      slowest: null as PerformanceResourceTiming | null,
      largest: null as PerformanceResourceTiming | null,
    };

    resources.forEach((resource) => {
      // 按类型分组
      const type = this.getResourceType(resource.name);
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // 计算总大小
      if (resource.transferSize) {
        stats.totalSize += resource.transferSize;
      }

      // 计算总时长
      const duration = resource.responseEnd - resource.startTime;
      stats.totalDuration += duration;

      // 找出最慢的资源
      if (
        !stats.slowest ||
        duration > stats.slowest.responseEnd - stats.slowest.startTime
      ) {
        stats.slowest = resource;
      }

      // 找出最大的资源
      if (
        !stats.largest ||
        (resource.transferSize || 0) > (stats.largest.transferSize || 0)
      ) {
        stats.largest = resource;
      }
    });

    return stats;
  }

  private getResourceType(url: string): string {
    if (url.includes(".js")) return "script";
    if (url.includes(".css")) return "stylesheet";
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return "image";
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return "font";
    return "other";
  }
}

// 内存监控
export class MemoryMonitor {
  // 获取内存使用情况
  getMemoryUsage() {
    if (typeof window === "undefined") return null;

    const memory = (performance as any).memory;
    if (!memory) return null;

    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      percentage: Math.round(
        (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      ),
    };
  }

  // 监控内存泄漏
  detectMemoryLeaks(threshold: number = 80) {
    const usage = this.getMemoryUsage();
    if (!usage) return false;

    if (usage.percentage > threshold) {
      console.warn(`High memory usage detected: ${usage.percentage}%`);
      return true;
    }

    return false;
  }
}

// 性能建议生成器
export class PerformanceAdvisor {
  constructor(
    private performanceMonitor: PerformanceMonitor,
    private resourceMonitor: ResourceMonitor,
    private memoryMonitor: MemoryMonitor
  ) {}

  // 生成性能建议
  generateAdvice(): string[] {
    const advice: string[] = [];
    const metrics = this.performanceMonitor.getMetrics();
    const resourceStats = this.resourceMonitor.getResourceStats();
    const memoryUsage = this.memoryMonitor.getMemoryUsage();

    // Core Web Vitals 建议
    metrics.forEach((metric) => {
      if (metric.rating === "poor") {
        switch (metric.name) {
          case "LCP":
            advice.push(
              "优化最大内容绘制时间：压缩图片、使用CDN、优化服务器响应时间"
            );
            break;
          case "FID":
            advice.push(
              "改善首次输入延迟：减少JavaScript执行时间、使用Web Workers"
            );
            break;
          case "CLS":
            advice.push("减少累积布局偏移：为图片设置尺寸、避免动态插入内容");
            break;
          case "FCP":
            advice.push("优化首次内容绘制：内联关键CSS、优化字体加载");
            break;
          case "TTFB":
            advice.push("改善首字节时间：优化服务器配置、使用缓存");
            break;
        }
      }
    });

    // 资源加载建议
    if (resourceStats.totalSize > 2000000) {
      // 2MB
      advice.push("总资源大小过大，考虑代码分割和懒加载");
    }

    if (resourceStats.byType.image > 20) {
      advice.push("图片资源过多，考虑使用图片懒加载和WebP格式");
    }

    if (resourceStats.byType.script > 10) {
      advice.push("JavaScript文件过多，考虑合并和压缩");
    }

    // 内存使用建议
    if (memoryUsage && memoryUsage.percentage > 70) {
      advice.push("内存使用率较高，检查是否存在内存泄漏");
    }

    return advice;
  }
}

// 全局性能监控实例
let globalPerformanceMonitor: PerformanceMonitor | null = null;
let globalResourceMonitor: ResourceMonitor | null = null;
let globalMemoryMonitor: MemoryMonitor | null = null;

// 初始化性能监控
export const initializePerformanceMonitoring = () => {
  if (typeof window === "undefined") return;

  globalPerformanceMonitor = new PerformanceMonitor();
  globalResourceMonitor = new ResourceMonitor();
  globalMemoryMonitor = new MemoryMonitor();

  // 监控性能指标
  globalPerformanceMonitor.onMetric((metric) => {
    console.log(
      `Performance metric: ${metric.name} = ${metric.value.toFixed(2)}ms (${
        metric.rating
      })`
    );

    // 发送到分析服务（可选）
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "web_vitals", {
        event_category: "Performance",
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: { metric_rating: metric.rating },
      });
    }
  });

  return {
    performanceMonitor: globalPerformanceMonitor,
    resourceMonitor: globalResourceMonitor,
    memoryMonitor: globalMemoryMonitor,
  };
};

// 获取性能监控实例
export const getPerformanceMonitors = () => ({
  performanceMonitor: globalPerformanceMonitor,
  resourceMonitor: globalResourceMonitor,
  memoryMonitor: globalMemoryMonitor,
});

// 性能报告生成
export const generatePerformanceReport = () => {
  const monitors = getPerformanceMonitors();
  if (!monitors.performanceMonitor) return null;

  const metrics = monitors.performanceMonitor.getMetrics();
  const resourceStats = monitors.resourceMonitor?.getResourceStats();
  const memoryUsage = monitors.memoryMonitor?.getMemoryUsage();
  const advisor = new PerformanceAdvisor(
    monitors.performanceMonitor,
    monitors.resourceMonitor!,
    monitors.memoryMonitor!
  );

  return {
    timestamp: new Date().toISOString(),
    score: monitors.performanceMonitor.getPerformanceScore(),
    metrics,
    resources: resourceStats,
    memory: memoryUsage,
    advice: advisor.generateAdvice(),
  };
};
