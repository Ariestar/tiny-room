/**
 * 统一性能监控工具
 * Unified Performance Monitoring Utilities
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

export interface PerformanceMetrics {
  // Core Web Vitals
  cls?: number;
  fid?: number;
  fcp?: number;
  lcp?: number;
  ttfb?: number;
  inp?: number;

  // 自定义指标
  domContentLoaded?: number;
  loadComplete?: number;
  firstPaint?: number;

  // 资源加载
  jsLoadTime?: number;
  cssLoadTime?: number;
  imageLoadTime?: number;

  // 用户交互
  interactionDelay?: number;
  scrollResponsiveness?: number;

  // 内存使用
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
    percentage: number;
  };

  // 网络信息
  networkInfo?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
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

/**
 * 获取性能评级
 */
const getRating = (
  name: WebVitalsMetric["name"],
  value: number
): WebVitalsMetric["rating"] => {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
};

/**
 * 性能监控器
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, WebVitalsMetric> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();
  private callbacks: ((metric: WebVitalsMetric) => void)[] = [];
  private isInitialized = false;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 初始化性能监控
   */
  init() {
    if (this.isInitialized || typeof window === "undefined") return;

    this.initializeObservers();
    this.isInitialized = true;
  }

  /**
   * 初始化性能观察器
   */
  private initializeObservers() {
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
    this.observeINP();
  }

  /**
   * 监控 LCP (Largest Contentful Paint)
   */
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

  /**
   * 监控 FID (First Input Delay)
   */
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

  /**
   * 监控 CLS (Cumulative Layout Shift)
   */
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

  /**
   * 监控 FCP (First Contentful Paint)
   */
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

  /**
   * 监控 TTFB (Time to First Byte)
   */
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

  /**
   * 监控 INP (Interaction to Next Paint)
   */
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

  /**
   * 记录性能指标
   */
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

    // 开发环境下输出指标
    if (process.env.NODE_ENV === "development") {
      console.log(`📊 ${metric.name}:`, {
        value: `${metric.value.toFixed(2)}${name === "CLS" ? "" : "ms"}`,
        rating: metric.rating,
        delta: metric.delta,
      });
    }
  }

  /**
   * 获取导航类型
   */
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

  /**
   * 添加回调函数
   */
  onMetric(callback: (metric: WebVitalsMetric) => void) {
    this.callbacks.push(callback);
  }

  /**
   * 获取所有指标
   */
  getMetrics(): WebVitalsMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * 获取特定指标
   */
  getMetric(name: WebVitalsMetric["name"]): WebVitalsMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * 获取性能评分
   */
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

  /**
   * 清理观察器
   */
  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
    this.callbacks = [];
    this.isInitialized = false;
  }
}

/**
 * 资源加载监控器
 */
export class ResourceMonitor {
  private static instance: ResourceMonitor;
  private resources: Map<string, PerformanceResourceTiming> = new Map();
  private observer: PerformanceObserver | null = null;

  static getInstance(): ResourceMonitor {
    if (!ResourceMonitor.instance) {
      ResourceMonitor.instance = new ResourceMonitor();
    }
    return ResourceMonitor.instance;
  }

  /**
   * 初始化资源监控
   */
  init() {
    if (typeof window === "undefined" || !("PerformanceObserver" in window))
      return;

    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      entries.forEach((entry) => {
        this.resources.set(entry.name, entry);
      });
    });

    try {
      this.observer.observe({ entryTypes: ["resource"] });
    } catch (e) {
      console.warn("Resource observation not supported");
    }
  }

  /**
   * 获取资源加载统计
   */
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

  /**
   * 获取资源类型
   */
  private getResourceType(url: string): string {
    if (url.includes(".js")) return "script";
    if (url.includes(".css")) return "stylesheet";
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i)) return "image";
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return "font";
    return "other";
  }

  /**
   * 清理监控器
   */
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.resources.clear();
  }
}

/**
 * 内存监控器
 */
export class MemoryMonitor {
  private static instance: MemoryMonitor;

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  /**
   * 获取内存使用情况
   */
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

  /**
   * 监控内存泄漏
   */
  detectMemoryLeaks(threshold: number = 80): boolean {
    const usage = this.getMemoryUsage();
    if (!usage) return false;

    if (usage.percentage > threshold) {
      console.warn(`High memory usage detected: ${usage.percentage}%`);
      return true;
    }

    return false;
  }
}

/**
 * 性能预算监控器
 */
