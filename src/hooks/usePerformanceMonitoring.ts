"use client";

import { useEffect, useState, useCallback } from "react";
import {
  PerformanceUtils,
  WebVitalsMetric,
  PerformanceMetrics,
} from "@/lib/performance-monitoring";

/**
 * Web Vitals 监控 Hook
 */
export function useWebVitals() {
  const [metrics, setMetrics] = useState<Map<string, WebVitalsMetric>>(
    new Map()
  );
  const [score, setScore] = useState({ score: 0, rating: "poor" as const });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const webVitals = PerformanceUtils.webVitals;

    // 初始化监控
    webVitals.init().then(() => {
      setIsInitialized(true);
    });

    // 监听指标更新
    const handleMetric = (metric: WebVitalsMetric) => {
      setMetrics((prev) => new Map(prev.set(metric.name, metric)));
      setScore(webVitals.getScore());
    };

    webVitals.onMetric(handleMetric);

    // 定期更新分数
    const interval = setInterval(() => {
      setScore(webVitals.getScore());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getMetricValue = useCallback(
    (name: string) => {
      return metrics.get(name)?.value;
    },
    [metrics]
  );

  const getMetricRating = useCallback(
    (name: string) => {
      return metrics.get(name)?.rating;
    },
    [metrics]
  );

  return {
    metrics: Array.from(metrics.values()),
    score,
    isInitialized,
    getMetricValue,
    getMetricRating,
  };
}

/**
 * 性能监控 Hook
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [performanceScore, setPerformanceScore] = useState({
    score: 0,
    breakdown: {} as Record<string, number>,
    recommendations: [] as string[],
  });
  const [budgetStatus, setBudgetStatus] = useState({
    passed: true,
    violations: [] as Array<{
      metric: string;
      actual: number;
      budget: number;
      severity: "warning" | "error";
    }>,
  });

  useEffect(() => {
    const monitor = PerformanceUtils.monitor;

    // 初始化监控
    monitor.init();

    // 定期更新指标
    const updateMetrics = () => {
      const currentMetrics = monitor.getMetrics();
      setMetrics(currentMetrics);

      const score = monitor.getPerformanceScore();
      setPerformanceScore(score);

      const budget = PerformanceUtils.budget.checkBudget(currentMetrics);
      setBudgetStatus(budget);
    };

    // 立即更新一次
    updateMetrics();

    // 定期更新
    const interval = setInterval(updateMetrics, 2000);

    return () => {
      clearInterval(interval);
      monitor.cleanup();
    };
  }, []);

  const recordCustomMetric = useCallback((name: string, value: number) => {
    PerformanceUtils.monitor.recordMetric(name, value);
  }, []);

  return {
    metrics,
    performanceScore,
    budgetStatus,
    recordCustomMetric,
  };
}

/**
 * 资源加载监控 Hook
 */
export function useResourceMonitoring() {
  const [resourceMetrics, setResourceMetrics] = useState({
    jsLoadTime: 0,
    cssLoadTime: 0,
    imageLoadTime: 0,
    totalResources: 0,
    failedResources: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window))
      return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      setResourceMetrics((prev) => {
        const updated = { ...prev };

        entries.forEach((entry) => {
          const resource = entry as PerformanceResourceTiming;
          const loadTime = resource.responseEnd - resource.requestStart;

          updated.totalResources++;

          if (resource.name.includes(".js")) {
            updated.jsLoadTime += loadTime;
          } else if (resource.name.includes(".css")) {
            updated.cssLoadTime += loadTime;
          } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
            updated.imageLoadTime += loadTime;
          }

          // 检查加载失败的资源
          if (resource.transferSize === 0 && resource.decodedBodySize === 0) {
            updated.failedResources++;
          }
        });

        return updated;
      });
    });

    observer.observe({ entryTypes: ["resource"] });

    return () => observer.disconnect();
  }, []);

  return resourceMetrics;
}

