module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000"],
      startServerCommand: "npm run build && npm run start",
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "categories:pwa": "off",

        // Core Web Vitals
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "first-input-delay": ["warn", { maxNumericValue: 100 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],

        // 其他重要指标
        "speed-index": ["warn", { maxNumericValue: 3000 }],
        interactive: ["warn", { maxNumericValue: 3000 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 1500 }],

        // 无障碍检查
        "color-contrast": "error",
        "image-alt": "error",
        label: "error",
        "link-name": "error",

        // SEO 检查
        "document-title": "error",
        "meta-description": "error",
        "robots-txt": "warn",
        canonical: "warn",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