export class PerformanceBudget {
  private static budgets = {
    lcp: 2500, // 2.5s
    fid: 100, // 100ms
    cls: 0.1, // 0.1
    fcp: 1800, // 1.8s
    ttfb: 600, // 600ms
    inp: 200, // 200ms
    jsSize: 200000, // 200KB
    cssSize: 50000, // 50KB
    imageSize: 500000, // 500KB
    totalSize: 1000000, // 1MB
  };

  /**
   * 检查是否超出预算
   */
  static checkBudget(metrics: PerformanceMetrics): {
    passed: boolean;
    violations: Array<{
      metric: string;
      actual: number;
      budget: number;
      severity: "warning" | "error";
    }>;
  } {
    const violations: Array<{
      metric: string;
      actual: number;
      budget: number;
      severity: "warning" | "error";
    }> = [];

    // 检查 Core Web Vitals
    if (metrics.lcp && metrics.lcp > this.budgets.lcp) {
      violations.push({
        metric: "LCP",
        actual: metrics.lcp,
        budget: this.budgets.lcp,
        severity: metrics.lcp > this.budgets.lcp * 1.5 ? "error" : "warning",
      });
    }

    if (metrics.fid && metrics.fid > this.budgets.fid) {
      violations.push({
        metric: "FID",
        actual: metrics.fid,
        budget: this.budgets.fid,
        severity: metrics.fid > this.budgets.fid * 2 ? "error" : "warning",
      });
    }

    if (metrics.cls && metrics.cls > this.budgets.cls) {
      violations.push({
        metric: "CLS",
        actual: metrics.cls,
        budget: this.budgets.cls,
        severity: metrics.cls > this.budgets.cls * 2 ? "error" : "warning",
      });
    }

    if (metrics.ttfb && metrics.ttfb > this.budgets.ttfb) {
      violations.push({
        metric: "TTFB",
        actual: metrics.ttfb,
        budget: this.budgets.ttfb,
        severity: metrics.ttfb > this.budgets.ttfb * 1.5 ? "error" : "warning",
      });
    }

    return {
      passed: violations.length === 0,
      violations,
    };
  }

  /**
   * 更新预算配置
   */
  static updateBudgets(newBudgets: Partial<typeof PerformanceBudget.budgets>) {
    Object.assign(this.budgets, newBudgets);
  }

  /**
   * 获取当前预算配置
   */
  static getBudgets() {
    return { ...this.budgets };
  }
}

/**
 * 性能建议生成器
 */
export class PerformanceAdvisor {
  /**
   * 生成性能建议
   */
  static generateAdvice(
    performanceMetrics: WebVitalsMetric[],
    resourceStats: ReturnType<ResourceMonitor["getResourceStats"]>,
    memoryUsage: ReturnType<MemoryMonitor["getMemoryUsage"]>
  ): string[] {
    const advice: string[] = [];

    // Core Web Vitals 建议
    performanceMetrics.forEach((metric) => {
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
          case "INP":
            advice.push("优化交互响应：减少主线程阻塞、优化事件处理器");
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

/**
 * 性能监控管理器 - 统一入口
 */
export class PerformanceManager {
  private static instance: PerformanceManager;
  private performanceMonitor: PerformanceMonitor;
  private resourceMonitor: ResourceMonitor;
  private memoryMonitor: MemoryMonitor;

  private constructor() {
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.resourceMonitor = ResourceMonitor.getInstance();
    this.memoryMonitor = MemoryMonitor.getInstance();
  }

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  /**
   * 初始化所有监控器
   */
  init() {
    this.performanceMonitor.init();
    this.resourceMonitor.init();
  }

  /**
   * 获取完整的性能报告
   */
  getPerformanceReport() {
    const metrics = this.performanceMonitor.getMetrics();
    const resourceStats = this.resourceMonitor.getResourceStats();
    const memoryUsage = this.memoryMonitor.getMemoryUsage();
    const advice = PerformanceAdvisor.generateAdvice(
      metrics,
      resourceStats,
      memoryUsage
    );

    return {
      timestamp: new Date().toISOString(),
      score: this.performanceMonitor.getPerformanceScore(),
      metrics,
      resources: resourceStats,
      memory: memoryUsage,
      advice,
    };
  }

  /**
   * 添加性能指标回调
   */
  onMetric(callback: (metric: WebVitalsMetric) => void) {
    this.performanceMonitor.onMetric(callback);
  }

  /**
   * 清理所有监控器
   */
  disconnect() {
    this.performanceMonitor.disconnect();
    this.resourceMonitor.disconnect();
  }
}

// 导出单例实例
export const performanceManager = PerformanceManager.getInstance();

// 导出工具函数
export const initializePerformanceMonitoring = () => {
  performanceManager.init();
  return performanceManager;
};

export const getPerformanceReport = () => {
  return performanceManager.getPerformanceReport();
};
