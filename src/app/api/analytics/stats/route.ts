import { NextResponse } from "next/server";
import { redis, REDIS_KEYS } from "@/lib/redis";

export async function GET() {
  // 检查 Redis 配置
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return NextResponse.json(
      { error: "Redis not configured" },
      { status: 503 }
    );
  }

  try {
    // 分别获取统计数据（不使用 pipeline，因为 Upstash 的 pipeline 方法有限制）

    // 获取总浏览量
    const totalViews = (await redis.get(REDIS_KEYS.totalViews)) || 0;

    // 获取今日浏览量
    const today = new Date().toISOString().split("T")[0];
    const todayViews = (await redis.get(REDIS_KEYS.dailyViews(today))) || 0;

    // 获取热门文章排行榜（前10）
    const popularPostsData = await redis.zrange(REDIS_KEYS.popular, 0, 9, {
      withScores: true,
      rev: true,
    });

    // 转换热门文章数据格式
    const popularPosts = [];
    if (Array.isArray(popularPostsData)) {
      for (let i = 0; i < popularPostsData.length; i += 2) {
        if (popularPostsData[i] && popularPostsData[i + 1] !== undefined) {
          popularPosts.push({
            slug: popularPostsData[i] as string,
            views: popularPostsData[i + 1] as number,
          });
        }
      }
    }

    // 获取最近7天的浏览量
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    const dailyStats = await Promise.all(
      last7Days.map(async (date) => ({
        date,
        views: (await redis.get(REDIS_KEYS.dailyViews(date))) || 0,
      }))
    );

    return NextResponse.json({
      totalViews: Number(totalViews),
      todayViews: Number(todayViews),
      popularPosts,
      dailyStats,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Redis stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
