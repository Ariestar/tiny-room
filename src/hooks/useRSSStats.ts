"use client";

import { useState, useEffect } from "react";

interface RSSStats {
  totalPosts: number;
  lastUpdated: string;
  feedSize: number;
  isLoading: boolean;
  error: string | null;
}

interface RSSFeedInfo {
  title: string;
  description: string;
  link: string;
  lastBuildDate: string;
  itemCount: number;
  language: string;
  generator: string;
}

export function useRSSStats() {
  const [stats, setStats] = useState<RSSStats>({
    totalPosts: 0,
    lastUpdated: "",
    feedSize: 0,
    isLoading: true,
    error: null,
  });

  const [feedInfo, setFeedInfo] = useState<RSSFeedInfo | null>(null);

  // 获取RSS统计信息
  const fetchRSSStats = async () => {
    try {
      setStats((prev) => ({ ...prev, isLoading: true, error: null }));

      // 获取RSS feed内容
      const response = await fetch("/api/rss");
      if (!response.ok) {
        throw new Error("Failed to fetch RSS feed");
      }

      const rssContent = await response.text();
      const feedSize = new Blob([rssContent]).size;

      // 解析RSS内容获取基本信息
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(rssContent, "text/xml");

      const channel = xmlDoc.querySelector("channel");
      const items = xmlDoc.querySelectorAll("item");

      if (channel) {
        const feedInfo: RSSFeedInfo = {
          title: channel.querySelector("title")?.textContent || "",
          description: channel.querySelector("description")?.textContent || "",
          link: channel.querySelector("link")?.textContent || "",
          lastBuildDate:
            channel.querySelector("lastBuildDate")?.textContent || "",
          itemCount: items.length,
          language: channel.querySelector("language")?.textContent || "",
          generator: channel.querySelector("generator")?.textContent || "",
        };

        setFeedInfo(feedInfo);
      }

      setStats({
        totalPosts: items.length,
        lastUpdated:
          channel?.querySelector("lastBuildDate")?.textContent ||
          new Date().toISOString(),
        feedSize,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching RSS stats:", error);
      setStats((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  };

  // 刷新RSS缓存
  const refreshRSSCache = async () => {
    try {
      const response = await fetch("/api/rss", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh RSS cache");
      }

      const result = await response.json();
      console.log("RSS cache refreshed:", result);

      // 重新获取统计信息
      await fetchRSSStats();

      return result;
    } catch (error) {
      console.error("Error refreshing RSS cache:", error);
      throw error;
    }
  };

  // 验证RSS feed格式
  const validateRSSFeed = async () => {
    try {
      const response = await fetch("/api/rss");
      const rssContent = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(rssContent, "text/xml");

      // 检查是否有解析错误
      const parseError = xmlDoc.querySelector("parsererror");
      if (parseError) {
        return {
          valid: false,
          error: "XML parsing error",
          details: parseError.textContent,
        };
      }

      // 检查RSS结构
      const rss = xmlDoc.querySelector("rss");
      const channel = xmlDoc.querySelector("channel");

      if (!rss || !channel) {
        return {
          valid: false,
          error: "Invalid RSS structure",
          details: "Missing rss or channel elements",
        };
      }

      // 检查必需的元素
      const requiredElements = ["title", "link", "description"];
      const missingElements = requiredElements.filter(
        (element) => !channel.querySelector(element)
      );

      if (missingElements.length > 0) {
        return {
          valid: false,
          error: "Missing required elements",
          details: `Missing: ${missingElements.join(", ")}`,
        };
      }

      return {
        valid: true,
        error: null,
        details: "RSS feed is valid",
      };
    } catch (error) {
      return {
        valid: false,
        error: "Validation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  // 获取RSS订阅链接
  const getRSSUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/api/rss`;
    }
    return "/api/rss";
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("zh-CN");
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    fetchRSSStats();
  }, []);

  return {
    stats: {
      ...stats,
      feedSize: formatFileSize(stats.feedSize),
      lastUpdated: formatDate(stats.lastUpdated),
    },
    feedInfo,
    actions: {
      refresh: fetchRSSStats,
      refreshCache: refreshRSSCache,
      validate: validateRSSFeed,
      getRSSUrl,
    },
  };
}
