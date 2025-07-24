import { test, expect } from "@playwright/test";

test.describe("Homepage E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load homepage successfully", async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/Tiny Room/);

    // 检查主要内容区域
    await expect(page.locator("main")).toBeVisible();

    // 检查 Hero 区域
    await expect(page.locator("text=欢迎来到 Tiny Room")).toBeVisible();
  });

  test("should have working navigation buttons", async ({ page }) => {
    // 检查快速导航按钮
    const exploreButton = page.locator("text=探索内容");
    const learnMoreButton = page.locator("text=了解更多");

    await expect(exploreButton).toBeVisible();
    await expect(learnMoreButton).toBeVisible();

    // 测试按钮点击
    await exploreButton.click();

    // 检查页面是否滚动到内容区域
    await expect(page.locator('[data-section="content"]')).toBeInViewport();
  });

  test("should expand personal introduction", async ({ page }) => {
    // 找到"了解更多"按钮
    const expandButton = page.locator('button:has-text("了解更多")');
    await expect(expandButton).toBeVisible();

    // 点击展开
    await expandButton.click();

    // 检查按钮文本变化
    await expect(page.locator('button:has-text("收起详情")')).toBeVisible();

    // 检查展开的内容是否可见
    await expect(page.locator("#personal-details")).toBeVisible();
  });

  test("should have accessible social links", async ({ page }) => {
    // 检查社交媒体链接区域
    const socialSection = page.locator("text=社交媒体").locator("..");
    await expect(socialSection).toBeVisible();

    // 检查社交链接是否可点击
    const socialLinks = page.locator(
      '[aria-label*="GitHub"], [aria-label*="邮箱"]'
    );
    const count = await socialLinks.count();
    expect(count).toBeGreaterThan(0);

    // 检查第一个链接的无障碍属性
    const firstLink = socialLinks.first();
    await expect(firstLink).toHaveAttribute("aria-label");
  });

  test("should be responsive on mobile", async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });

    // 检查移动端布局
    await expect(page.locator("main")).toBeVisible();

    // 检查按钮在移动端是否足够大（触控友好）
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      if (box) {
        // 检查按钮尺寸是否符合触控标准（44px）
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("should load blog posts and projects", async ({ page }) => {
    // 等待 API 数据加载
    await page.waitForLoadState("networkidle");

    // 检查博客文章区域
    const blogSection = page.locator("text=最新文章").locator("..");
    await expect(blogSection).toBeVisible();

    // 检查项目展示区域
    const projectSection = page.locator("text=精选项目").locator("..");
    await expect(projectSection).toBeVisible();
  });

  test("should handle keyboard navigation", async ({ page }) => {
    // 使用 Tab 键导航
    await page.keyboard.press("Tab");

    // 检查焦点是否在可交互元素上
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // 继续 Tab 导航几次
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const currentFocus = page.locator(":focus");
      await expect(currentFocus).toBeVisible();
    }
  });

  test("should have proper error handling", async ({ page }) => {
    // 模拟网络错误
    await page.route("/api/posts", (route) => route.abort());
    await page.route("/api/projects", (route) => route.abort());

    await page.reload();

    // 检查是否显示错误处理界面
    await expect(page.locator("text=加载数据时出现问题")).toBeVisible();

    // 检查重试按钮
    const retryButton = page.locator('button:has-text("刷新页面")');
    await expect(retryButton).toBeVisible();
  });
});
