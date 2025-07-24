/**
 * 统一性能监控 Hook
 * Unified Performance Monitoring Hook
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  performanceManager,
  type WebVitalsMetric,
} from "@/lib/performance/monitor";

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

export interface PerformanceState {
  metrics: WebVitalsMetric[];
  score: number;
  isLoading: boolean;
  error: string | null;
  report: ReturnType<typeof performanceManager.getPerformanceReport> | null;
}

/**
 * 性能监控 Hook
 */
export function usePerformance() {
  const [state, setState] = useState<PerformanceState>({
    metrics: [],
    score: 0,
    isLoading: true,
    error: null,
    report: null,
  });

  const callbackRef = useRef<((metric: WebVitalsMetric) => void) | null>(null);

  // 处理性能指标更新
  const handleMetricUpdate = useCallback((metric: WebVitalsMetric) => {
    setState((prev) => ({
      ...prev,
      metrics: [...prev.metrics.filter((m) => m.name !== metric.name), metric],
      score: performanceManager.getPerformanceReport().score,
    }));
  }, []);

  // 获取完整性能报告
  const getReport = useCallback(() => {
    try {
      const report = performanceManager.getPerformanceReport();
      setState((prev) => ({
        ...prev,
        report,
        score: report.score,
        isLoading: false,
        error: null,
      }));
      return report;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      }));
      return null;
    }
  }, []);

  // 初始化性能监控
  useEffect(() => {
    try {
      performanceManager.init();

      // 设置回调
      callbackRef.current = handleMetricUpdate;
      performanceManager.onMetric(handleMetricUpdate);

      // 获取初始报告
      setTimeout(() => {
        getReport();
      }, 1000); // 延迟1秒获取初始数据
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to initialize performance monitoring",
        isLoading: false,
      }));
    }

    return () => {
      // 清理时不需要移除回调，因为performanceManager是单例
    };
  }, [handleMetricUpdate, getReport]);

  return {
    ...state,
    refresh: getReport,
    clearError: () => setState((prev) => ({ ...prev, error: null })),
  };
}

/**
 * Web Vitals 监控 Hook
 */
export function useWebVitals() {
  const [metrics, setMetrics] = useState<WebVitalsMetric[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleMetric = (metric: WebVitalsMetric) => {
      setMetrics((prev) => [
        ...prev.filter((m) => m.name !== metric.name),
        metric,
      ]);
    };

    performanceManager.init();
    performanceManager.onMetric(handleMetric);

    // 定期更新评分
    const interval = setInterval(() => {
      const report = performanceManager.getPerformanceReport();
      setScore(report.score);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    metrics,
    score,
    getMetric: (name: WebVitalsMetric["name"]) =>
      metrics.find((m) => m.name === name),
  };
}

/**
 * 性能预算监控 Hook
 */
export function usePerformanceBudget(budgets?: Record<string, number>) {
  const [violations, setViolations] = useState<
    Array<{
      metric: string;
      actual: number;
      budget: number;
      severity: "warning" | "error";
    }>
  >([]);

  const { metrics } = useWebVitals();

  useEffect(() => {
    if (!budgets || metrics.length === 0) return;

    const newViolations: typeof violations = [];

    metrics.forEach((metric) => {
      const budget = budgets[metric.name.toLowerCase()];
      if (budget && metric.value > budget) {
        newViolations.push({
          metric: metric.name,
          actual: metric.value,
          budget,
          severity: metric.value > budget * 1.5 ? "error" : "warning",
        });
      }
    });

    setViolations(newViolations);
  }, [metrics, budgets]);

  return {
    violations,
    hasViolations: violations.length > 0,
    errorCount: violations.filter((v) => v.severity === "error").length,
    warningCount: violations.filter((v) => v.severity === "warning").length,
  };
}

/**
 * 内存监控 Hook
 */
export function useMemoryMonitoring() {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    limit: number;
    percentage: number;
  } | null>(null);

  const [isHighUsage, setIsHighUsage] = useState(false);

  useEffect(() => {
    const updateMemoryUsage = () => {
      if (typeof window === "undefined" || !("memory" in performance)) return;

      const memory = (performance as any).memory;
      const usage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: Math.round(
          (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        ),
      };

      setMemoryUsage(usage);
      setIsHighUsage(usage.percentage > 80);
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    memoryUsage,
    isHighUsage,
    formatSize: (bytes: number) => {
      const mb = bytes / (1024 * 1024);
      return `${mb.toFixed(2)} MB`;
    },
  };
}

/**
 * 网络状态监控 Hook
 */
export function useNetworkMonitoring() {
  const [networkInfo, setNetworkInfo] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  } | null>(null);

  const [isOnline, setIsOnline] = useState(true);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const updateNetworkInfo = () => {
      if (typeof navigator === "undefined" || !("connection" in navigator))
        return;

      const connection = (navigator as any).connection;
      if (connection) {
        const info = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        };

        setNetworkInfo(info);
        setIsSlowConnection(
          ["slow-2g", "2g", "3g"].includes(info.effectiveType)
        );
      }
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // 初始状态
    setIsOnline(navigator.onLine);
    updateNetworkInfo();

    // 监听网络变化
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if ("connection" in navigator) {
      (navigator as any).connection.addEventListener(
        "change",
        updateNetworkInfo
      );
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if ("connection" in navigator) {
        (navigator as any).connection.removeEventListener(
          "change",
          updateNetworkInfo
        );
      }
    };
  }, []);

  return {
    networkInfo,
    isOnline,
    isSlowConnection,
    connectionType: networkInfo?.effectiveType || "unknown",
  };
}

/**
 * 资源加载监控 Hook
 */
export function useResourceMonitoring() {
  const [resourceStats, setResourceStats] = useState<{
    total: number;
    byType: Record<string, number>;
    totalSize: number;
    totalDuration: number;
    slowest: PerformanceResourceTiming | null;
    largest: PerformanceResourceTiming | null;
  } | null>(null);

  useEffect(() => {
    const updateResourceStats = () => {
      const report = performanceManager.getPerformanceReport();
      if (report.resources) {
        setResourceStats(report.resources);
      }
    };

    updateResourceStats();
    const interval = setInterval(updateResourceStats, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    resourceStats,
    formatSize: (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    },
    formatDuration: (ms: number) => `${ms.toFixed(2)} ms`,
  };
}

/**
 * 综合性能监控 Hook
 */
export function useComprehensivePerformance() {
  const performance = usePerformance();
  const webVitals = useWebVitals();
  const memory = useMemoryMonitoring();
  const network = useNetworkMonitoring();
  const resources = useResourceMonitoring();

  return {
    performance,
    webVitals,
    memory,
    network,
    resources,

    // 综合状态
    overallHealth: {
      score: performance.score,
      isHealthy: performance.score > 80,
      hasIssues:
        performance.score < 60 || memory.isHighUsage || !network.isOnline,
      criticalIssues: performance.score < 40 || memory.isHighUsage,
    },
  };
}
