/**
 * 统一图片处理 Hook
 * Unified Image Processing Hook
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  ImageFormatOptimizer,
  ImagePreloader,
  ResponsiveImageCalculator,
  LazyLoadObserver,
  AdaptiveQualityManager,
  ImageErrorHandler,
  ImagePerformanceMonitor,
  imageUtils,
} from "@/lib/ui/images";

export interface ImageState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  error: string | null;
  src: string | null;
  dimensions: { width: number; height: number } | null;
}

export interface ImageOptimizationOptions {
  quality?: number;
  format?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  priority?: "high" | "low";
  fallbackSources?: string[];
  enableRetry?: boolean;
  placeholder?: string;
}

/**
 * 图片加载状态 Hook
 */
export function useImageLoad(
  src: string,
  options: ImageOptimizationOptions = {}
) {
  const [state, setState] = useState<ImageState>({
    isLoading: true,
    isLoaded: false,
    hasError: false,
    error: null,
    src: null,
    dimensions: null,
  });

  const startTimeRef = useRef<number>();

  const loadImage = useCallback(async () => {
    if (!src) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      hasError: false,
      error: null,
    }));

    startTimeRef.current = performance.now();

    try {
      // 获取最优格式
      const optimalFormat =
        options.format || ImageFormatOptimizer.getBestFormat();
      const optimizedSrc = src; // 这里可以根据需要转换格式

      // 预加载图片
      const img = await ImagePreloader.preload(optimizedSrc, options.priority);

      // 获取图片尺寸
      const dimensions = await imageUtils.getImageDimensions(optimizedSrc);

      // 记录性能
      if (startTimeRef.current) {
        ImagePerformanceMonitor.recordLoad(
          optimizedSrc,
          startTimeRef.current,
          undefined, // 文件大小需要额外获取
          optimalFormat,
          ImagePreloader.isLoaded(optimizedSrc)
        );
      }

      setState({
        isLoading: false,
        isLoaded: true,
        hasError: false,
        error: null,
        src: optimizedSrc,
        dimensions,
      });
    } catch (error) {
      // 尝试错误处理和重试
      if (options.enableRetry && options.fallbackSources) {
        try {
          const fallbackSrc = await ImageErrorHandler.handleError(
            src,
            options.fallbackSources
          );

          if (fallbackSrc) {
            const img = await ImagePreloader.preload(
              fallbackSrc,
              options.priority
            );
            const dimensions = await imageUtils.getImageDimensions(fallbackSrc);

            setState({
              isLoading: false,
              isLoaded: true,
              hasError: false,
              error: null,
              src: fallbackSrc,
              dimensions,
            });
            return;
          }
        } catch (fallbackError) {
          // 降级处理也失败了
        }
      }

      setState({
        isLoading: false,
        isLoaded: false,
        hasError: true,
        error: error instanceof Error ? error.message : "Failed to load image",
        src: null,
        dimensions: null,
      });
    }
  }, [src, options]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const retry = useCallback(() => {
    ImageErrorHandler.resetRetries(src);
    loadImage();
  }, [src, loadImage]);

  return {
    ...state,
    retry,
    reload: loadImage,
  };
}

/**
 * 图片懒加载 Hook
 */
export function useImageLazyLoad(
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<LazyLoadObserver>();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = LazyLoadObserver.getInstance();

    observerRef.current.observe(element, () => {
      setIsInView(true);
      setShouldLoad(true);
    });

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, []);

  return {
    ref: elementRef,
    shouldLoad,
    isInView,
    forceLoad: () => setShouldLoad(true),
  };
}

/**
 * 响应式图片 Hook
 */
export function useResponsiveImage(
  src: string,
  options: {
    containerWidth?: number;
    containerHeight?: number;
    breakpoints?: number[];
    sizes?: string;
    quality?: number;
  } = {}
) {
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);
  const [containerSize, setContainerSize] = useState({
    width: options.containerWidth || 300,
    height: options.containerHeight || 200,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDevicePixelRatio(window.devicePixelRatio || 1);
    }
  }, []);

  const optimalSize = useMemo(() => {
    return ResponsiveImageCalculator.calculateOptimalSize(
      containerSize.width,
      containerSize.height,
      devicePixelRatio
    );
  }, [containerSize, devicePixelRatio]);

  const srcSet = useMemo(() => {
    if (!options.breakpoints) return undefined;

    return options.breakpoints
      .map((width) => {
        // 这里可以根据实际的图片服务生成不同尺寸的URL
        const scaledSrc = imageUtils.generateThumbnail(src, width);
        return `${scaledSrc} ${width}w`;
      })
      .join(", ");
  }, [src, options.breakpoints]);

  const sizes = useMemo(() => {
    return options.sizes || ResponsiveImageCalculator.presets.card;
  }, [options.sizes]);

  const quality = useMemo(() => {
    const baseQuality = options.quality || 85;
    return AdaptiveQualityManager.getRecommendedQuality(baseQuality);
  }, [options.quality]);

  return {
    src,
    srcSet,
    sizes,
    width: optimalSize.width,
    height: optimalSize.height,
    quality,
    updateContainerSize: setContainerSize,
  };
}

