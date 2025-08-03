import { NextRequest, NextResponse } from "next/server";

// Web Vitals 数据存储
const webVitalsData = new Map<
  string,
  Array<{
    name: string;
    value: number;
    rating: string;
    timestamp: number;
    url: string;
    userAgent: string;
    ip: string;
  }>
>();

// 获取客户端IP
const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  return "unknown";
};

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();
    const ip = getClientIP(request);
    const userAgent = request.headers.get("user-agent") || "";

    // 存储指标数据
    const key = `${ip}-${new Date().toDateString()}`;
    const dayMetrics = webVitalsData.get(key) || [];

    dayMetrics.push({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: metric.timestamp,
      url: metric.url,
      userAgent,
      ip,
    });

    webVitalsData.set(key, dayMetrics);

    // 限制存储数量（保留最近7天的数据）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (const [key, data] of webVitalsData.entries()) {
      const keyDate = new Date(key.split("-").slice(1).join("-"));
      if (keyDate < sevenDaysAgo) {
        webVitalsData.delete(key);
      }
    }

    console.log(
      `Web Vitals: ${metric.name} = ${metric.value} (${metric.rating}) from ${ip}`
    );

    return NextResponse.json({
      success: true,
      message: "Web Vitals metric recorded",
    });
  } catch (error) {
    console.error("Error recording web vitals:", error);
    return NextResponse.json(
      { error: "Failed to record metric" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");
    const metric = searchParams.get("metric");

    // 收集指定天数的数据
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const allMetrics: any[] = [];
    for (const [key, metrics] of webVitalsData.entries()) {
      const keyDate = new Date(key.split("-").slice(1).join("-"));
      if (keyDate >= cutoffDate) {
        allMetrics.push(...metrics);
      }
    }

    // 过滤特定指标
    const filteredMetrics = metric
      ? allMetrics.filter((m) => m.name === metric)
      : allMetrics;

    // 计算统计数据
    const stats = {
      totalSamples: filteredMetrics.length,
      uniqueUsers: new Set(filteredMetrics.map((m) => m.ip)).size,
      uniquePages: new Set(filteredMetrics.map((m) => m.url)).size,
    };

    // 按指标分组统计
    const metricStats: Record<string, any> = {};
    const metricNames = ["CLS", "FID", "FCP", "LCP", "TTFB"];

    metricNames.forEach((name) => {
      const metricData = allMetrics.filter((m) => m.name === name);
      if (metricData.length === 0) return;

      const values = metricData.map((m) => m.value);
      const ratings = metricData.map((m) => m.rating);

      metricStats[name] = {
        count: metricData.length,
        average: values.reduce((a, b) => a + b, 0) / values.length,
        median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
        p75: values.sort((a, b) => a - b)[Math.floor(values.length * 0.75)],
        p90: values.sort((a, b) => a - b)[Math.floor(values.length * 0.9)],
        ratings: {
          good: ratings.filter((r) => r === "good").length,
          needsImprovement: ratings.filter((r) => r === "needs-improvement")
            .length,
          poor: ratings.filter((r) => r === "poor").length,
        },
      };
    });

    // 页面性能排行
    const pagePerformance: Record<string, any> = {};
    allMetrics.forEach((metric) => {
      if (!pagePerformance[metric.url]) {
        pagePerformance[metric.url] = {
          url: metric.url,
          samples: 0,
          metrics: {},
        };
      }

      pagePerformance[metric.url].samples++;
      if (!pagePerformance[metric.url].metrics[metric.name]) {
        pagePerformance[metric.url].metrics[metric.name] = [];
      }
      pagePerformance[metric.url].metrics[metric.name].push(metric.value);
    });

    // 计算页面平均性能
    const topPages = Object.values(pagePerformance)
      .map((page: any) => {
        const avgMetrics: Record<string, number> = {};
        Object.entries(page.metrics).forEach(
          ([name, values]: [string, any]) => {
            avgMetrics[name] =
              values.reduce((a: number, b: number) => a + b, 0) / values.length;
          }
        );

        return {
          ...page,
          avgMetrics,
          performanceScore: calculatePageScore(avgMetrics),
        };
      })
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      stats,
      metricStats,
      topPages,
      recentMetrics: filteredMetrics.slice(-50), // 最近50条记录
    });
  } catch (error) {
    console.error("Error fetching web vitals:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}

// 计算页面性能分数
function calculatePageScore(metrics: Record<string, number>): number {
  const weights = {
    CLS: 0.15,
    FID: 0.1,
    FCP: 0.1,
    LCP: 0.25,
    TTFB: 0.4,
  };

  const thresholds = {
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 },
  };

  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(metrics).forEach(([name, value]) => {
    const weight = weights[name as keyof typeof weights];
    const threshold = thresholds[name as keyof typeof thresholds];

    if (!weight || !threshold) return;

    let score = 0;
    if (value <= threshold.good) score = 90;
    else if (value <= threshold.poor) score = 50;
    else score = 10;

    totalScore += score * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}
