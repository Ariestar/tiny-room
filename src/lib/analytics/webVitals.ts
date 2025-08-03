"use client";

import {
  getCLS,
  getFID,
  getFCP,
  getLCP,
  getTTFB,
  onCLS,
  onFID,
  onFCP,
  onLCP,
  onTTFB,
} from "web-vitals";

// Web Vitals 指标接口
export interface WebVitalsMetric {
  id: string;
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB";
  value: number;
  delta: number;
  rating: "good" | "needs-improvement" | "poor";
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

// 性能报告接口
export interface PerformanceReport {
  url: string;
  timestamp: number;
  metrics: WebVitalsMetric[];
  deviceInfo: {
    userAgent: string;
    viewport: { width: number; height: number };
    connectionType?: string;
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  pageInfo: {
    title: string;
    referrer: string;
    loadTime: number;
  };
}

// 获取设备信息
const getDeviceInfo = () => {
  const nav = navigator as any;
  return {
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    connectionType: nav.connection?.effectiveType,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
  };
};

// 获取页面信息
const getPageInfo = () => ({
  title: document.title,
  referrer: document.referrer,
  loadTime: performance.now(),
});

// 发送指标到分析API
const sendMetric = async (metric: WebVitalsMetric) => {
  try {
    await fetch("/api/analytics/web-vitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metric),
    });
  } catch (error) {
    console.error("Failed to send web vitals metric:", error);
  }
};

// 批量发送性能报告
const sendPerformanceReport = async (report: PerformanceReport) => {
  try {
    await fetch("/api/analytics/performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error("Failed to send performance report:", error);
  }
};

// Web Vitals 监控类
export class WebVitalsMonitor {
  private metrics: WebVitalsMetric[] = [];
  private isInitialized = false;
  private reportTimer: NodeJS.Timeout | null = null;

  constructor(
    private options: {
      reportInterval?: number;
      enableAutoReport?: boolean;
      enableConsoleLog?: boolean;
    } = {}
  ) {
    this.options = {
      reportInterval: 30000, // 30秒
      enableAutoReport: true,
      enableConsoleLog: false,
      ...options,
    };
  }

  // 初始化监控
  init() {
    if (this.isInitialized || typeof window === "undefined") return;
    this.isInitialized = true;

    // 监听各项指标
    onCLS(this.handleMetric.bind(this));
    onFID(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));

    // 启动自动报告
    if (this.options.enableAutoReport) {
      this.startAutoReport();
    }

    // 页面卸载时发送最终报告
    window.addEventListener("beforeunload", () => {
      this.sendFinalReport();
    });

    // 页面可见性变化时发送报告
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.sendFinalReport();
      }
    });
  }

  // 处理指标
  private handleMetric(metric: any) {
    const webVitalsMetric: WebVitalsMetric = {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      rating: metric.rating,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...getDeviceInfo(),
    };

    this.metrics.push(webVitalsMetric);

    if (this.options.enableConsoleLog) {
      console.log(`Web Vitals - ${metric.name}:`, metric.value, metric.rating);
    }

    // 立即发送关键指标
    if (["CLS", "FID", "LCP"].includes(metric.name)) {
      sendMetric(webVitalsMetric);
    }
  }

  // 启动自动报告
  private startAutoReport() {
    if (this.reportTimer) return;
    this.reportTimer = setInterval(() => {
      this.sendReport();
    }, this.options.reportInterval);
  }

  // 停止自动报告
  stopAutoReport() {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }
  }

  // 发送报告
  async sendReport() {
    if (this.metrics.length === 0) return;

    const report: PerformanceReport = {
      url: window.location.href,
      timestamp: Date.now(),
      metrics: [...this.metrics],
      deviceInfo: getDeviceInfo(),
      pageInfo: getPageInfo(),
    };

    await sendPerformanceReport(report);
    this.metrics = []; // 清空已发送的指标
  }

  // 发送最终报告
  private sendFinalReport() {
    if (this.metrics.length > 0) {
      // 使用 sendBeacon 确保数据发送
      const report: PerformanceReport = {
        url: window.location.href,
        timestamp: Date.now(),
        metrics: [...this.metrics],
        deviceInfo: getDeviceInfo(),
        pageInfo: getPageInfo(),
      };

      const data = JSON.stringify(report);
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/performance", data);
      } else {
        // 降级到同步请求
        fetch("/api/analytics/performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
          keepalive: true,
        }).catch(console.error);
      }
    }
  }

  // 获取当前指标
  getCurrentMetrics(): WebVitalsMetric[] {
    return [...this.metrics];
  }

  // 获取指标摘要
  getMetricsSummary() {
    const summary: Record<
      string,
      { value: number; rating: string; count: number }
    > = {};
    this.metrics.forEach((metric) => {
      if (!summary[metric.name]) {
        summary[metric.name] = { value: 0, rating: "good", count: 0 };
      }
      summary[metric.name].value = metric.value; // 使用最新值
      summary[metric.name].rating = metric.rating;
      summary[metric.name].count++;
    });
    return summary;
  }

  // 销毁监控器
  destroy() {
    this.stopAutoReport();
    this.metrics = [];
    this.isInitialized = false;
  }
}

