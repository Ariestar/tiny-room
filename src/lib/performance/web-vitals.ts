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

// Web Vitals 数据接口
export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
  url: string;
  timestamp: number;
}

// 性能阈值配置
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

// 获取性能评级
function getRating(
  name: string,
  value: number
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return "good";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

// 格式化指标数据
function formatMetric(metric: any): WebVitalsMetric {
  return {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType || "navigate",
    url: window.location.href,
    timestamp: Date.now(),
  };
}

// 发送性能数据到服务器
async function sendToAnalytics(metric: WebVitalsMetric) {
  try {
    await fetch("/api/analytics/web-vitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metric),
    });
  } catch (error) {
    console.error("Failed to send web vitals:", error);
  }
}

// 本地存储性能数据
function storeMetricLocally(metric: WebVitalsMetric) {
  try {
    const stored = localStorage.getItem("web-vitals") || "[]";
    const metrics = JSON.parse(stored);
    metrics.push(metric);

    // 只保留最近50条记录
    if (metrics.length > 50) {
      metrics.splice(0, metrics.length - 50);
    }

    localStorage.setItem("web-vitals", JSON.stringify(metrics));
  } catch (error) {
    console.error("Failed to store web vitals locally:", error);
  }
}

// 处理性能指标
function handleMetric(metric: any) {
  const formattedMetric = formatMetric(metric);

  // 发送到服务器
  sendToAnalytics(formattedMetric);

  // 本地存储
  storeMetricLocally(formattedMetric);

  // 控制台输出（开发环境）
  if (process.env.NODE_ENV === "development") {
    console.log(
      `${formattedMetric.name}: ${formattedMetric.value} (${formattedMetric.rating})`
    );
  }
}

// 初始化 Web Vitals 监控
export function initWebVitals() {
  if (typeof window === "undefined") return;

  // 监听各项指标
  onCLS(handleMetric);
  onFID(handleMetric);
  onFCP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);
}

// 获取当前页面的所有 Web Vitals 指标
export async function getCurrentWebVitals(): Promise<WebVitalsMetric[]> {
  if (typeof window === "undefined") return [];

  const metrics: WebVitalsMetric[] = [];

  try {
    // 获取各项指标
    const cls = await new Promise<any>((resolve) => getCLS(resolve));
    const fid = await new Promise<any>((resolve) => getFID(resolve));
    const fcp = await new Promise<any>((resolve) => getFCP(resolve));
    const lcp = await new Promise<any>((resolve) => getLCP(resolve));
    const ttfb = await new Promise<any>((resolve) => getTTFB(resolve));

    [cls, fid, fcp, lcp, ttfb].forEach((metric) => {
      if (metric) {
        metrics.push(formatMetric(metric));
      }
    });
  } catch (error) {
    console.error("Failed to get current web vitals:", error);
  }

  return metrics;
}

// 获取本地存储的性能数据
export function getStoredWebVitals(): WebVitalsMetric[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("web-vitals") || "[]";
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to get stored web vitals:", error);
    return [];
  }
}

// 计算性能分数
export function calculatePerformanceScore(metrics: WebVitalsMetric[]): {
  score: number;
  breakdown: Record<string, { value: number; rating: string; weight: number }>;
} {
  const weights = {
    CLS: 0.15,
    FID: 0.1,
    FCP: 0.1,
    LCP: 0.25,
    TTFB: 0.4,
  };

  const breakdown: Record<
    string,
    { value: number; rating: string; weight: number }
  > = {};
  let totalScore = 0;
  let totalWeight = 0;

  metrics.forEach((metric) => {
    const weight = weights[metric.name as keyof typeof weights] || 0;
    if (weight === 0) return;

    let score = 0;
    switch (metric.rating) {
      case "good":
        score = 90;
        break;
      case "needs-improvement":
        score = 50;
        break;
      case "poor":
        score = 10;
        break;
    }

    breakdown[metric.name] = {
      value: metric.value,
      rating: metric.rating,
      weight,
    };

    totalScore += score * weight;
    totalWeight += weight;
  });

  return {
    score: totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0,
    breakdown,
  };
}

// 性能建议生成器
export function generatePerformanceRecommendations(
  metrics: WebVitalsMetric[]
): string[] {
  const recommendations: string[] = [];

  metrics.forEach((metric) => {
    if (metric.rating === "poor") {
      switch (metric.name) {
        case "CLS":
          recommendations.push(
            "优化布局稳定性：为图片和广告设置尺寸属性，避免动态插入内容"
          );
          break;
        case "FID":
          recommendations.push(
            "减少JavaScript执行时间：拆分长任务，使用Web Workers处理复杂计算"
          );
          break;
        case "FCP":
          recommendations.push(
            "优化首次内容绘制：减少阻塞渲染的资源，优化关键渲染路径"
          );
          break;
        case "LCP":
          recommendations.push(
            "优化最大内容绘制：优化图片加载，使用CDN，预加载关键资源"
          );
          break;
        case "TTFB":
          recommendations.push(
            "优化服务器响应时间：使用CDN，优化数据库查询，启用缓存"
          );
          break;
      }
    }
  });

  return recommendations;
}

// 导出用于React组件的Hook
export function useWebVitals() {
  const [metrics, setMetrics] = useState<WebVitalsMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取当前指标
    getCurrentWebVitals().then((currentMetrics) => {
      setMetrics(currentMetrics);
      setIsLoading(false);
    });

    // 监听新的指标
    const handleNewMetric = (metric: WebVitalsMetric) => {
      setMetrics((prev) => {
        const existing = prev.find((m) => m.name === metric.name);
        if (existing) {
          return prev.map((m) => (m.name === metric.name ? metric : m));
        }
        return [...prev, metric];
      });
    };

    // 这里可以添加实时监听逻辑

    return () => {
      // 清理监听器
    };
  }, []);

  const performanceScore = calculatePerformanceScore(metrics);
  const recommendations = generatePerformanceRecommendations(metrics);

  return {
    metrics,
    isLoading,
    performanceScore,
    recommendations,
    refresh: () => {
      setIsLoading(true);
      getCurrentWebVitals()
        .then(setMetrics)
        .finally(() => setIsLoading(false));
    },
  };
}

// React Hook 依赖
import { useState, useEffect } from "react";
