/**
 * 性能监控工具库
 * Performance Monitoring Utilities
 */

// Core Web Vitals 类型定义
export interface WebVitalsMetric {
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: "navigate" | "reload" | "back_forward" | "prerender";
}

export interface PerformanceMetrics {
  // Core Web Vitals
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  ttfb?: number; // Time to First Byte

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
  };

  // 网络信息
  networkInfo?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
}

/**
 * Core Web Vitals 监控器
 */
export class WebVitalsMonitor {
  private static instance: WebVitalsMonitor;
  private metrics: Map<string, WebVitalsMetric> = new Map();
  private callbacks: Array<(metric: WebVitalsMetric) => void> = [];
  private isInitialized = false;

  static getInstance(): WebVitalsMonitor {
    if (!WebVitalsMonitor.instance) {
      WebVitalsMonitor.instance = new WebVitalsMonitor();
    }
    return WebVitalsMonitor.instance;
  }

  /**
   * 初始化监控
   */
  async init() {
    if (this.isInitialized || typeof window === "undefined") return;

    try {
      // 动态导入 web-vitals 库
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
        "web-vitals"
      );

      // 监控各项指标
      getCLS(this.handleMetric.bind(this));
      getFID(this.handleMetric.bind(this));
      getFCP(this.handleMetric.bind(this));
      getLCP(this.handleMetric.bind(this));
      getTTFB(this.handleMetric.bind(this));

      this.isInitialized = true;
    } catch (error) {
      console.warn("Failed to initialize Web Vitals monitoring:", error);
    }
  }

  /**
   * 处理指标数据
   */
  private handleMetric(metric: WebVitalsMetric) {
    this.metrics.set(metric.name, metric);

    // 触发回调
    this.callbacks.forEach((callback) => {
      try {
        callback(metric);
      } catch (error) {
        console.error("Error in Web Vitals callback:", error);
      }
    });

    // 开发环境下输出指标
    if (process.env.NODE_ENV === "development") {
      console.log(`📊 ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    }
  }

  /**
   * 添加指标回调
   */
  onMetric(callback: (metric: WebVitalsMetric) => void) {
    this.callbacks.push(callback);
  }

  /**
   * 获取当前指标
   */
  getMetrics(): Map<string, WebVitalsMetric> {
    return new Map(this.metrics);
  }

  /**
   * 获取指标评分
   */
  getScore(): { score: number; rating: "good" | "needs-improvement" | "poor" } {
    const metrics = Array.from(this.metrics.values());
    if (metrics.length === 0) return { score: 0, rating: "poor" };

    const scores = {
      good: 100,
      "needs-improvement": 50,
      poor: 0,
    };

    const totalScore = metrics.reduce(
      (sum, metric) => sum + scores[metric.rating],
      0
    );
    const averageScore = totalScore / metrics.length;

    let rating: "good" | "needs-improvement" | "poor" = "poor";
    if (averageScore >= 80) rating = "good";
    else if (averageScore >= 50) rating = "needs-improvement";

    return { score: averageScore, rating };
  }
}

/**
 * 性能监控管理器
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {};
  private observers: Map<string, PerformanceObserver> = new Map();
  private startTime = performance.now();

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
    if (typeof window === "undefined") return;

    this.initNavigationTiming();
    this.initResourceTiming();
    this.initMemoryMonitoring();
    this.initNetworkMonitoring();
    this.initUserInteractionMonitoring();
  }

  /**
   * 初始化导航时间监控
   */
  private initNavigationTiming() {
    if ("performance" in window && "getEntriesByType" in performance) {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        this.metrics.domContentLoaded =
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart;
        this.metrics.loadComplete =
          navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      }
    }
  }

  /**
   * 初始化资源时间监控
   */
  private initResourceTiming() {
    if (!("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        const loadTime = resource.responseEnd - resource.requestStart;

        if (resource.name.includes(".js")) {
          this.metrics.jsLoadTime = (this.metrics.jsLoadTime || 0) + loadTime;
        } else if (resource.name.includes(".css")) {
          this.metrics.cssLoadTime = (this.metrics.cssLoadTime || 0) + loadTime;
        } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
          this.metrics.imageLoadTime =
            (this.metrics.imageLoadTime || 0) + loadTime;
        }
      });
    });

    observer.observe({ entryTypes: ["resource"] });
    this.observers.set("resource", observer);
  }

  /**
   * 初始化内存监控
   */
  private initMemoryMonitoring() {
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };

      // 定期更新内存使用情况
      setInterval(() => {
        this.metrics.memoryUsage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        };
      }, 5000);
    }
  }

  /**
   * 初始化网络监控
   */
  private initNetworkMonitoring() {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.networkInfo = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };

      // 监听网络变化
      connection.addEventListener("change", () => {
        this.metrics.networkInfo = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        };
      });
    }
  }

  /**
   * 初始化用户交互监控
   */
  private initUserInteractionMonitoring() {
    let interactionStart = 0;

    // 监控点击延迟
    document.addEventListener("pointerdown", () => {
      interactionStart = performance.now();
    });

    document.addEventListener("click", () => {
      if (interactionStart > 0) {
        this.metrics.interactionDelay = performance.now() - interactionStart;
        interactionStart = 0;
      }
    });

    // 监控滚动响应性
    let scrollStart = 0;
    document.addEventListener("scroll", () => {
      if (scrollStart === 0) {
        scrollStart = performance.now();
        requestAnimationFrame(() => {
          this.metrics.scrollResponsiveness = performance.now() - scrollStart;
          scrollStart = 0;
        });
      }
    });
  }

  /**
   * 记录自定义指标
   */
  recordMetric(name: string, value: number) {
    (this.metrics as any)[name] = value;
  }

  /**
   * 获取所有指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 获取性能评分
   */
  getPerformanceScore(): {
    score: number;
    breakdown: Record<string, number>;
    recommendations: string[];
  } {
    const metrics = this.getMetrics();
    const scores: Record<string, number> = {};
    const recommendations: string[] = [];

    // LCP 评分 (< 2.5s = 100, < 4s = 50, >= 4s = 0)
    if (metrics.lcp) {
      if (metrics.lcp < 2500) scores.lcp = 100;
      else if (metrics.lcp < 4000) scores.lcp = 50;
      else scores.lcp = 0;

      if (scores.lcp < 100) {
        recommendations.push("优化 Largest Contentful Paint (LCP)");
      }
    }

    // FID 评分 (< 100ms = 100, < 300ms = 50, >= 300ms = 0)
    if (metrics.fid) {
      if (metrics.fid < 100) scores.fid = 100;
      else if (metrics.fid < 300) scores.fid = 50;
      else scores.fid = 0;

      if (scores.fid < 100) {
        recommendations.push("减少 First Input Delay (FID)");
      }
    }

    // CLS 评分 (< 0.1 = 100, < 0.25 = 50, >= 0.25 = 0)
    if (metrics.cls) {
      if (metrics.cls < 0.1) scores.cls = 100;
      else if (metrics.cls < 0.25) scores.cls = 50;
      else scores.cls = 0;

      if (scores.cls < 100) {
        recommendations.push("减少 Cumulative Layout Shift (CLS)");
      }
    }

    // 资源加载时间评分
    if (metrics.jsLoadTime && metrics.jsLoadTime > 1000) {
      scores.jsLoad = Math.max(0, 100 - (metrics.jsLoadTime - 1000) / 50);
      recommendations.push("优化 JavaScript 加载时间");
    }

    if (metrics.imageLoadTime && metrics.imageLoadTime > 2000) {
      scores.imageLoad = Math.max(
        0,
        100 - (metrics.imageLoadTime - 2000) / 100
      );
      recommendations.push("优化图片加载时间");
    }

    // 内存使用评分
    if (metrics.memoryUsage) {
      const memoryUsageRatio =
        metrics.memoryUsage.used / metrics.memoryUsage.limit;
      scores.memory = Math.max(0, 100 - memoryUsageRatio * 100);

      if (memoryUsageRatio > 0.8) {
        recommendations.push("优化内存使用");
      }
    }

    const scoreValues = Object.values(scores);
    const totalScore =
      scoreValues.length > 0
        ? scoreValues.reduce((sum, score) => sum + score, 0) /
          scoreValues.length
        : 0;

    return {
      score: Math.round(totalScore),
      breakdown: scores,
      recommendations,
    };
  }

  /**
   * 清理监控器
   */
  cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

/**
 * 性能预算监控
 */
export class PerformanceBudget {
  private static budgets = {
    lcp: 2500, // 2.5s
    fid: 100, // 100ms
    cls: 0.1, // 0.1
    ttfb: 600, // 600ms
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
 * 性能监控工具集合
 */
export const PerformanceUtils = {
  webVitals: WebVitalsMonitor.getInstance(),
  monitor: PerformanceMonitor.getInstance(),
  budget: PerformanceBudget,
};
