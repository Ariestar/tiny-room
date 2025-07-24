"use client";

import { useEffect, useState, useCallback } from "react";
import { ImageOptimizationUtils } from "@/lib/ui/images";

/**
 * 图片性能监控 Hook
 */
export function useImagePerformance() {
  const [stats, setStats] = useState({
    totalImages: 0,
    averageLoadTime: 0,
    totalSize: 0,
    cacheHitRate: 0,
    formatDistribution: {} as Record<string, number>,
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  // 更新统计数据
  const updateStats = useCallback(() => {
    const newStats = ImageOptimizationUtils.performanceMonitor.getStats();
    setStats(newStats);
  }, []);

  // 开始监控
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [updateStats]);

  // 停止监控
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // 清理数据
  const clearStats = useCallback(() => {
    ImageOptimizationUtils.performanceMonitor.clearMetrics();
    updateStats();
  }, [updateStats]);

  // 预加载图片
  const preloadImages = useCallback(
    async (
      sources: string[],
      options?: {
        priority?: "high" | "low";
        maxConcurrent?: number;
        onProgress?: (loaded: number, total: number) => void;
      }
    ) => {
      try {
        await ImageOptimizationUtils.preloader.preloadBatch(sources, options);
        updateStats();
      } catch (error) {
        console.error("Failed to preload images:", error);
      }
    },
    [updateStats]
  );

  // 检查图片是否已加载
  const isImageLoaded = useCallback((src: string) => {
    return ImageOptimizationUtils.preloader.isLoaded(src);
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      return startMonitoring();
    }
  }, [isMonitoring, startMonitoring]);

  return {
    stats,
    isMonitoring,
    startMonitoring: () => setIsMonitoring(true),
    stopMonitoring,
    clearStats,
    preloadImages,
    isImageLoaded,
    updateStats,
  };
}

/**
 * 图片预加载 Hook
 */
export function useImagePreloader() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const preloadImage = useCallback(
    async (src: string, priority: "high" | "low" = "low") => {
      try {
        await ImageOptimizationUtils.preloader.preload(src, priority);
        setLoadedImages((prev) => new Set([...prev, src]));
        return true;
      } catch (error) {
        console.error(`Failed to preload image: ${src}`, error);
        return false;
      }
    },
    []
  );

  const preloadBatch = useCallback(
    async (
      sources: string[],
      options: {
        priority?: "high" | "low";
        maxConcurrent?: number;
      } = {}
    ) => {
      setIsLoading(true);
      setLoadingProgress(0);

      try {
        await ImageOptimizationUtils.preloader.preloadBatch(sources, {
          ...options,
          onProgress: (loaded, total) => {
            setLoadingProgress((loaded / total) * 100);
          },
        });

        setLoadedImages((prev) => new Set([...prev, ...sources]));
      } catch (error) {
        console.error("Failed to preload batch:", error);
      } finally {
        setIsLoading(false);
        setLoadingProgress(100);
      }
    },
    []
  );

  const isImageLoaded = useCallback(
    (src: string) => {
      return loadedImages.has(src);
    },
    [loadedImages]
  );

  const clearCache = useCallback(() => {
    ImageOptimizationUtils.preloader.clearCache();
    setLoadedImages(new Set());
    setLoadingProgress(0);
  }, []);

  return {
    preloadImage,
    preloadBatch,
    isImageLoaded,
    clearCache,
    loadingProgress,
    isLoading,
    loadedImagesCount: loadedImages.size,
  };
}

/**
 * 自适应图片质量 Hook
 */
export function useAdaptiveImageQuality() {
  const [networkQuality, setNetworkQuality] = useState<"slow" | "fast">("fast");
  const [dataSaver, setDataSaver] = useState(false);

  useEffect(() => {
    // 检测网络条件
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        setDataSaver(connection.saveData || false);

        const slowConnections = ["slow-2g", "2g", "3g"];
        setNetworkQuality(
          slowConnections.includes(connection.effectiveType) ? "slow" : "fast"
        );

        // 监听网络变化
        const handleChange = () => {
          setDataSaver(connection.saveData || false);
          setNetworkQuality(
            slowConnections.includes(connection.effectiveType) ? "slow" : "fast"
          );
        };

        connection.addEventListener("change", handleChange);
        return () => connection.removeEventListener("change", handleChange);
      }
    }
  }, []);

  const getOptimalQuality = useCallback((baseQuality: number = 85) => {
    return ImageOptimizationUtils.qualityManager.getRecommendedQuality(
      baseQuality
    );
  }, []);

  const getOptimalScale = useCallback(() => {
    return ImageOptimizationUtils.qualityManager.getRecommendedScale();
  }, []);

  return {
    networkQuality,
    dataSaver,
    getOptimalQuality,
    getOptimalScale,
    shouldOptimize: dataSaver || networkQuality === "slow",
  };
}

/**
 * 图片格式检测 Hook
 */
export function useImageFormatSupport() {
  const [supportedFormats, setSupportedFormats] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const checkSupport = async () => {
      const formats = new Set<string>();

      // 检测 WebP 支持
      if (ImageOptimizationUtils.formatOptimizer.supportsFormat("webp")) {
        formats.add("webp");
      }

      // 检测 AVIF 支持
      if (ImageOptimizationUtils.formatOptimizer.supportsFormat("avif")) {
        formats.add("avif");
      }

      // 基础格式
      formats.add("jpeg");
      formats.add("png");
      formats.add("gif");

      setSupportedFormats(formats);
    };

    checkSupport();
  }, []);

  const getBestFormat = useCallback((originalFormat: string = "jpeg") => {
    return ImageOptimizationUtils.formatOptimizer.getBestFormat(originalFormat);
  }, []);

  const supportsFormat = useCallback(
    (format: string) => {
      return supportedFormats.has(format.toLowerCase());
    },
    [supportedFormats]
  );

  return {
    supportedFormats: Array.from(supportedFormats),
    getBestFormat,
    supportsFormat,
    supportsWebP: supportedFormats.has("webp"),
    supportsAVIF: supportedFormats.has("avif"),
  };
}
