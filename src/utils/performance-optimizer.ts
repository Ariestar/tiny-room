/**
 * 性能优化工具
 * 用于 Lighthouse 性能评分优化和最终调整
 */

export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  loadTime?: number;
  domContentLoaded?: number;
}

export interface OptimizationResult {
  category: string;
  optimizations: string[];
  impact: "high" | "medium" | "low";
  implemented: boolean;
}

/**
 * 获取当前页面的性能指标
 */
export function getCurrentPerformanceMetrics(): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    const metrics: PerformanceMetrics = {};

    // 获取导航时间
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      metrics.domContentLoaded =
        navigation.domContentLoadedEventEnd - navigation.fetchStart;
      metrics.ttfb = navigation.responseStart - navigation.fetchStart;
      metrics.fcp = navigation.responseEnd - navigation.fetchStart;
    }

    // 尝试获取 Web Vitals（如果可用）
    if ("web-vitals" in window) {
      // 这里可以集成 web-vitals 库
      console.log("Web Vitals 库可用，可以获取更详细的指标");
    }

    // 使用 Performance Observer 获取更多指标
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === "largest-contentful-paint") {
              metrics.lcp = entry.startTime;
            }
            if (entry.entryType === "first-input") {
              metrics.fid = (entry as any).processingStart - entry.startTime;
            }
            if (entry.entryType === "layout-shift") {
              if (!(entry as any).hadRecentInput) {
                metrics.cls = (metrics.cls || 0) + (entry as any).value;
              }
            }
          });
        });

        observer.observe({
          entryTypes: [
            "largest-contentful-paint",
            "first-input",
            "layout-shift",
          ],
        });

        // 5秒后停止观察并返回结果
        setTimeout(() => {
          observer.disconnect();
          resolve(metrics);
        }, 5000);
      } catch (error) {
        console.warn("Performance Observer 不可用:", error);
        resolve(metrics);
      }
    } else {
      resolve(metrics);
    }
  });
}

/**
 * 分析性能指标并提供优化建议
 */
export function analyzePerformanceMetrics(
  metrics: PerformanceMetrics
): OptimizationResult[] {
  const optimizations: OptimizationResult[] = [];

  // LCP 优化建议
  if (metrics.lcp && metrics.lcp > 2500) {
    optimizations.push({
      category: "Largest Contentful Paint (LCP)",
      optimizations: [
        "优化图片大小和格式（使用 WebP）",
        "预加载关键资源",
        "减少服务器响应时间",
        "移除阻塞渲染的资源",
        "使用 CDN 加速资源加载",
      ],
      impact: "high",
      implemented: false,
    });
  }

  // FID 优化建议
  if (metrics.fid && metrics.fid > 100) {
    optimizations.push({
      category: "First Input Delay (FID)",
      optimizations: [
        "减少 JavaScript 执行时间",
        "代码分割和懒加载",
        "移除未使用的 JavaScript",
        "优化第三方脚本",
        "使用 Web Workers 处理复杂计算",
      ],
      impact: "high",
      implemented: false,
    });
  }

  // CLS 优化建议
  if (metrics.cls && metrics.cls > 0.1) {
    optimizations.push({
      category: "Cumulative Layout Shift (CLS)",
      optimizations: [
        "为图片和视频设置尺寸属性",
        "预留广告和嵌入内容的空间",
        "避免在现有内容上方插入内容",
        "使用 transform 动画而不是改变布局的属性",
        "确保字体加载不会导致布局偏移",
      ],
      impact: "high",
      implemented: false,
    });
  }

  // 加载时间优化
  if (metrics.loadTime && metrics.loadTime > 3000) {
    optimizations.push({
      category: "页面加载时间",
      optimizations: [
        "启用 Gzip/Brotli 压缩",
        "优化图片（压缩、格式转换）",
        "减少 HTTP 请求数量",
        "使用浏览器缓存",
        "压缩 CSS 和 JavaScript",
        "移除未使用的代码",
      ],
      impact: "medium",
      implemented: false,
    });
  }

  // TTFB 优化建议
  if (metrics.ttfb && metrics.ttfb > 600) {
    optimizations.push({
      category: "Time to First Byte (TTFB)",
      optimizations: [
        "优化服务器配置",
        "使用 CDN",
        "启用服务器端缓存",
        "优化数据库查询",
        "减少服务器处理时间",
      ],
      impact: "medium",
      implemented: false,
    });
  }

  return optimizations;
}

