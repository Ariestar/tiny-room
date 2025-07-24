/**
 * 统一样式工具
 * Unified Style Utilities
 */

import localFont from "next/font/local";

/**
 * 字体配置
 */
const lxgwWenkai = localFont({
  src: [
    {
      path: "../../assets/fonts/LXGWWenKai-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-lxgw-wenkai",
});

const bookerly = localFont({
  src: [
    {
      path: "../../assets/fonts/Bookerly.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-bookerly",
});

export const fonts = {
  lxgwWenkai,
  bookerly,
};

/**
 * 字体变量
 */
export const fontVariables = {
  lxgwWenkai: fonts.lxgwWenkai.variable,
  bookerly: fonts.bookerly.variable,
};

/**
 * 字体类名
 */
export const fontClasses = {
  lxgwWenkai: fonts.lxgwWenkai.className,
  bookerly: fonts.bookerly.className,
};

/**
 * 常用样式工具函数
 */
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

/**
 * 样式工具集合
 */
export const styleUtils = {
  fonts,
  fontVariables,
  fontClasses,
  cn,
};

// 所有变量已在上面使用 export const 导出

export default styleUtils;
