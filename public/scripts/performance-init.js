// 性能监控初始化脚本
(function () {
  "use strict";

  // 检查是否支持必要的API
  if (typeof window === "undefined" || !window.performance) {
    return;
  }

  // 性能指标收集
  const metrics = {
    navigationStart: 0,
    loadComplete: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
  };

  // 获取导航时间
  function getNavigationTiming() {
    const navigation = performance.getEntriesByType("navigation")[0];
    if (navigation) {
      metrics.navigationStart =
        navigation.navigationStart || navigation.fetchStart;
      metrics.loadComplete =
        navigation.loadEventEnd - navigation.navigationStart;
    }
  }

  // 获取绘制时间
  function getPaintTiming() {
    const paintEntries = performance.getEntriesByType("paint");
    paintEntries.forEach((entry) => {
      if (entry.name === "first-paint") {
        metrics.firstPaint = entry.startTime;
      } else if (entry.name === "first-contentful-paint") {
        metrics.firstContentfulPaint = entry.startTime;
      }
    });
  }

  // 监听 LCP
  function observeLCP() {
    if (!("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.largestContentfulPaint = lastEntry.startTime;
    });

    try {
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      // 降级处理
      console.warn("LCP observation not supported");
    }
  }

  // 监听 FID
  function observeFID() {
    if (!("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === "first-input") {
          metrics.firstInputDelay = entry.processingStart - entry.startTime;
        }
      });
    });

    try {
      observer.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      // 降级处理
      console.warn("FID observation not supported");
    }
  }

  // 监听 CLS
  function observeCLS() {
    if (!("PerformanceObserver" in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          metrics.cumulativeLayoutShift = clsValue;
        }
      });
    });

    try {
      observer.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      // 降级处理
      console.warn("CLS observation not supported");
    }
  }

  // 发送性能数据
  function sendMetrics() {
    // 只在生产环境发送数据
    if (window.location.hostname === "localhost") {
      console.log("Performance Metrics:", metrics);
      return;
    }

    // 发送到分析API
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        metrics: metrics,
      });

      navigator.sendBeacon("/api/analytics/performance", data);
    } else {
      // 降级到 fetch
      fetch("/api/analytics/performance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          metrics: metrics,
        }),
        keepalive: true,
      }).catch(console.error);
    }
  }

  // 资源加载优化
  function optimizeResourceLoading() {
    // 预加载关键资源
    const criticalResources = ["/api/posts", "/images/hero-bg.jpg"];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = resource;
      document.head.appendChild(link);
    });

    // 懒加载非关键图片
    const images = document.querySelectorAll("img[data-src]");
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    } else {
      // 降级处理
      images.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      });
    }
  }

  // 内存监控
  function monitorMemory() {
    if (!performance.memory) return;

    const checkMemory = () => {
      const memory = performance.memory;
      const usageRatio = memory.usedJSHeapSize / memory.totalJSHeapSize;

      if (usageRatio > 0.9) {
        console.warn("High memory usage detected:", {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + "MB",
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + "MB",
          ratio: Math.round(usageRatio * 100) + "%",
        });
      }
    };

    // 每30秒检查一次
    setInterval(checkMemory, 30000);
  }

  // 网络状态监控
  function monitorNetwork() {
    if (!navigator.connection) return;

    const connection = navigator.connection;
    const logNetworkChange = () => {
      console.log("Network changed:", {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      });
    };

    connection.addEventListener("change", logNetworkChange);
  }

  // 初始化所有监控
  function init() {
    // 基础性能指标
    getNavigationTiming();
    getPaintTiming();

    // Web Vitals 监控
    observeLCP();
    observeFID();
    observeCLS();

    // 资源优化
    optimizeResourceLoading();

    // 系统监控
    monitorMemory();
    monitorNetwork();

    // 页面加载完成后发送指标
    if (document.readyState === "complete") {
      setTimeout(sendMetrics, 1000);
    } else {
      window.addEventListener("load", () => {
        setTimeout(sendMetrics, 1000);
      });
    }

    // 页面卸载时发送最终指标
    window.addEventListener("beforeunload", sendMetrics);

    // 页面隐藏时发送指标
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        sendMetrics();
      }
    });
  }

  // 等待 DOM 准备就绪
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // 暴露全局方法供调试使用
  window.__PERFORMANCE_METRICS__ = metrics;
  window.__SEND_METRICS__ = sendMetrics;
})();