/**
 * 自动应用一些基础的性能优化
 */
export function applyBasicOptimizations(): OptimizationResult[] {
  const applied: OptimizationResult[] = [];

  try {
    // 1. 预加载关键资源
    const criticalImages = document.querySelectorAll(
      'img[data-priority="high"]'
    );
    criticalImages.forEach((img) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = img.getAttribute("src") || "";
      document.head.appendChild(link);
    });

    if (criticalImages.length > 0) {
      applied.push({
        category: "资源预加载",
        optimizations: [`预加载了 ${criticalImages.length} 个关键图片`],
        impact: "medium",
        implemented: true,
      });
    }

    // 2. 懒加载非关键图片
    const lazyImages = document.querySelectorAll(
      'img:not([data-priority="high"])'
    );
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          }
        });
      });

      lazyImages.forEach((img) => {
        if (img.getAttribute("src") && !img.dataset.src) {
          img.dataset.src = img.getAttribute("src") || "";
          img.removeAttribute("src");
          imageObserver.observe(img);
        }
      });

      if (lazyImages.length > 0) {
        applied.push({
          category: "图片懒加载",
          optimizations: [`设置了 ${lazyImages.length} 个图片的懒加载`],
          impact: "medium",
          implemented: true,
        });
      }
    }

    // 3. 优化字体加载
    const fontLinks = document.querySelectorAll('link[href*="fonts"]');
    fontLinks.forEach((link) => {
      link.setAttribute("rel", "preload");
      link.setAttribute("as", "font");
      link.setAttribute("crossorigin", "anonymous");
    });

    if (fontLinks.length > 0) {
      applied.push({
        category: "字体优化",
        optimizations: [`优化了 ${fontLinks.length} 个字体的加载`],
        impact: "low",
        implemented: true,
      });
    }

    // 4. 添加资源提示
    const externalLinks = document.querySelectorAll(
      'a[href^="http"]:not([href*="' + window.location.hostname + '"])'
    );
    const domains = new Set<string>();

    externalLinks.forEach((link) => {
      try {
        const url = new URL(link.getAttribute("href") || "");
        domains.add(url.hostname);
      } catch (e) {
        // 忽略无效 URL
      }
    });

    domains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    if (domains.size > 0) {
      applied.push({
        category: "DNS 预解析",
        optimizations: [`为 ${domains.size} 个外部域名添加了 DNS 预解析`],
        impact: "low",
        implemented: true,
      });
    }

    // 5. 优化动画性能
    const animatedElements = document.querySelectorAll(
      '[class*="animate"], [style*="animation"]'
    );
    animatedElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      if (!htmlElement.style.willChange) {
        htmlElement.style.willChange = "transform";
      }
    });

    if (animatedElements.length > 0) {
      applied.push({
        category: "动画优化",
        optimizations: [
          `为 ${animatedElements.length} 个动画元素添加了 will-change 属性`,
        ],
        impact: "low",
        implemented: true,
      });
    }
  } catch (error) {
    console.error("应用基础优化时出错:", error);
  }

  return applied;
}

/**
 * 生成性能优化报告
 */
