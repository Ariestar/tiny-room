/**
 * 全面功能测试套件
 * 用于测试所有交互元素、动画效果和内容显示
 */

export interface FunctionalTestResult {
  testName: string;
  passed: boolean;
  issues: string[];
  recommendations: string[];
  score: number;
}

export interface TestSuiteResult {
  overallScore: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: FunctionalTestResult[];
  summary: string;
}

/**
 * 测试所有交互元素的功能
 */
export function testInteractiveElements(): FunctionalTestResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    // 测试按钮元素
    const buttons = document.querySelectorAll('button, [role="button"]');
    console.log(`🔍 发现 ${buttons.length} 个按钮元素`);

    buttons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();

      // 检查按钮尺寸
      if (rect.width < 44 || rect.height < 44) {
        issues.push(
          `按钮 ${index + 1} 尺寸过小 (${rect.width}x${rect.height}px)`
        );
      }

      // 检查按钮可见性
      if (rect.width === 0 || rect.height === 0) {
        issues.push(`按钮 ${index + 1} 不可见`);
      }

      // 检查按钮是否有文本或标签
      const hasText = button.textContent?.trim();
      const hasAriaLabel = button.getAttribute("aria-label");
      if (!hasText && !hasAriaLabel) {
        issues.push(`按钮 ${index + 1} 缺少文本或 aria-label`);
      }
    });

    // 测试链接元素
    const links = document.querySelectorAll("a");
    console.log(`🔍 发现 ${links.length} 个链接元素`);

    links.forEach((link, index) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") {
        issues.push(`链接 ${index + 1} 缺少有效的 href 属性`);
      }

      // 检查外部链接是否有安全属性
      if (
        href &&
        href.startsWith("http") &&
        !href.includes(window.location.hostname)
      ) {
        const rel = link.getAttribute("rel");
        if (!rel || !rel.includes("noopener")) {
          recommendations.push(
            `外部链接 ${index + 1} 建议添加 rel="noopener noreferrer"`
          );
        }
      }
    });

    // 测试表单元素
    const formElements = document.querySelectorAll("input, textarea, select");
    console.log(`🔍 发现 ${formElements.length} 个表单元素`);

    formElements.forEach((element, index) => {
      const label = document.querySelector(`label[for="${element.id}"]`);
      const ariaLabel = element.getAttribute("aria-label");
      const ariaLabelledBy = element.getAttribute("aria-labelledby");

      if (!label && !ariaLabel && !ariaLabelledBy) {
        issues.push(`表单元素 ${index + 1} 缺少标签`);
      }
    });

    const score = Math.max(
      0,
      100 - issues.length * 10 - recommendations.length * 5
    );

    return {
      testName: "交互元素功能测试",
      passed: issues.length === 0,
      issues,
      recommendations,
      score,
    };
  } catch (error) {
    return {
      testName: "交互元素功能测试",
      passed: false,
      issues: [`测试执行失败: ${error}`],
      recommendations: ["检查页面是否正确加载"],
      score: 0,
    };
  }
}

/**
 * 验证动画效果的流畅性
 */
