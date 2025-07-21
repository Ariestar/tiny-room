"use client";

import { useEffect, useState, useCallback } from "react";
import {
  PerformanceMonitor,
  ResourceMonitor,
  MemoryMonitor,
  WebVitalsMetric,
  initializePerformanceMonitoring,
  generatePerformanceReport,
} from "@/lib/performance-monitor";

// 性能监控 Hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<WebVitalsMetric[]>([]);
  const [performanceScore, setPerformanceScore] = useState<number>(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    const monitors = initializePerformanceMonitoring();

    if (monitors?.performanceMonitor) {
      setIsMonitoring(true);

      // 监听性能指标更新
      monitors.performanceMonitor.onMetric((metric) => {
        setMetrics((prev) => {
          const updated = prev.filter((m) => m.name !== metric.name);
          return [...updated, metric];
        });

        setPerformanceScore(monitors.performanceMonitor!.getPerformanceScore());
      });
    }

    return () => {
      // 清理监控器
      monitors?.performanceMonitor?.disconnect();
    };
  }, []);

  const getReport = useCallback(() => {
    return generatePerformanceReport();
  }, []);

  const getMetricByName = useCallback(
    (name: WebVitalsMetric["name"]) => {
      return metrics.find((m) => m.name === name);
    },
    [metrics]
  );

  return {
    metrics,
    performanceScore,
    isMonitoring,
    getReport,
    getMetricByName,
  };
};