export async function generatePerformanceReport(): Promise<{
  metrics: PerformanceMetrics;
  recommendations: OptimizationResult[];
  appliedOptimizations: OptimizationResult[];
  score: number;
}> {
  console.group("📊 生成性能优化报告");

  // 获取性能指标
  const metrics = await getCurrentPerformanceMetrics();
  console.log("📈 性能指标:", metrics);

  // 分析并获取建议
  const recommendations = analyzePerformanceMetrics(metrics);
  console.log("💡 优化建议:", recommendations);

  // 应用基础优化
  const appliedOptimizations = applyBasicOptimizations();
  console.log("✅ 已应用优化:", appliedOptimizations);

  // 计算性能评分
  let score = 100;

  if (metrics.lcp && metrics.lcp > 2500) score -= 20;
  else if (metrics.lcp && metrics.lcp > 1200) score -= 10;

  if (metrics.fid && metrics.fid > 100) score -= 20;
  else if (metrics.fid && metrics.fid > 50) score -= 10;

  if (metrics.cls && metrics.cls > 0.1) score -= 20;
  else if (metrics.cls && metrics.cls > 0.05) score -= 10;

  if (metrics.loadTime && metrics.loadTime > 3000) score -= 15;
  else if (metrics.loadTime && metrics.loadTime > 2000) score -= 8;

  if (metrics.ttfb && metrics.ttfb > 600) score -= 10;
  else if (metrics.ttfb && metrics.ttfb > 300) score -= 5;

  score = Math.max(0, score);

  console.log(`🎯 性能评分: ${score}%`);
  console.groupEnd();

  return {
    metrics,
    recommendations,
    appliedOptimizations,
    score,
  };
}

/**
 * 监控性能指标变化
 */
export function startPerformanceMonitoring(
  callback: (metrics: PerformanceMetrics) => void
) {
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      const metrics: PerformanceMetrics = {};

      list.getEntries().forEach((entry) => {
        if (entry.entryType === "largest-contentful-paint") {
          metrics.lcp = entry.startTime;
        }
        if (entry.entryType === "first-input") {
          metrics.fid = (entry as any).processingStart - entry.startTime;
        }
        if (entry.entryType === "layout-shift") {
          if (!(entry as any).hadRecentInput) {
            metrics.cls = (metrics.cls || 0) + (entry as any).value;
          }
        }
      });

      callback(metrics);
    });

    observer.observe({
      entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
    });

    return () => observer.disconnect();
  }

  return () => {};
}

/**
 * 检查 Lighthouse 性能评分的关键因素
 */
export function checkLighthouseFactors(): {
  factor: string;
  status: "good" | "needs-improvement" | "poor";
  value?: number;
  recommendation: string;
}[] {
  const factors = [];

  // 检查图片优化
  const images = document.querySelectorAll("img");
  let unoptimizedImages = 0;
  images.forEach((img) => {
    const src = img.src;
    if (src && !src.includes(".webp") && !src.includes("data:image")) {
      unoptimizedImages++;
    }
  });

  factors.push({
    factor: "图片格式优化",
    status:
      unoptimizedImages === 0
        ? "good"
        : unoptimizedImages < images.length / 2
        ? "needs-improvement"
        : "poor",
    value: unoptimizedImages,
    recommendation:
      unoptimizedImages > 0 ? "建议将图片转换为 WebP 格式" : "图片格式已优化",
  });

  // 检查文本压缩
  const textContent = document.documentElement.outerHTML;
  const isCompressed = textContent.length < 50000; // 简化的检查

  factors.push({
    factor: "文本压缩",
    status: isCompressed ? "good" : "needs-improvement",
    value: textContent.length,
    recommendation: isCompressed
      ? "文本内容大小合理"
      : "建议启用 Gzip/Brotli 压缩",
  });

  // 检查未使用的 CSS
  const stylesheets = document.querySelectorAll(
    'link[rel="stylesheet"], style'
  );
  factors.push({
    factor: "CSS 优化",
    status: stylesheets.length < 5 ? "good" : "needs-improvement",
    value: stylesheets.length,
    recommendation:
      stylesheets.length > 5 ? "考虑合并和压缩 CSS 文件" : "CSS 文件数量合理",
  });

  // 检查 JavaScript 优化
  const scripts = document.querySelectorAll("script[src]");
  factors.push({
    factor: "JavaScript 优化",
    status: scripts.length < 10 ? "good" : "needs-improvement",
    value: scripts.length,
    recommendation:
      scripts.length > 10
        ? "考虑合并和压缩 JavaScript 文件"
        : "JavaScript 文件数量合理",
  });

  return factors;
}
