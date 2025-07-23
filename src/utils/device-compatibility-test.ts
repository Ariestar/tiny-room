/**
 * 设备兼容性测试工具
 * 用于检测和测试不同设备和屏幕尺寸下的兼容性
 */

export interface DeviceTestResult {
  device: string;
  screenSize: string;
  viewport: { width: number; height: number };
  userAgent: string;
  touchSupport: boolean;
  orientation: string;
  pixelRatio: number;
  issues: string[];
  recommendations: string[];
}

export interface CompatibilityTestSuite {
  layout: boolean;
  touch: boolean;
  performance: boolean;
  accessibility: boolean;
  animations: boolean;
}

/**
 * 获取当前设备信息
 */
export function getCurrentDeviceInfo(): DeviceTestResult {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const issues: string[] = [];
  const recommendations: string[] = [];

  // 检测设备类型
  const isMobile = viewport.width <= 640;
  const isTablet = viewport.width > 640 && viewport.width <= 1024;
  const isDesktop = viewport.width > 1024;

  // 检测触控支持
  const touchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // 检测屏幕方向
  const orientation =
    viewport.width > viewport.height ? "landscape" : "portrait";

  // 检测像素比
  const pixelRatio = window.devicePixelRatio || 1;

  // 设备特定检查
  if (isMobile) {
    // 移动端检查
    if (viewport.width < 320) {
      issues.push("屏幕宽度过小，可能影响内容显示");
      recommendations.push("考虑为超小屏幕设备优化布局");
    }

    if (!touchSupport) {
      issues.push("移动设备但未检测到触控支持");
    }

    if (pixelRatio < 2) {
      recommendations.push("考虑为低分辨率屏幕优化图片");
    }
  }

  if (isTablet) {
    // 平板端检查
    if (orientation === "portrait" && viewport.width < 768) {
      recommendations.push("平板竖屏模式下考虑调整布局");
    }
  }

  return {
    device: isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop",
    screenSize: `${viewport.width}x${viewport.height}`,
    viewport,
    userAgent: navigator.userAgent,
    touchSupport,
    orientation,
    pixelRatio,
    issues,
    recommendations,
  };
}

/**
 * 测试布局兼容性
 */
export function testLayoutCompatibility(): {
  passed: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const viewport = { width: window.innerWidth, height: window.innerHeight };

  // 检查关键元素是否可见
  const heroSection = document.querySelector('[data-testid="hero-section"]');
  const contentSections = document.querySelectorAll("[data-section]");
  const navigationButtons = document.querySelectorAll('[role="button"]');

  if (!heroSection) {
    issues.push("Hero区域未找到或不可见");
  }

  if (contentSections.length === 0) {
    issues.push("内容区域未找到");
  }

  // 检查按钮尺寸（移动端触控友好性）
  if (viewport.width <= 640) {
    navigationButtons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        issues.push(
          `按钮 ${index + 1} 尺寸过小，不符合触控标准 (${rect.width}x${
            rect.height
          })`
        );
      }
    });
  }

  // 检查水平滚动
  if (document.body.scrollWidth > viewport.width) {
    issues.push("页面存在水平滚动，可能影响移动端体验");
  }

  // 检查文本可读性
  const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
  textElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element);
    const fontSize = parseFloat(styles.fontSize);

    if (viewport.width <= 640 && fontSize < 14) {
      issues.push(`文本元素 ${index + 1} 字体过小 (${fontSize}px)`);
    }
  });

  return {
    passed: issues.length === 0,
    issues,
  };
}

/**
 * 测试触控交互
 */
export function testTouchInteraction(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  const touchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (!touchSupport) {
    return { passed: true, issues: ["设备不支持触控，跳过触控测试"] };
  }

  // 检查触控目标尺寸
  const interactiveElements = document.querySelectorAll(
    'button, a, [role="button"], [tabindex="0"]'
  );

  interactiveElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // Apple和Google推荐的最小触控目标尺寸

    if (rect.width < minSize || rect.height < minSize) {
      issues.push(
        `交互元素 ${index + 1} 触控目标过小: ${rect.width}x${rect.height}px`
      );
    }

    // 检查元素间距
    const siblings = Array.from(element.parentElement?.children || []);
    const elementIndex = siblings.indexOf(element);
    const nextSibling = siblings[elementIndex + 1] as HTMLElement;

    if (nextSibling) {
      const currentRect = element.getBoundingClientRect();
      const nextRect = nextSibling.getBoundingClientRect();
      const distance = Math.abs(nextRect.top - currentRect.bottom);

      if (distance < 8) {
        issues.push(`交互元素 ${index + 1} 与相邻元素间距过小: ${distance}px`);
      }
    }
  });

  return {
    passed: issues.length === 0,
    issues,
  };
}

/**
 * 测试性能表现
 */
export function testPerformance(): Promise<{
  passed: boolean;
  metrics: any;
  issues: string[];
}> {
  return new Promise((resolve) => {
    const issues: string[] = [];
    const metrics: any = {};

    // 检查 Core Web Vitals
    if ("web-vital" in window) {
      // 如果有 web-vitals 库
      resolve({
        passed: true,
        metrics: { note: "Web Vitals 检测需要 web-vitals 库" },
        issues,
      });
      return;
    }

    // 基础性能检测
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      metrics.domContentLoaded =
        navigation.domContentLoadedEventEnd - navigation.fetchStart;
      metrics.firstPaint = navigation.responseEnd - navigation.fetchStart;

      // 性能阈值检查
      if (metrics.loadTime > 3000) {
        issues.push(`页面加载时间过长: ${metrics.loadTime}ms`);
      }

      if (metrics.domContentLoaded > 1500) {
        issues.push(`DOM内容加载时间过长: ${metrics.domContentLoaded}ms`);
      }
    }

    // 检查图片加载
    const images = document.querySelectorAll("img");
    let loadedImages = 0;
    let totalImages = images.length;

    if (totalImages === 0) {
      resolve({
        passed: issues.length === 0,
        metrics,
        issues,
      });
      return;
    }

    images.forEach((img) => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            checkImagePerformance();
          }
        };
        img.onerror = () => {
          issues.push(`图片加载失败: ${img.src}`);
          loadedImages++;
          if (loadedImages === totalImages) {
            checkImagePerformance();
          }
        };
      }
    });

    function checkImagePerformance() {
      resolve({
        passed: issues.length === 0,
        metrics,
        issues,
      });
    }

    // 如果所有图片都已加载，立即检查
    if (loadedImages === totalImages) {
      checkImagePerformance();
    }
  });
}