/**
 * 图片预加载 Hook
 */
export function useImagePreloader() {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );
  const [isPreloading, setIsPreloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const preloadSingle = useCallback(
    async (src: string, priority: "high" | "low" = "low") => {
      try {
        await ImagePreloader.preload(src, priority);
        setPreloadedImages((prev) => new Set([...prev, src]));
        return true;
      } catch (error) {
        console.warn(`Failed to preload image: ${src}`, error);
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
      setIsPreloading(true);
      setProgress(0);

      try {
        await ImagePreloader.preloadBatch(sources, {
          ...options,
          onProgress: (loaded, total) => {
            setProgress(loaded / total);
          },
        });

        setPreloadedImages((prev) => new Set([...prev, ...sources]));
      } catch (error) {
        console.warn("Failed to preload image batch", error);
      } finally {
        setIsPreloading(false);
      }
    },
    []
  );

  const isPreloaded = useCallback(
    (src: string) => {
      return preloadedImages.has(src) || ImagePreloader.isLoaded(src);
    },
    [preloadedImages]
  );

  const clearCache = useCallback(() => {
    ImagePreloader.clearCache();
    setPreloadedImages(new Set());
  }, []);

  return {
    preloadSingle,
    preloadBatch,
    isPreloaded,
    isPreloading,
    progress,
    preloadedCount: preloadedImages.size,
    clearCache,
  };
}

/**
 * 图片性能监控 Hook
 */
export function useImagePerformance() {
  const [stats, setStats] = useState(ImagePerformanceMonitor.getStats());

  const refreshStats = useCallback(() => {
    setStats(ImagePerformanceMonitor.getStats());
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshStats, 5000);
    return () => clearInterval(interval);
  }, [refreshStats]);

  const clearStats = useCallback(() => {
    ImagePerformanceMonitor.clearMetrics();
    refreshStats();
  }, [refreshStats]);

  return {
    stats,
    refreshStats,
    clearStats,
    formatSize: (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    },
    formatTime: (ms: number) => `${ms.toFixed(2)} ms`,
  };
}

/**
 * 自适应图片质量 Hook
 */
export function useAdaptiveImageQuality() {
  const [recommendedQuality, setRecommendedQuality] = useState(85);
  const [recommendedScale, setRecommendedScale] = useState(1);
  const [networkInfo, setNetworkInfo] = useState<{
    effectiveType: string;
    saveData: boolean;
  } | null>(null);

  useEffect(() => {
    const updateQuality = () => {
      setRecommendedQuality(AdaptiveQualityManager.getRecommendedQuality());
      setRecommendedScale(AdaptiveQualityManager.getRecommendedScale());
    };

    const updateNetworkInfo = () => {
      if (typeof navigator !== "undefined" && "connection" in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          setNetworkInfo({
            effectiveType: connection.effectiveType,
            saveData: connection.saveData,
          });
        }
      }
    };

    updateQuality();
    updateNetworkInfo();

    // 监听网络变化
    if (typeof window !== "undefined") {
      window.addEventListener("online", updateQuality);
      window.addEventListener("offline", updateQuality);
    }

    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener("change", () => {
          updateQuality();
          updateNetworkInfo();
        });
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", updateQuality);
        window.removeEventListener("offline", updateQuality);
      }
    };
  }, []);

  return {
    recommendedQuality,
    recommendedScale,
    networkInfo,
    shouldOptimize: recommendedQuality < 85 || recommendedScale < 1,
  };
}

/**
 * 图片格式支持检测 Hook
 */
export function useImageFormatSupport() {
  const [supportedFormats, setSupportedFormats] = useState<{
    webp: boolean;
    avif: boolean;
    jpeg: boolean;
    png: boolean;
    gif: boolean;
  }>({
    webp: false,
    avif: false,
    jpeg: true,
    png: true,
    gif: true,
  });

  useEffect(() => {
    setSupportedFormats({
      webp: ImageFormatOptimizer.supportsFormat("webp"),
      avif: ImageFormatOptimizer.supportsFormat("avif"),
      jpeg: ImageFormatOptimizer.supportsFormat("jpeg"),
      png: ImageFormatOptimizer.supportsFormat("png"),
      gif: ImageFormatOptimizer.supportsFormat("gif"),
    });
  }, []);

  const getBestFormat = useCallback((originalFormat: string = "jpeg") => {
    return ImageFormatOptimizer.getBestFormat(originalFormat);
  }, []);

  return {
    supportedFormats,
    getBestFormat,
    supportsModernFormats: supportedFormats.webp || supportedFormats.avif,
  };
}
