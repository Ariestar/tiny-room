import { ReactNode } from "react";

/**
 * 呼吸动画组件的属性类型
 */
export interface BreathingAnimationProps {
  children: ReactNode;
  duration?: number; // 动画周期，默认 6-8 秒
  scaleRange?: [number, number]; // 缩放范围，默认 [1, 1.008]
  brightnessRange?: [number, number]; // 亮度范围，默认 [1, 1.02]
  saturateRange?: [number, number]; // 饱和度范围，默认 [1, 1.05]
  delay?: number; // 动画延迟
  pauseOnHover?: boolean; // 悬停时暂停，默认 true
  contentType?: "landscape" | "portrait" | "article" | "default";
  disabled?: boolean; // 禁用动画（响应 prefers-reduced-motion）
  className?: string;
}

/**
 * 磁吸悬停组件的属性类型
 */
export interface MagneticHoverProps {
  children: ReactNode;
  strength?: number; // 磁吸强度，0-1 之间，默认 0.15
  scaleOnHover?: number; // 悬停缩放，默认 1.03
  showHalo?: boolean; // 显示光晕效果，默认 true
  haloColor?: string; // 光晕颜色，默认根据主题
  rotationIntensity?: number; // 3D 旋转强度，默认 0.05
  className?: string;
  disabled?: boolean;
}

/**
 * 视差滚动组件的属性类型
 */
export interface ParallaxItemProps {
  children: ReactNode;
  layer?: number; // 视差层级，0-2
  intensity?: number; // 视差强度，默认 0.5
  className?: string;
  disabled?: boolean;
}

/**
 * 多层视差容器组件的属性类型
 */
export interface ParallaxContainerProps {
  children: ReactNode;
  intensity?: number; // 视差强度，默认 0.5
  className?: string;
  disabled?: boolean;
}

/**
 * 滚动指示器组件的属性类型
 */
export interface ScrollIndicatorProps {
  show: boolean;
  text?: string;
  className?: string;
}

/**
 * 内容类型枚举
 * 用于呼吸动画组件的不同动画参数配置
 */
export type ContentType = "landscape" | "portrait" | "article" | "default";

/**
 * 视差层级类型
 * 0: 正常速度 (无视差)
 * 1: 稍慢速度 (轻微视差)
 * 2: 最慢速度 (明显视差)
 */
export type ParallaxLayer = 0 | 1 | 2;

/**
 * 动画配置类型
 * 用于统一管理动画参数
 */
export interface AnimationConfig {
  // 呼吸动画配置
  breathing: {
    landscape: number; // 风景图片动画周期
    portrait: number; // 人像图片动画周期
    article: number; // 文章卡片动画周期
    default: number; // 默认动画周期
  };

  // 磁吸效果配置
  magnetic: {
    gallery: number; // Gallery 图片磁吸强度
    blog: number; // Blog 卡片磁吸强度
    default: number; // 默认磁吸强度
  };

  // 视差效果配置
  parallax: {
    intensity: number; // 默认视差强度
    layers: number; // 视差层级数量
  };
}

/**
 * 动画性能配置类型
 */
export interface AnimationPerformanceConfig {
  enableGPUAcceleration: boolean; // 启用 GPU 加速
  respectReducedMotion: boolean; // 尊重用户减少动画偏好
  optimizeForMobile: boolean; // 移动端优化
  viewportMargin: string; // 视口检测边距
}

/**
 * 主题相关的动画配置类型
 */
export interface ThemeAnimationConfig {
  primaryRgb: string; // 主色调 RGB 值
  secondaryRgb: string; // 次要色调 RGB 值
  accentRgb: string; // 强调色 RGB 值
}

/**
 * 组件导出类型
 * 用于统一管理所有动画组件的导出
 */
export interface AnimationComponents {
  BreathingAnimation: React.ComponentType<BreathingAnimationProps>;
  MagneticHover: React.ComponentType<MagneticHoverProps>;
  ParallaxItem: React.ComponentType<ParallaxItemProps>;
  ParallaxContainer: React.ComponentType<ParallaxContainerProps>;
  ScrollIndicator: React.ComponentType<ScrollIndicatorProps>;
}

/**
 * 动画事件回调类型
 */
export interface AnimationCallbacks {
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onViewportEnter?: () => void;
  onViewportLeave?: () => void;
}

/**
 * 扩展的呼吸动画属性类型（包含回调）
 */
export interface ExtendedBreathingAnimationProps
  extends BreathingAnimationProps,
    AnimationCallbacks {}

/**
 * 扩展的磁吸悬停属性类型（包含回调）
 */
export interface ExtendedMagneticHoverProps
  extends MagneticHoverProps,
    AnimationCallbacks {}

/**
 * 扩展的视差滚动属性类型（包含回调）
 */
export interface ExtendedParallaxItemProps
  extends ParallaxItemProps,
    AnimationCallbacks {}