// 资源监控 Hook
export const useResourceMonitor = () => {
  const [resourceStats, setResourceStats] = useState<any>(null);

  useEffect(() => {
    const resourceMonitor = new ResourceMonitor();

    // 定期更新资源统计
    const interval = setInterval(() => {
      setResourceStats(resourceMonitor.getResourceStats());
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return resourceStats;
};

// 内存监控 Hook
export const useMemoryMonitor = () => {
  const [memoryUsage, setMemoryUsage] = useState<any>(null);
  const [memoryWarning, setMemoryWarning] = useState(false);

  useEffect(() => {
    const memoryMonitor = new MemoryMonitor();

    const updateMemoryUsage = () => {
      const usage = memoryMonitor.getMemoryUsage();
      setMemoryUsage(usage);

      if (usage) {
        const isHighUsage = memoryMonitor.detectMemoryLeaks(80);
        setMemoryWarning(isHighUsage);
      }
    };

    // 立即更新一次
    updateMemoryUsage();

    // 定期更新内存使用情况
    const interval = setInterval(updateMemoryUsage, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    memoryUsage,
    memoryWarning,
  };
};

// 页面加载性能监控 Hook
export const usePageLoadPerformance = () => {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [domContentLoaded, setDomContentLoaded] = useState<number | null>(null);
  const [firstPaint, setFirstPaint] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 获取页面加载时间
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      setLoadTime(navigation.loadEventEnd - navigation.navigationStart);
      setDomContentLoaded(
        navigation.domContentLoadedEventEnd - navigation.navigationStart
      );
    }

    // 获取首次绘制时间
    const paintEntries = performance.getEntriesByType("paint");
    const firstPaintEntry = paintEntries.find(
      (entry) => entry.name === "first-paint"
    );
    if (firstPaintEntry) {
      setFirstPaint(firstPaintEntry.startTime);
    }
  }, []);

  return {
    loadTime,
    domContentLoaded,
    firstPaint,
  };
};

// 组件渲染性能监控 Hook
export const useRenderPerformance = (componentName: string) => {
  const [renderCount, setRenderCount] = useState(0);
  const [renderTimes, setRenderTimes] = useState<number[]>([]);

  useEffect(() => {
    const startTime = performance.now();

    setRenderCount((prev) => prev + 1);

    // 在下一个事件循环中计算渲染时间
    setTimeout(() => {
      const renderTime = performance.now() - startTime;
      setRenderTimes((prev) => [...prev.slice(-9), renderTime]); // 保留最近10次渲染时间

      if (renderTime > 16) {
        // 超过一帧的时间
        console.warn(
          `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }
    }, 0);
  });

  const averageRenderTime =
    renderTimes.length > 0
      ? renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
      : 0;

  return {
    renderCount,
    renderTimes,
    averageRenderTime,
    lastRenderTime: renderTimes[renderTimes.length - 1] || 0,
  };
};

// 网络性能监控 Hook
export const useNetworkPerformance = () => {
  const [connectionType, setConnectionType] = useState<string>("unknown");
  const [effectiveType, setEffectiveType] = useState<string>("unknown");
  const [downlink, setDownlink] = useState<number>(0);
  const [rtt, setRtt] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      const updateConnectionInfo = () => {
        setConnectionType(connection.type || "unknown");
        setEffectiveType(connection.effectiveType || "unknown");
        setDownlink(connection.downlink || 0);
        setRtt(connection.rtt || 0);
      };

      updateConnectionInfo();

      connection.addEventListener("change", updateConnectionInfo);

      return () => {
        connection.removeEventListener("change", updateConnectionInfo);
      };
    }
  }, []);

  return {
    connectionType,
    effectiveType,
    downlink,
    rtt,
    isSlowConnection: effectiveType === "slow-2g" || effectiveType === "2g",
  };
};

// 用户交互性能监控 Hook
export const useInteractionPerformance = () => {
  const [interactions, setInteractions] = useState<
    Array<{
      type: string;
      duration: number;
      timestamp: number;
    }>
  >([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const measureInteraction = (type: string) => (event: Event) => {
      const startTime = performance.now();

      // 在下一个事件循环中测量处理时间
      setTimeout(() => {
        const duration = performance.now() - startTime;

        setInteractions((prev) => [
          ...prev.slice(-19), // 保留最近20次交互
          {
            type,
            duration,
            timestamp: Date.now(),
          },
        ]);

        if (duration > 100) {
          // 超过100ms的交互被认为是慢的
          console.warn(
            `Slow interaction detected: ${type} took ${duration.toFixed(2)}ms`
          );
        }
      }, 0);
    };

    // 监听各种用户交互
    const clickHandler = measureInteraction("click");
    const keydownHandler = measureInteraction("keydown");
    const scrollHandler = measureInteraction("scroll");

    document.addEventListener("click", clickHandler);
    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      document.removeEventListener("click", clickHandler);
      document.removeEventListener("keydown", keydownHandler);
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const averageInteractionTime =
    interactions.length > 0
      ? interactions.reduce(
          (sum, interaction) => sum + interaction.duration,
          0
        ) / interactions.length
      : 0;

  const slowInteractions = interactions.filter(
    (interaction) => interaction.duration > 100
  );

  return {
    interactions,
    averageInteractionTime,
    slowInteractions,
    totalInteractions: interactions.length,
  };
};

// 综合性能监控 Hook
export const useComprehensivePerformance = () => {
  const performanceData = usePerformanceMonitor();
  const resourceData = useResourceMonitor();
  const memoryData = useMemoryMonitor();
  const pageLoadData = usePageLoadPerformance();
  const networkData = useNetworkPerformance();
  const interactionData = useInteractionPerformance();

  const getOverallScore = useCallback(() => {
    let score = 0;
    let factors = 0;

    // Core Web Vitals 权重 40%
    if (performanceData.performanceScore > 0) {
      score += performanceData.performanceScore * 0.4;
      factors += 0.4;
    }

    // 内存使用权重 20%
    if (memoryData.memoryUsage) {
      const memoryScore = Math.max(0, 100 - memoryData.memoryUsage.percentage);
      score += memoryScore * 0.2;
      factors += 0.2;
    }

    // 网络性能权重 20%
    if (networkData.downlink > 0) {
      const networkScore = Math.min(100, (networkData.downlink / 10) * 100);
      score += networkScore * 0.2;
      factors += 0.2;
    }

    // 交互性能权重 20%
    if (interactionData.averageInteractionTime > 0) {
      const interactionScore = Math.max(
        0,
        100 - interactionData.averageInteractionTime / 10
      );
      score += interactionScore * 0.2;
      factors += 0.2;
    }

    return factors > 0 ? Math.round(score / factors) : 0;
  }, [performanceData, memoryData, networkData, interactionData]);

  return {
    ...performanceData,
    resourceStats: resourceData,
    ...memoryData,
    ...pageLoadData,
    ...networkData,
    ...interactionData,
    overallScore: getOverallScore(),
  };
};