export function testAnimationPerformance(): FunctionalTestResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    // 检查动画元素
    const animatedElements = document.querySelectorAll(
      '[class*="animate"], [style*="animation"], [style*="transition"]'
    );
    console.log(`🔍 发现 ${animatedElements.length} 个动画元素`);

    // 检查是否尊重用户的减少动画偏好
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion && animatedElements.length > 0) {
      issues.push("用户偏好减少动画，但页面仍包含动画元素");
      recommendations.push("为动画元素添加 prefers-reduced-motion 媒体查询");
    }

    // 检查动画性能优化
    animatedElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const willChange = styles.willChange;
      const transform = styles.transform;

      // 检查是否使用了性能友好的属性
      if (styles.animationName !== "none" && willChange === "auto") {
        recommendations.push(`动画元素 ${index + 1} 建议添加 will-change 属性`);
      }

      // 检查是否使用了 GPU 加速的属性
      if (transform === "none" && styles.animationName !== "none") {
        recommendations.push(
          `动画元素 ${index + 1} 建议使用 transform 属性进行动画`
        );
      }
    });

    // 检查 Framer Motion 组件
    const motionElements = document.querySelectorAll("[data-framer-motion]");
    console.log(`🔍 发现 ${motionElements.length} 个 Framer Motion 元素`);

    if (motionElements.length > 20) {
      recommendations.push("页面包含大量动画元素，考虑优化动画数量");
    }

    const score = Math.max(
      0,
      100 - issues.length * 15 - recommendations.length * 5
    );

    return {
      testName: "动画性能测试",
      passed: issues.length === 0,
      issues,
      recommendations,
      score,
    };
  } catch (error) {
    return {
      testName: "动画性能测试",
      passed: false,
      issues: [`测试执行失败: ${error}`],
      recommendations: ["检查动画库是否正确加载"],
      score: 0,
    };
  }
}

/**
 * 检查内容的正确显示
 */
export function testContentDisplay(): FunctionalTestResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    // 检查关键内容区域
    const heroSection = document.querySelector(
      '[data-testid="hero-section"], .hero, [class*="hero"]'
    );
    if (!heroSection) {
      issues.push("未找到 Hero 区域");
    }

    const contentSections = document.querySelectorAll(
      "[data-section], section"
    );
    console.log(`🔍 发现 ${contentSections.length} 个内容区域`);

    if (contentSections.length === 0) {
      issues.push("未找到内容区域");
    }

    // 检查图片加载
    const images = document.querySelectorAll("img");
    let brokenImages = 0;

    images.forEach((img, index) => {
      if (!img.complete || img.naturalWidth === 0) {
        brokenImages++;
      }

      if (!img.alt && !img.getAttribute("aria-label")) {
        issues.push(`图片 ${index + 1} 缺少 alt 属性`);
      }
    });

    if (brokenImages > 0) {
      issues.push(`${brokenImages} 张图片加载失败`);
    }

    console.log(
      `🔍 检查了 ${images.length} 张图片，${brokenImages} 张加载失败`
    );

    // 检查文本内容
    const textElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
    let emptyTextElements = 0;

    textElements.forEach((element) => {
      if (!element.textContent?.trim()) {
        emptyTextElements++;
      }
    });

    if (emptyTextElements > 0) {
      recommendations.push(`${emptyTextElements} 个文本元素为空`);
    }

    // 检查响应式布局
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    if (viewport.width < 640) {
      // 移动端检查
      const horizontalScroll = document.body.scrollWidth > viewport.width;
      if (horizontalScroll) {
        issues.push("移动端存在水平滚动");
      }
    }

    const score = Math.max(
      0,
      100 - issues.length * 10 - recommendations.length * 3
    );

    return {
      testName: "内容显示测试",
      passed: issues.length === 0,
      issues,
      recommendations,
      score,
    };
  } catch (error) {
    return {
      testName: "内容显示测试",
      passed: false,
      issues: [`测试执行失败: ${error}`],
      recommendations: ["检查页面内容是否正确渲染"],
      score: 0,
    };
  }
}

/**
 * 测试页面性能
 */
