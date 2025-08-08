import { Redis } from "@upstash/redis";

// 创建 Redis 客户端实例
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.exp(retryCount) * 50,
  },
});

// 辅助函数：生成 IP 哈希
export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// 辅助函数：获取客户端 IP
export function getClientIP(request: Request): string {
  // 尝试从不同的头部获取真实 IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  // 优先级：Cloudflare > X-Real-IP > X-Forwarded-For > 默认
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();

  return "anonymous";
}

// Redis 键名常量
export const REDIS_KEYS = {
  views: (slug: string) => `views:${slug}`,
  dedupe: (hashedIP: string, slug: string) => `dedupe:${hashedIP}:${slug}`,
  popular: "popular:posts",
  totalViews: "total:views",
  dailyViews: (date: string) => `daily:${date}`,

  // 分享相关键名
  shareCount: (slug: string, platform: string) => `share:${slug}:${platform}`,
  totalShares: (slug: string) => `share:${slug}:total`,
  dailyShares: (slug: string, date: string) => `share:${slug}:daily:${date}`,
  weeklyShares: (slug: string, week: string) => `share:${slug}:weekly:${week}`,
  monthlyShares: (slug: string, month: string) =>
    `share:${slug}:monthly:${month}`,
  lastShared: (slug: string) => `share:${slug}:last`,
  shareEvents: (slug: string) => `share:${slug}:events`,
  globalShares: "share:global:total",
  popularContent: "share:popular:content",
  platformStats: "share:platform:stats",
} as const;
