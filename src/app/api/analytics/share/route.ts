import { NextRequest, NextResponse } from "next/server";

// 分享事件接口
interface ShareEvent {
  slug?: string;
  url?: string;
  platform: string;
  title?: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
  ip?: string;
}

// 分享统计接口
interface ShareStats {
  total: number;
  platforms: Record<string, number>;
  dailyStats: Record<string, number>;
  weeklyStats: Record<string, number>;
  monthlyStats: Record<string, number>;
  lastShared: string;
  topPlatforms: Array<{ platform: string; count: number }>;
}

// 简单的内存存储（生产环境应使用数据库或Redis）
const shareData = new Map<string, ShareStats>();
const shareEvents = new Map<string, ShareEvent[]>();

// 获取日期键
const getDateKey = (date: Date) => date.toISOString().split("T")[0];
const getWeekKey = (date: Date) => {
  const year = date.getFullYear();
  const week = Math.ceil(
    (date.getTime() - new Date(year, 0, 1).getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );
  return `${year}-W${week}`;
};
const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

// 获取客户端IP
const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
};

// 更新分享统计
const updateShareStats = (key: string, platform: string, timestamp: string) => {
  const currentStats = shareData.get(key) || {
    total: 0,
    platforms: {},
    dailyStats: {},
    weeklyStats: {},
    monthlyStats: {},
    lastShared: timestamp,
    topPlatforms: [],
  };

  const date = new Date(timestamp);
  const dateKey = getDateKey(date);
  const weekKey = getWeekKey(date);
  const monthKey = getMonthKey(date);

  // 更新统计
  currentStats.total += 1;
  currentStats.platforms[platform] =
    (currentStats.platforms[platform] || 0) + 1;
  currentStats.dailyStats[dateKey] =
    (currentStats.dailyStats[dateKey] || 0) + 1;
  currentStats.weeklyStats[weekKey] =
    (currentStats.weeklyStats[weekKey] || 0) + 1;
  currentStats.monthlyStats[monthKey] =
    (currentStats.monthlyStats[monthKey] || 0) + 1;
  currentStats.lastShared = timestamp;

  // 更新热门平台排行
  currentStats.topPlatforms = Object.entries(currentStats.platforms)
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  shareData.set(key, currentStats);
  return currentStats;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, platform, title, timestamp, url } = body;

    if (!slug && !url) {
      return NextResponse.json(
        { error: "Missing slug or url parameter" },
        { status: 400 }
      );
    }

    if (!platform) {
      return NextResponse.json(
        { error: "Missing platform parameter" },
        { status: 400 }
      );
    }

    const key = slug || url;
    const eventTimestamp = timestamp || new Date().toISOString();

    // 创建分享事件
    const shareEvent: ShareEvent = {
      slug,
      url,
      platform,
      title,
      timestamp: eventTimestamp,
      userAgent: request.headers.get("user-agent") || undefined,
      referrer: request.headers.get("referer") || undefined,
      ip: getClientIP(request),
    };

    // 存储事件
    const events = shareEvents.get(key) || [];
    events.push(shareEvent);

    // 限制事件历史记录数量（保留最近1000条）
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }

    shareEvents.set(key, events);

    // 更新统计数据
    const updatedStats = updateShareStats(key, platform, eventTimestamp);

    // 记录分享事件
    console.log(
      `Share event: ${platform} - ${title || key} at ${eventTimestamp} from ${
        shareEvent.ip
      }`
    );

    return NextResponse.json({
      success: true,
      stats: updatedStats,
      event: shareEvent,
    });
  } catch (error) {
    console.error("Error tracking share:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const url = searchParams.get("url");
    const includeEvents = searchParams.get("includeEvents") === "true";
    const period = searchParams.get("period") || "all"; // all, daily, weekly, monthly
    const limit = parseInt(searchParams.get("limit") || "100");

    if (!slug && !url) {
      // 返回所有分享统计的汇总
      const allStats = Object.fromEntries(shareData.entries());
      const totalShares = Object.values(allStats).reduce(
        (sum, stats) => sum + stats.total,
        0
      );
      const topContent = Object.entries(allStats)
        .map(([key, stats]) => ({ key, total: stats.total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

      // 平台统计汇总
      const platformTotals: Record<string, number> = {};
      Object.values(allStats).forEach((stats) => {
        Object.entries(stats.platforms).forEach(([platform, count]) => {
          platformTotals[platform] = (platformTotals[platform] || 0) + count;
        });
      });

      const topPlatforms = Object.entries(platformTotals)
        .map(([platform, count]) => ({ platform, count }))
        .sort((a, b) => b.count - a.count);

      return NextResponse.json({
        success: true,
        summary: {
          totalShares,
          totalContent: Object.keys(allStats).length,
          topContent,
          topPlatforms,
        },
        allStats:
          limit > 0
            ? Object.fromEntries(Object.entries(allStats).slice(0, limit))
            : allStats,
      });
    }

    const key = slug || url;
    const stats = shareData.get(key!) || {
      total: 0,
      platforms: {},
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {},
      lastShared: "",
      topPlatforms: [],
    };

    // 根据时间段过滤统计数据
    let filteredStats = { ...stats };
    if (period !== "all") {
      const now = new Date();
      let cutoffDate: Date;

      switch (period) {
        case "daily":
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "weekly":
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }

      // 这里可以根据时间段过滤数据，简化实现
      filteredStats = stats;
    }

    const response: any = {
      success: true,
      stats: filteredStats,
    };

    // 包含事件历史
    if (includeEvents) {
      const events = shareEvents.get(key) || [];
      response.events = events.slice(-limit); // 返回最近的事件
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching share stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 新增：删除分享数据的方法（用于数据清理）
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const url = searchParams.get("url");
    const clearAll = searchParams.get("clearAll") === "true";

    if (clearAll) {
      shareData.clear();
      shareEvents.clear();
      return NextResponse.json({
        success: true,
        message: "All share data cleared",
      });
    }

    if (!slug && !url) {
      return NextResponse.json(
        { error: "Missing slug or url parameter" },
        { status: 400 }
      );
    }

    const key = slug || url;
    const deleted = shareData.delete(key!) && shareEvents.delete(key!);

    return NextResponse.json({
      success: true,
      deleted,
      message: deleted ? "Share data deleted" : "No data found to delete",
    });
  } catch (error) {
    console.error("Error deleting share data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