export function testPagePerformance(): Promise<FunctionalTestResult> {
  return new Promise((resolve) => {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // 获取性能指标
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const domContentLoaded =
          navigation.domContentLoadedEventEnd - navigation.fetchStart;
        const firstPaint = navigation.responseEnd - navigation.fetchStart;

        console.log(`📊 性能指标:`, {
          loadTime: `${loadTime}ms`,
          domContentLoaded: `${domContentLoaded}ms`,
          firstPaint: `${firstPaint}ms`,
        });

        // 性能阈值检查
        if (loadTime > 3000) {
          issues.push(`页面加载时间过长: ${loadTime}ms`);
        } else if (loadTime > 2000) {
          recommendations.push(`页面加载时间较长: ${loadTime}ms，建议优化`);
        }

        if (domContentLoaded > 1500) {
          issues.push(`DOM 内容加载时间过长: ${domContentLoaded}ms`);
        }

        if (firstPaint > 1000) {
          recommendations.push(`首次绘制时间较长: ${firstPaint}ms`);
        }
      }

      // 检查资源大小
      const resources = performance.getEntriesByType("resource");
      let totalSize = 0;
      let largeResources = 0;

      resources.forEach((resource: any) => {
        if (resource.transferSize) {
          totalSize += resource.transferSize;
          if (resource.transferSize > 500000) {
            // 500KB
            largeResources++;
          }
        }
      });

      console.log(
        `📊 资源统计: 总大小 ${Math.round(
          totalSize / 1024
        )}KB，大文件 ${largeResources} 个`
      );

      if (largeResources > 0) {
        recommendations.push(`发现 ${largeResources} 个大文件资源，建议优化`);
      }

      // 检查 Core Web Vitals（简化版）
      if ("web-vitals" in window) {
        // 如果有 web-vitals 库，可以获取更详细的指标
        recommendations.push("建议集成 web-vitals 库获取详细性能指标");
      }

      const score = Math.max(
        0,
        100 - issues.length * 20 - recommendations.length * 5
      );

      resolve({
        testName: "页面性能测试",
        passed: issues.length === 0,
        issues,
        recommendations,
        score,
      });
    } catch (error) {
      resolve({
        testName: "页面性能测试",
        passed: false,
        issues: [`测试执行失败: ${error}`],
        recommendations: ["检查浏览器性能 API 支持"],
        score: 0,
      });
    }
  });
}

/**
 * 运行完整的功能测试套件
 */
export async function runFunctionalTestSuite(): Promise<TestSuiteResult> {
  console.group("🧪 开始功能测试套件");

  const results: FunctionalTestResult[] = [];

  // 运行各项测试
  results.push(testInteractiveElements());
  results.push(testAnimationPerformance());
  results.push(testContentDisplay());
  results.push(await testPagePerformance());

  // 计算总体结果
  const totalTests = results.length;
  const passedTests = results.filter((r) => r.passed).length;
  const failedTests = totalTests - passedTests;
  const overallScore = Math.round(
    results.reduce((sum, r) => sum + r.score, 0) / totalTests
  );

  // 生成总结
  let summary = "";
  if (overallScore >= 90) {
    summary = "🎉 优秀！页面功能测试表现出色";
  } else if (overallScore >= 70) {
    summary = "👍 良好！页面功能基本正常，有一些优化空间";
  } else if (overallScore >= 50) {
    summary = "⚠️ 一般！页面存在一些问题需要修复";
  } else {
    summary = "❌ 需要改进！页面存在较多问题";
  }

  const result = {
    overallScore,
    totalTests,
    passedTests,
    failedTests,
    results,
    summary,
  };

  console.log("📊 测试结果:", result);
  console.groupEnd();

  return result;
}

/**
 * 在控制台输出详细的测试报告
 */
export function logDetailedTestReport(testResult: TestSuiteResult) {
  console.group("📋 详细测试报告");

  console.log(`🎯 总体评分: ${testResult.overallScore}%`);
  console.log(
    `✅ 通过测试: ${testResult.passedTests}/${testResult.totalTests}`
  );
  console.log(
    `❌ 失败测试: ${testResult.failedTests}/${testResult.totalTests}`
  );
  console.log(`📝 总结: ${testResult.summary}`);

  console.group("📊 详细结果");
  testResult.results.forEach((result, index) => {
    const status = result.passed ? "✅" : "❌";
    console.group(`${status} ${result.testName} (${result.score}%)`);

    if (result.issues.length > 0) {
      console.group("❌ 问题");
      result.issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue}`);
      });
      console.groupEnd();
    }

    if (result.recommendations.length > 0) {
      console.group("💡 建议");
      result.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
      console.groupEnd();
    }

    console.groupEnd();
  });
  console.groupEnd();

  console.groupEnd();
}