/**
 * 内存监控 Hook
 */
export function useMemoryMonitoring() {
  const [memoryInfo, setMemoryInfo] = useState({
    used: 0,
    total: 0,
    limit: 0,
    usagePercentage: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("memory" in performance)) return;

    const updateMemoryInfo = () => {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize;
      const total = memory.totalJSHeapSize;
      const limit = memory.jsHeapSizeLimit;

      setMemoryInfo({
        used,
        total,
        limit,
        usagePercentage: (used / limit) * 100,
      });
    };

    // 立即更新一次
    updateMemoryInfo();

    // 定期更新
    const interval = setInterval(updateMemoryInfo, 1000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

/**
 * 网络状态监控 Hook
 */
export function useNetworkMonitoring() {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: "unknown",
    downlink: 0,
    rtt: 0,
    saveData: false,
    isOnline: true,
  });

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection;

      setNetworkInfo({
        effectiveType: connection?.effectiveType || "unknown",
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false,
        isOnline: navigator.onLine,
      });
    };

    // 立即更新一次
    updateNetworkInfo();

    // 监听网络变化
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener("change", updateNetworkInfo);
    }

    window.addEventListener("online", updateNetworkInfo);
    window.addEventListener("offline", updateNetworkInfo);

    return () => {
      if (connection) {
        connection.removeEventListener("change", updateNetworkInfo);
      }
      window.removeEventListener("online", updateNetworkInfo);
      window.removeEventListener("offline", updateNetworkInfo);
    };
  }, []);

  return networkInfo;
}

/**
 * 性能预算监控 Hook
 */
export function usePerformanceBudget() {
  const [budgets, setBudgets] = useState(PerformanceUtils.budget.getBudgets());
  const [violations, setViolations] = useState<
    Array<{
      metric: string;
      actual: number;
      budget: number;
      severity: "warning" | "error";
    }>
  >([]);

  const { metrics } = usePerformanceMonitoring();

  useEffect(() => {
    const budgetCheck = PerformanceUtils.budget.checkBudget(metrics);
    setViolations(budgetCheck.violations);
  }, [metrics]);

  const updateBudget = useCallback((newBudgets: Partial<typeof budgets>) => {
    PerformanceUtils.budget.updateBudgets(newBudgets);
    setBudgets(PerformanceUtils.budget.getBudgets());
  }, []);

  return {
    budgets,
    violations,
    updateBudget,
    hasViolations: violations.length > 0,
    errorCount: violations.filter((v) => v.severity === "error").length,
    warningCount: violations.filter((v) => v.severity === "warning").length,
  };
}

/**
 * 综合性能监控 Hook
 */
export function useComprehensivePerformance() {
  const webVitals = useWebVitals();
  const performance = usePerformanceMonitoring();
  const resources = useResourceMonitoring();
  const memory = useMemoryMonitoring();
  const network = useNetworkMonitoring();
  const budget = usePerformanceBudget();

  const overallScore = Math.round(
    (webVitals.score.score + performance.performanceScore.score) / 2
  );

  const getOverallRating = () => {
    if (overallScore >= 80) return "good";
    if (overallScore >= 50) return "needs-improvement";
    return "poor";
  };

  const getAllRecommendations = () => {
    const recommendations = [...performance.performanceScore.recommendations];

    if (memory.usagePercentage > 80) {
      recommendations.push("优化内存使用");
    }

    if (network.effectiveType === "2g" || network.effectiveType === "3g") {
      recommendations.push("优化慢速网络体验");
    }

    if (resources.failedResources > 0) {
      recommendations.push("修复资源加载失败问题");
    }

    return recommendations;
  };

  return {
    webVitals,
    performance,
    resources,
    memory,
    network,
    budget,
    overallScore,
    overallRating: getOverallRating(),
    recommendations: getAllRecommendations(),
    isHealthy: overallScore >= 70 && !budget.hasViolations,
  };
}