/**
 * 测试无障碍性
 */
export function testAccessibility(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];

  // 检查图片 alt 属性
  const images = document.querySelectorAll("img");
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute("aria-label")) {
      issues.push(`图片 ${index + 1} 缺少 alt 属性或 aria-label`);
    }
  });

  // 检查按钮和链接的可访问性
  const interactiveElements = document.querySelectorAll(
    'button, a, [role="button"]'
  );
  interactiveElements.forEach((element, index) => {
    const hasText = element.textContent?.trim();
    const hasAriaLabel = element.getAttribute("aria-label");
    const hasTitle = element.getAttribute("title");

    if (!hasText && !hasAriaLabel && !hasTitle) {
      issues.push(`交互元素 ${index + 1} 缺少可访问的文本描述`);
    }

    // 检查 tabindex
    const tabIndex = element.getAttribute("tabindex");
    if (tabIndex && parseInt(tabIndex) > 0) {
      issues.push(
        `交互元素 ${index + 1} 使用了正数 tabindex，可能影响键盘导航顺序`
      );
    }
  });

  // 检查标题层级
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    if (index === 0 && currentLevel !== 1) {
      issues.push("页面应该从 h1 标题开始");
    }
    if (currentLevel > previousLevel + 1) {
      issues.push(
        `标题 ${
          index + 1
        } 跳跃了层级 (从 h${previousLevel} 到 h${currentLevel})`
      );
    }
    previousLevel = currentLevel;
  });

  // 检查颜色对比度（简化版）
  const textElements = document.querySelectorAll(
    "p, span, div, h1, h2, h3, h4, h5, h6"
  );
  textElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    // 这里可以添加更复杂的颜色对比度计算
    if (color === backgroundColor) {
      issues.push(`文本元素 ${index + 1} 颜色与背景色相同，无法阅读`);
    }
  });

  return {
    passed: issues.length === 0,
    issues,
  };
}

/**
 * 测试动画性能
 */
export function testAnimationPerformance(): {
  passed: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // 检查是否尊重用户的减少动画偏好
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    const animatedElements = document.querySelectorAll(
      '[style*="animation"], [class*="animate"]'
    );
    if (animatedElements.length > 0) {
      issues.push("用户偏好减少动画，但页面仍包含动画元素");
    }
  }

  // 检查动画元素是否使用了性能友好的属性
  const animatedElements = document.querySelectorAll("*");
  animatedElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element);
    const willChange = styles.willChange;
    const transform = styles.transform;

    // 检查是否有动画但没有优化
    if (
      (styles.animationName !== "none" || transform !== "none") &&
      willChange === "auto"
    ) {
      // 这可能需要优化，但不一定是问题
    }
  });

  return {
    passed: issues.length === 0,
    issues,
  };
}

/**
 * 运行完整的兼容性测试套件
 */
export async function runCompatibilityTestSuite(): Promise<{
  deviceInfo: DeviceTestResult;
  testResults: {
    layout: { passed: boolean; issues: string[] };
    touch: { passed: boolean; issues: string[] };
    performance: { passed: boolean; metrics: any; issues: string[] };
    accessibility: { passed: boolean; issues: string[] };
    animations: { passed: boolean; issues: string[] };
  };
  overallScore: number;
  recommendations: string[];
}> {
  const deviceInfo = getCurrentDeviceInfo();

  const testResults = {
    layout: testLayoutCompatibility(),
    touch: testTouchInteraction(),
    performance: await testPerformance(),
    accessibility: testAccessibility(),
    animations: testAnimationPerformance(),
  };

  // 计算总体评分
  const passedTests = Object.values(testResults).filter(
    (result) => result.passed
  ).length;
  const totalTests = Object.keys(testResults).length;
  const overallScore = Math.round((passedTests / totalTests) * 100);

  // 生成建议
  const recommendations: string[] = [...deviceInfo.recommendations];

  Object.entries(testResults).forEach(([testName, result]) => {
    if (!result.passed && result.issues.length > 0) {
      recommendations.push(`${testName} 测试失败: ${result.issues[0]}`);
    }
  });

  return {
    deviceInfo,
    testResults,
    overallScore,
    recommendations,
  };
}

/**
 * 在控制台输出测试结果
 */
export function logTestResults(
  results: Awaited<ReturnType<typeof runCompatibilityTestSuite>>
) {
  console.group("🔍 设备兼容性测试结果");

  console.log("📱 设备信息:", results.deviceInfo);
  console.log("📊 总体评分:", `${results.overallScore}%`);

  console.group("📋 详细测试结果");
  Object.entries(results.testResults).forEach(([testName, result]) => {
    const status = result.passed ? "✅" : "❌";
    console.log(`${status} ${testName}:`, result);
  });
  console.groupEnd();

  if (results.recommendations.length > 0) {
    console.group("💡 优化建议");
    results.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    console.groupEnd();
  }

  console.groupEnd();
}
