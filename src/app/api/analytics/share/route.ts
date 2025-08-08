import { NextRequest, NextResponse } from "next/server";
import { redis, hashIP, getClientIP } from "@/lib/redis";

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

// Redis 键名常量
const SHARE_REDIS_KEYS = {
	shareCount: (slug: string, platform: string) => `share:${slug}:${platform}`,
	totalShares: (slug: string) => `share:${slug}:total`,
	dailyShares: (slug: string, date: string) => `share:${slug}:daily:${date}`,
	weeklyShares: (slug: string, week: string) => `share:${slug}:weekly:${week}`,
	monthlyShares: (slug: string, month: string) => `share:${slug}:monthly:${month}`,
	lastShared: (slug: string) => `share:${slug}:last`,
	shareEvents: (slug: string) => `share:${slug}:events`,
	globalShares: "share:global:total",
	popularContent: "share:popular:content",
	platformStats: "share:platform:stats",
} as const;

// 获取日期键
const getDateKey = (date: Date) => date.toISOString().split("T")[0];
const getWeekKey = (date: Date) => {
	const year = date.getFullYear();
	const week = Math.ceil(
		(date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
	);
	return `${year}-W${week}`;
};
const getMonthKey = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

// 检查 Redis 配置
const checkRedisConfig = () => {
	if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
		return false;
	}
	return true;
};

// 更新分享统计到 Redis
const updateShareStats = async (slug: string, platform: string, timestamp: string) => {
	const date = new Date(timestamp);
	const dateKey = getDateKey(date);
	const weekKey = getWeekKey(date);
	const monthKey = getMonthKey(date);

	try {
		// 使用 Redis pipeline 批量执行操作
		const pipeline = redis.pipeline();

		// 增加各种计数
		pipeline.incr(SHARE_REDIS_KEYS.shareCount(slug, platform));
		pipeline.incr(SHARE_REDIS_KEYS.totalShares(slug));
		pipeline.incr(SHARE_REDIS_KEYS.dailyShares(slug, dateKey));
		pipeline.incr(SHARE_REDIS_KEYS.weeklyShares(slug, weekKey));
		pipeline.incr(SHARE_REDIS_KEYS.monthlyShares(slug, monthKey));
		pipeline.incr(SHARE_REDIS_KEYS.globalShares);

		// 更新最后分享时间
		pipeline.set(SHARE_REDIS_KEYS.lastShared(slug), timestamp);

		// 更新热门内容排行榜
		pipeline.zincrby(SHARE_REDIS_KEYS.popularContent, 1, slug);

		// 更新平台统计
		pipeline.hincrby(SHARE_REDIS_KEYS.platformStats, platform, 1);

		// 设置过期时间（日统计7天过期，周统计30天过期，月统计365天过期）
		pipeline.expire(SHARE_REDIS_KEYS.dailyShares(slug, dateKey), 86400 * 7);
		pipeline.expire(SHARE_REDIS_KEYS.weeklyShares(slug, weekKey), 86400 * 30);
		pipeline.expire(SHARE_REDIS_KEYS.monthlyShares(slug, monthKey), 86400 * 365);

		await pipeline.exec();

		// 获取更新后的统计数据
		const stats = await getShareStats(slug);
		return stats;
	} catch (error) {
		console.error("Error updating share stats in Redis:", error);
		throw error;
	}
};