// 全局监控器实例
let globalMonitor: WebVitalsMonitor | null = null;

// 初始化全局监控
export const initWebVitalsMonitoring = (options?: {
  reportInterval?: number;
  enableAutoReport?: boolean;
  enableConsoleLog?: boolean;
}) => {
  if (typeof window === "undefined") return;

  if (!globalMonitor) {
    globalMonitor = new WebVitalsMonitor(options);
  }
  globalMonitor.init();
  return globalMonitor;
};

// 获取全局监控器
export const getWebVitalsMonitor = () => globalMonitor;

// 手动获取所有指标
export const getAllWebVitals = async (): Promise<{
  cls: number;
  fid: number;
  fcp: number;
  lcp: number;
  ttfb: number;
}> => {
  return new Promise((resolve) => {
    const metrics = { cls: 0, fid: 0, fcp: 0, lcp: 0, ttfb: 0 };
    let collected = 0;
    const total = 5;

    const checkComplete = () => {
      collected++;
      if (collected === total) {
        resolve(metrics);
      }
    };

    getCLS((metric) => {
      metrics.cls = metric.value;
      checkComplete();
    });

    getFID((metric) => {
      metrics.fid = metric.value;
      checkComplete();
    });

    getFCP((metric) => {
      metrics.fcp = metric.value;
      checkComplete();
    });

    getLCP((metric) => {
      metrics.lcp = metric.value;
      checkComplete();
    });

    getTTFB((metric) => {
      metrics.ttfb = metric.value;
      checkComplete();
    });

    // 超时处理
    setTimeout(() => {
      resolve(metrics);
    }, 5000);
  });
};

// 性能评分函数
export const getPerformanceScore = (metrics: {
  cls: number;
  fid: number;
  fcp: number;
  lcp: number;
  ttfb: number;
}): number => {
  const weights = {
    lcp: 0.25,
    fid: 0.25,
    cls: 0.25,
    fcp: 0.15,
    ttfb: 0.1,
  };

  const scores = {
    lcp: metrics.lcp <= 2500 ? 100 : metrics.lcp <= 4000 ? 50 : 0,
    fid: metrics.fid <= 100 ? 100 : metrics.fid <= 300 ? 50 : 0,
    cls: metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 50 : 0,
    fcp: metrics.fcp <= 1800 ? 100 : metrics.fcp <= 3000 ? 50 : 0,
    ttfb: metrics.ttfb <= 800 ? 100 : metrics.ttfb <= 1800 ? 50 : 0,
  };

  return Math.round(
    scores.lcp * weights.lcp +
      scores.fid * weights.fid +
      scores.cls * weights.cls +
      scores.fcp * weights.fcp +
      scores.ttfb * weights.ttfb
  );
};
