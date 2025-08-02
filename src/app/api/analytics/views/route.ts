import { NextRequest, NextResponse } from "next/server";
import { redis, hashIP, getClientIP, REDIS_KEYS } from "@/lib/redis";

// GET: 获取浏览量（不增加计数）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

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
    // 获取浏览量
    const views = (await redis.get(REDIS_KEYS.views(slug))) || 0;

    return NextResponse.json({
      views: Number(views),
      slug,
    });
  } catch (error) {
    console.error("Redis GET error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      url: process.env.UPSTASH_REDIS_REST_URL,
      tokenExists: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return NextResponse.json(
      { error: "Failed to fetch views", details: error.message },
      { status: 500 }
    );
  }
}

// POST: 增加浏览量（带防刷机制）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

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

    // 获取客户端 IP 并哈希
    const clientIP = getClientIP(request);
    const hashedIP = await hashIP(clientIP);

    // 防重复：同 IP 1小时内只计算一次
    const dedupeKey = REDIS_KEYS.dedupe(hashedIP, slug);
    const isNewView = await redis.set(dedupeKey, "1", {
      nx: true, // 只在键不存在时设置
      ex: 3600, // 1小时过期
    });

    // 如果不是新访问，返回当前计数但不增加
    if (!isNewView) {
      const views = (await redis.get(REDIS_KEYS.views(slug))) || 0;
      return NextResponse.json({
        views: Number(views),
        slug,
        incremented: false,
        message: "Already counted within the last hour",
      });
    }

    // 分别执行 Redis 操作（避免 pipeline 的 JSON 解析问题）

    // 增加文章浏览量
    const newViews = await redis.incr(REDIS_KEYS.views(slug));

    // 增加总浏览量
    await redis.incr(REDIS_KEYS.totalViews);

    // 增加今日浏览量
    const today = new Date().toISOString().split("T")[0];
    await redis.incr(REDIS_KEYS.dailyViews(today));
    await redis.expire(REDIS_KEYS.dailyViews(today), 86400 * 7); // 7天过期

    // 更新热门文章排行榜（有序集合）
    await redis.zadd(REDIS_KEYS.popular, {
      score: newViews,
      member: slug,
    });

    return NextResponse.json({
      views: newViews,
      slug,
      incremented: true,
      message: "View count updated successfully",
    });
  } catch (error) {
    console.error("Redis POST error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      url: process.env.UPSTASH_REDIS_REST_URL,
      tokenExists: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return NextResponse.json(
      { error: "Failed to update views", details: error.message },
      { status: 500 }
    );
  }
}