// 从 Redis 获取分享统计
const getShareStats = async (slug: string): Promise<ShareStats> => {
	try {
		// 获取基础统计数据
		const [totalShares, lastShared, platformCounts] = await Promise.all([
			redis.get(SHARE_REDIS_KEYS.totalShares(slug)) || 0,
			redis.get(SHARE_REDIS_KEYS.lastShared(slug)) || "",
			redis.hgetall(SHARE_REDIS_KEYS.platformStats) || {},
		]);

		// 获取平台分享数据
		const platforms: Record<string, number> = {};
		const platformKeys = ["twitter", "weibo", "linkedin", "facebook", "qq", "微信", "copy"];

		for (const platform of platformKeys) {
			const raw = await redis.get(SHARE_REDIS_KEYS.shareCount(slug, platform));
			const count = Number(raw ?? 0);
			if (count > 0) {
				platforms[platform] = count;
			}
		}

		// 获取时间统计数据
		const now = new Date();
		const dailyStats: Record<string, number> = {};
		const weeklyStats: Record<string, number> = {};
		const monthlyStats: Record<string, number> = {};

		// 获取最近7天的数据
		for (let i = 0; i < 7; i++) {
			const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
			const dateKey = getDateKey(date);
			const raw = await redis.get(SHARE_REDIS_KEYS.dailyShares(slug, dateKey));
			const count = Number(raw ?? 0);
			if (count > 0) {
				dailyStats[dateKey] = count;
			}
		}

		// 获取最近4周的数据
		for (let i = 0; i < 4; i++) {
			const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
			const weekKey = getWeekKey(date);
			const raw = await redis.get(SHARE_REDIS_KEYS.weeklyShares(slug, weekKey));
			const count = Number(raw ?? 0);
			if (count > 0) {
				weeklyStats[weekKey] = count;
			}
		}

		// 获取最近12个月的数据
		for (let i = 0; i < 12; i++) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthKey = getMonthKey(date);
			const raw = await redis.get(SHARE_REDIS_KEYS.monthlyShares(slug, monthKey));
			const count = Number(raw ?? 0);
			if (count > 0) {
				monthlyStats[monthKey] = count;
			}
		}

		// 生成热门平台排行
		const topPlatforms = Object.entries(platforms)
			.map(([platform, count]) => ({ platform, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		return {
			total: Number(totalShares),
			platforms,
			dailyStats,
			weeklyStats,
			monthlyStats,
			lastShared: String(lastShared),
			topPlatforms,
		};
	} catch (error) {
		console.error("Error getting share stats from Redis:", error);
		// 返回默认值
		return {
			total: 0,
			platforms: {},
			dailyStats: {},
			weeklyStats: {},
			monthlyStats: {},
			lastShared: "",
			topPlatforms: [],
		};
	}
};

export async function POST(request: NextRequest) {
	try {
		// 检查 Redis 配置
		if (!checkRedisConfig()) {
			return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
		}

		const body = await request.json();
		const { slug, platform, title, timestamp, url } = body;

		if (!slug && !url) {
			return NextResponse.json({ error: "Missing slug or url parameter" }, { status: 400 });
		}

		if (!platform) {
			return NextResponse.json({ error: "Missing platform parameter" }, { status: 400 });
		}

		const key = slug || url;
		const eventTimestamp = timestamp || new Date().toISOString();
		const clientIP = getClientIP(request);
		const hashedIP = await hashIP(clientIP);

		// 防重复：同 IP 同平台 1小时内只计算一次
		const dedupeKey = `share:dedupe:${hashedIP}:${key}:${platform}`;
		const isNewShare = await redis.set(dedupeKey, "1", {
			nx: true, // 只在键不存在时设置
			ex: 3600, // 1小时过期
		});

		// 创建分享事件
		const shareEvent: ShareEvent = {
			slug,
			url,
			platform,
			title,
			timestamp: eventTimestamp,
			userAgent: request.headers.get("user-agent") || undefined,
			referrer: request.headers.get("referer") || undefined,
			ip: clientIP,
		};

		// 存储事件到 Redis（使用列表，保留最近1000条）
		await redis.lpush(SHARE_REDIS_KEYS.shareEvents(key), JSON.stringify(shareEvent));
		await redis.ltrim(SHARE_REDIS_KEYS.shareEvents(key), 0, 999); // 保留最近1000条
		await redis.expire(SHARE_REDIS_KEYS.shareEvents(key), 86400 * 30); // 30天过期

		let updatedStats;

		if (isNewShare) {
			// 更新统计数据
			updatedStats = await updateShareStats(key, platform, eventTimestamp);

			// 记录分享事件
			console.log(
				`New share event: ${platform} - ${
					title || key
				} at ${eventTimestamp} from ${clientIP}`
			);
		} else {
			// 获取当前统计数据但不增加计数
			updatedStats = await getShareStats(key);

			console.log(
				`Duplicate share event ignored: ${platform} - ${title || key} from ${clientIP}`
			);
		}

		return NextResponse.json({
			success: true,
			stats: updatedStats,
			event: shareEvent,
			isNewShare: !!isNewShare,
		});
	} catch (error) {
		console.error("Error tracking share:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		// 检查 Redis 配置
		if (!checkRedisConfig()) {
			return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
		}

		const { searchParams } = new URL(request.url);
		const slug = searchParams.get("slug");
		const url = searchParams.get("url");
		const includeEvents = searchParams.get("includeEvents") === "true";
		const period = searchParams.get("period") || "all"; // all, daily, weekly, monthly
		const limit = parseInt(searchParams.get("limit") || "100");

		if (!slug && !url) {
			// 返回全局分享统计汇总
			const [globalShares, platformStats, popularContent] = await Promise.all([
				redis.get(SHARE_REDIS_KEYS.globalShares) || 0,
				redis.hgetall(SHARE_REDIS_KEYS.platformStats) || {},
				redis.zrange(SHARE_REDIS_KEYS.popularContent, 0, 9, {
					rev: true,
					withScores: true,
				}),
			]);

			// 处理热门内容数据
			const topContent = [];
			for (let i = 0; i < popularContent.length; i += 2) {
				topContent.push({
					key: popularContent[i],
					total: Number(popularContent[i + 1]),
				});
			}

			// 处理平台统计数据
			const topPlatforms = Object.entries(platformStats ?? {})
				.map(([platform, count]) => ({ platform, count: Number(count) }))
				.sort((a, b) => b.count - a.count);

			return NextResponse.json({
				success: true,
				summary: {
					totalShares: Number(globalShares),
					totalContent: topContent.length,
					topContent,
					topPlatforms,
				},
			});
		}

		const key = slug || url;
		const stats = await getShareStats(key!);

		const response: any = {
			success: true,
			stats,
		};

		// 包含事件历史
		if (includeEvents) {
			try {
				const eventStrings = await redis.lrange(
					SHARE_REDIS_KEYS.shareEvents(key!),
					0,
					limit - 1
				);
				const events = eventStrings
					.map(eventStr => {
						try {
							return JSON.parse(eventStr);
						} catch {
							return null;
						}
					})
					.filter(Boolean);

				response.events = events;
			} catch (error) {
				console.error("Error fetching share events:", error);
				response.events = [];
			}
		}

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error fetching share stats:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

// 删除分享数据的方法（用于数据清理）
export async function DELETE(request: NextRequest) {
	try {
		// 检查 Redis 配置
		if (!checkRedisConfig()) {
			return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
		}

		const { searchParams } = new URL(request.url);
		const slug = searchParams.get("slug");
		const url = searchParams.get("url");
		const clearAll = searchParams.get("clearAll") === "true";

		if (clearAll) {
			// 清除所有分享相关的数据（谨慎使用）
			const keys = await redis.keys("share:*");
			if (keys.length > 0) {
				await redis.del(...keys);
			}

			return NextResponse.json({
				success: true,
				message: `All share data cleared (${keys.length} keys deleted)`,
			});
		}

		if (!slug && !url) {
			return NextResponse.json({ error: "Missing slug or url parameter" }, { status: 400 });
		}

		const key = slug || url;

		// 删除特定内容的所有分享数据
		const keysToDelete = [
			SHARE_REDIS_KEYS.totalShares(key!),
			SHARE_REDIS_KEYS.lastShared(key!),
			SHARE_REDIS_KEYS.shareEvents(key!),
		];

		// 删除各平台的分享计数
		const platforms = ["twitter", "weibo", "linkedin", "facebook", "qq", "微信", "copy"];
		platforms.forEach(platform => {
			keysToDelete.push(SHARE_REDIS_KEYS.shareCount(key!, platform));
		});

		// 删除时间统计数据（这里简化处理，实际可能需要更精确的清理）
		const now = new Date();
		for (let i = 0; i < 30; i++) {
			const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
			const dateKey = getDateKey(date);
			keysToDelete.push(SHARE_REDIS_KEYS.dailyShares(key!, dateKey));
		}

		// 执行删除
		const deletedCount = await redis.del(...keysToDelete);

		// 从热门内容排行榜中移除
		await redis.zrem(SHARE_REDIS_KEYS.popularContent, key!);

		return NextResponse.json({
			success: true,
			deleted: deletedCount > 0,
			deletedKeys: deletedCount,
			message: deletedCount > 0 ? "Share data deleted" : "No data found to delete",
		});
	} catch (error) {
		console.error("Error deleting share data:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
