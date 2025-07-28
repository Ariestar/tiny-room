# 设计文档

## 概述

本设计文档专注于在现有 Tiny Room Gallery 和 Blog 页面基础上添加视觉增强特效。项目已有完善的基础架构（Masonry 瀑布流、BentoGrid 布局、Framer Motion 动画系统），我们将在此基础上添加视差滚动、磁吸悬停、呼吸动画等特效，通过组件化方式实现复用。

## 现有架构分析

### 当前实现状态

- ✅ **Gallery 页面**: 使用 `react-masonry-css` 实现瀑布流布局
- ✅ **Blog 页面**: 使用 `BentoGrid` 组件实现网格布局
- ✅ **动画系统**: 已集成 Framer Motion，有 `ScrollReveal` 等动画组件
- ✅ **全屏查看**: `FullscreenCarousel` 组件处理图片详情
- ✅ **响应式设计**: 完整的移动端适配
- ✅ **性能优化**: 图片懒加载、预加载机制

### 需要增强的部分

- 🔄 **视差滚动效果**: 在现有 Masonry 布局上添加视差层次
- 🔄 **磁吸悬停效果**: 为图片和文章卡片添加磁吸交互
- 🔄 **呼吸动画效果**: 为静态元素添加生动的呼吸动画
- 🔄 **图片详情滚动**: 增强 `FullscreenCarousel` 的滚动交互

## 增强组件设计

### 技术栈（基于现有）

- **现有**: React 18 + Next.js 15 + Framer Motion + TypeScript
- **新增**: CSS 自定义属性用于动画参数配置
- **保持**: 现有的组件结构和样式系统

## 新增组件设计

### 1. BreathingAnimation 组件（新增到 src/components/animation/）

#### 组件接口

```typescript
interface BreathingAnimationProps {
  children: React.ReactNode;
  duration?: number; // 动画周期，默认 6-8 秒
  scaleRange?: [number, number]; // 缩放范围，默认 [1, 1.008]
  brightnessRange?: [number, number]; // 亮度范围，默认 [1, 1.02]
  saturateRange?: [number, number]; // 饱和度范围，默认 [1, 1.05]
  delay?: number; // 动画延迟
  pauseOnHover?: boolean; // 悬停时暂停，默认 true
  contentType?: "landscape" | "portrait" | "article" | "default";
  disabled?: boolean; // 禁用动画（响应 prefers-reduced-motion）
}
```

#### 实现策略（基于现有动画系统）

```typescript
// 利用现有的 Framer Motion 系统
export const BreathingAnimation: React.FC<BreathingAnimationProps> = ({
  children,
  duration = 6,
  scaleRange = [1, 1.008],
  brightnessRange = [1, 1.02],
  saturateRange = [1, 1.05],
  delay = 0,
  pauseOnHover = true,
  contentType = "default",
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // 根据内容类型调整参数
  const adjustedDuration = useMemo(() => {
    switch (contentType) {
      case "landscape":
        return 8;
      case "portrait":
        return 5;
      case "article":
        return 7;
      default:
        return duration;
    }
  }, [contentType, duration]);

  return (
    <motion.div
      style={
        {
          "--scale-min": scaleRange[0],
          "--scale-max": scaleRange[1],
          "--brightness-min": brightnessRange[0],
          "--brightness-max": brightnessRange[1],
          "--saturate-min": saturateRange[0],
          "--saturate-max": saturateRange[1],
          "--duration": `${adjustedDuration}s`,
          "--delay": `${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "breathing-animation",
        disabled && "breathing-disabled",
        isHovered && pauseOnHover && "breathing-paused"
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children}
    </motion.div>
  );
};
```

### 2. MagneticHover 组件（新增到 src/components/animation/）

#### 组件接口

```typescript
interface MagneticHoverProps {
  children: React.ReactNode;
  strength?: number; // 磁吸强度，0-1 之间，默认 0.15
  scaleOnHover?: number; // 悬停缩放，默认 1.03
  showHalo?: boolean; // 显示光晕效果，默认 true
  haloColor?: string; // 光晕颜色，默认根据主题
  rotationIntensity?: number; // 3D 旋转强度，默认 0.05
  className?: string;
  disabled?: boolean;
}
```

#### 实现策略（基于现有 Framer Motion）

```typescript
export const MagneticHover: React.FC<MagneticHoverProps> = ({
  children,
  strength = 0.15,
  scaleOnHover = 1.03,
  showHalo = true,
  rotationIntensity = 0.05,
  className = "",
  disabled = false,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || disabled) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setMousePosition({ x: deltaX, y: deltaY });
    },
    [strength, disabled]
  );

  return (
    <motion.div
      ref={ref}
      className={cn("magnetic-hover-container", className)}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isHovered ? scaleOnHover : 1,
        rotateX: mousePosition.y * rotationIntensity,
        rotateY: mousePosition.x * rotationIntensity,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
      {showHalo && isHovered && (
        <motion.div
          className="magnetic-halo"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.6,
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};
```

### 3. ParallaxItem 组件（新增到 src/components/animation/）

#### 组件接口

```typescript
interface ParallaxItemProps {
  children: React.ReactNode;
  layer?: number; // 视差层级，0-2
  intensity?: number; // 视差强度，默认 0.5
  className?: string;
}
```

#### 实现策略（基于现有 useScrollAnimation）

```typescript
export const ParallaxItem: React.FC<ParallaxItemProps> = ({
  children,
  layer = 0,
  intensity = 0.5,
  className = "",
}) => {
  const { scrollY } = useScroll();
  const ref = useRef<HTMLDivElement>(null);

  const y = useTransform(scrollY, (value) => {
    if (!ref.current) return 0;

    const rect = ref.current.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    const elementHeight = rect.height;
    const windowHeight = window.innerHeight;

    // 只对视口内或附近的元素应用视差
    if (rect.bottom < -100 || rect.top > windowHeight + 100) {
      return 0;
    }

    const speed = layer * 0.3 * intensity;
    return (value - elementTop + windowHeight) * speed;
  });

  return (
    <motion.div
      ref={ref}
      className={cn("parallax-item", className)}
      style={{
        y,
        zIndex: -layer, // 层级越高，z-index 越低
      }}
    >
      {children}
    </motion.div>
  );
};
```

## 现有组件增强

### 1. Gallery 页面增强（修改 src/app/(public)/gallery/page.tsx）

#### 在现有 Masonry 项目中添加特效

```typescript
// 在现有的 motion.div 中包装新组件
{
  images.map((image, i) => (
    <ParallaxItem key={image.key} layer={i % 3}>
      <MagneticHover strength={0.15} scaleOnHover={1.03} showHalo={true}>
        <BreathingAnimation
          duration={6}
          delay={i * 0.3}
          contentType="landscape"
        >
          <motion.div
            className="mb-2"
            onClick={() => handleImageClick(image.key)}
            onViewportEnter={() => preloadImage(image.key, image.url)}
          >
            {/* 现有的图片内容 */}
          </motion.div>
        </BreathingAnimation>
      </MagneticHover>
    </ParallaxItem>
  ));
}
```

### 2. FullscreenCarousel 增强（修改 src/components/feature/gallery/FullscreenCarousel.tsx）

#### 添加滚动查看详情功能

```typescript
export function EnhancedFullscreenCarousel({
  image,
  onClose,
}: FullscreenCarouselProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / windowHeight, 1);

      setScrollProgress(progress);
      setShowDetails(progress > 0.3);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {image && (
        <motion.div className="fixed inset-0 z-50 bg-black overflow-y-auto">
          {/* 图片区域 - 添加视差效果 */}
          <motion.div
            className="sticky top-0 h-screen flex items-center justify-center"
            style={{
              transform: `translateY(${scrollProgress * 50}px)`,
            }}
          >
            <Image
              src={image.url}
              alt={image.key ?? "fullscreen gallery image"}
              fill
              className="object-contain"
            />
          </motion.div>

          {/* 滚动指示器 */}
          <ScrollIndicator show={!showDetails} />

          {/* 详情面板 */}
          <motion.div
            className="relative z-10 bg-background min-h-screen p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: showDetails ? 1 : 0,
              y: showDetails ? 0 : 30,
            }}
          >
            <ImageDetails image={image} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 3. Blog 页面增强（修改 src/app/(public)/blog/BlogPageClient.tsx）

#### 为 BentoCard 添加特效

```typescript
// 在现有的 BentoCard 中包装新组件
{
  otherPosts.map((post, index) => (
    <BentoCard variants={cardVariants} key={post.slug} className="row-span-1">
      <MagneticHover
        strength={0.1} // Blog 卡片使用较小的磁吸强度
        scaleOnHover={1.02}
        showHalo={true}
      >
        <BreathingAnimation
          duration={7}
          delay={index * 0.4}
          contentType="article"
        >
          <PostCard post={post} />
        </BreathingAnimation>
      </MagneticHover>
    </BentoCard>
  ));
}
```

## 样式增强

### 新增 CSS 文件（src/styles/visual-effects.css）

```css
/* 呼吸动画样式 */
@keyframes gentle-breathe {
  0%,
  100% {
    transform: scale(var(--scale-min, 1));
    filter: brightness(var(--brightness-min, 1)) saturate(
        var(--saturate-min, 1)
      );
  }
  50% {
    transform: scale(var(--scale-max, 1.008));
    filter: brightness(var(--brightness-max, 1.02)) saturate(
        var(--saturate-max, 1.05)
      );
  }
}

.breathing-animation {
  animation: gentle-breathe var(--duration, 6s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
  will-change: transform, filter;
}

.breathing-animation.breathing-paused {
  animation-play-state: paused;
}

.breathing-animation.breathing-disabled {
  animation: none;
}

/* 磁吸悬停样式 */
.magnetic-hover-container {
  will-change: transform;
}

.magnetic-halo {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: radial-gradient(
    circle at center,
    rgba(var(--primary-rgb), 0.1) 0%,
    rgba(var(--primary-rgb), 0.05) 50%,
    transparent 100%
  );
  border-radius: 12px;
  pointer-events: none;
  z-index: -1;
}

/* 视差项目样式 */
.parallax-item {
  will-change: transform;
}

/* 响应用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .breathing-animation,
  .magnetic-hover-container,
  .parallax-item {
    animation: none !important;
    transform: none !important;
    transition: none !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .magnetic-halo {
    display: none;
  }

  .magnetic-hover-container:hover {
    outline: 2px solid currentColor;
  }
}
```

## 性能优化策略

### 基础优化原则

- 使用 `will-change` 属性优化动画性能
- 利用 CSS `transform` 和 `opacity` 避免重排
- 响应用户的 `prefers-reduced-motion` 设置
- 合理使用 Framer Motion 的优化特性

## 补充组件设计

### 4. ScrollIndicator 组件（新增到 src/components/animation/）

#### 组件接口

```typescript
interface ScrollIndicatorProps {
  show: boolean;
  text?: string;
  className?: string;
}
```

#### 实现设计

```typescript
export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  show,
  text = "向下滚动查看详情",
  className = "",
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            "fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20",
            "flex flex-col items-center text-white/80",
            className
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <motion.div
            className="mb-2"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown size={24} />
          </motion.div>
          <span className="text-sm font-medium">{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

### 5. ImageDetails 组件（新增到 src/components/feature/gallery/）

#### 组件接口

```typescript
interface ImageDetailsProps {
  image: R2Image;
}
```

#### 实现设计

```typescript
export const ImageDetails: React.FC<ImageDetailsProps> = ({ image }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 图片基本信息 */}
      <div className="bg-card rounded-lg p-6 border border-border/20">
        <h2 className="text-2xl font-bold mb-4">图片详情</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">文件名</p>
            <p className="font-medium">{image.key}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">上传时间</p>
            <p className="font-medium">
              {image.uploadedAt?.toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">尺寸</p>
            <p className="font-medium">
              {image.width} × {image.height}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">宽高比</p>
            <p className="font-medium">
              {(image.width / image.height).toFixed(2)}:1
            </p>
          </div>
        </div>
      </div>

      {/* 评分和互动区域 */}
      <div className="bg-card rounded-lg p-6 border border-border/20">
        <h3 className="text-xl font-semibold mb-4">评价这张图片</h3>
        <div className="flex items-center space-x-4 mb-4">
          <StarRating
            value={0}
            onChange={(rating) => console.log("Rating:", rating)}
            size="large"
          />
          <span className="text-sm text-muted-foreground">为这张图片评分</span>
        </div>

        {/* 评论区域 */}
        <div className="space-y-4">
          <h4 className="font-medium">评论</h4>
          <div className="space-y-3">
            {/* 评论列表占位 */}
            <p className="text-sm text-muted-foreground">
              暂无评论，成为第一个评论的人吧！
            </p>
          </div>

          {/* 添加评论 */}
          <div className="flex space-x-3">
            <Input placeholder="写下你的想法..." className="flex-1" />
            <Button>发表</Button>
          </div>
        </div>
      </div>

      {/* 相关图片推荐 */}
      <div className="bg-card rounded-lg p-6 border border-border/20">
        <h3 className="text-xl font-semibold mb-4">相关图片</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 相关图片缩略图占位 */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-lg flex items-center justify-center"
            >
              <span className="text-muted-foreground text-sm">相关图片</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

## 主题和样式配置

### CSS 变量扩展（添加到 src/styles/globals.css）

```css
:root {
  /* 现有变量... */

  /* 视觉特效相关变量 */
  --primary-rgb: 0, 112, 243; /* 用于光晕效果 */
  --secondary-rgb: 124, 58, 237;
  --accent-rgb: 236, 72, 153;

  /* 动画参数 */
  --breathing-duration-landscape: 8s;
  --breathing-duration-portrait: 5s;
  --breathing-duration-article: 7s;
  --breathing-duration-default: 6s;

  --magnetic-strength-gallery: 0.15;
  --magnetic-strength-blog: 0.1;
  --magnetic-strength-default: 0.12;

  --parallax-intensity: 0.5;
  --parallax-layers: 3;
}

/* 深色主题适配 */
[data-theme="dark"] {
  --primary-rgb: 59, 130, 246;
  --secondary-rgb: 147, 51, 234;
  --accent-rgb: 244, 63, 94;
}
```

## 移动端交互适配

### 触摸手势处理

```typescript
// 在 MagneticHover 组件中添加触摸支持
const handleTouchMove = useCallback((e: React.TouchEvent) => {
  if (!ref.current || disabled) return

  const touch = e.touches[0]
  const rect = ref.current.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const deltaX = (touch.clientX - centerX) * strength * 0.5 // 触摸时减少强度
  const deltaY = (touch.clientY - centerY) * strength * 0.5

  setMousePosition({ x: deltaX, y: deltaY })
}, [strength, disabled])

// 在组件返回中添加触摸事件
<motion.div
  ref={ref}
  className={cn('magnetic-hover-container', className)}
  onMouseMove={handleMouseMove}
  onTouchMove={handleTouchMove}
  onTouchStart={() => setIsHovered(true)}
  onTouchEnd={() => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
  }}
  // ... 其他属性
>
```

### 响应式动画参数

```css
/* 移动端动画优化 */
@media (max-width: 768px) {
  .breathing-animation {
    --duration: calc(var(--duration) * 1.2); /* 移动端稍慢的动画 */
  }

  .magnetic-hover-container {
    --strength: calc(var(--strength, 0.15) * 0.7); /* 减少移动端磁吸强度 */
  }

  .parallax-item {
    --intensity: calc(var(--intensity, 0.5) * 0.8); /* 减少移动端视差强度 */
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .magnetic-hover-container {
    --strength: calc(var(--strength, 0.15) * 0.5);
  }

  .magnetic-halo {
    opacity: 0.3; /* 触摸设备上减少光晕强度 */
  }
}
```

## 组件导出和使用

### 统一导出文件（src/components/animation/index.ts）

```typescript
// 现有导出...
export {
  ScrollReveal,
  ScrollRevealContainer,
  ScrollRevealItem,
} from "./ScrollReveal";
export { AnimatedDiv } from "./AnimatedDiv";
export { TypewriterText } from "./TypewriterText";

// 新增导出
export { BreathingAnimation } from "./BreathingAnimation";
export { MagneticHover } from "./MagneticHover";
export { ParallaxItem } from "./ParallaxItem";
export { ScrollIndicator } from "./ScrollIndicator";

// 类型导出
export type {
  BreathingAnimationProps,
  MagneticHoverProps,
  ParallaxItemProps,
  ScrollIndicatorProps,
} from "./types";
```

### 使用示例和最佳实践

```typescript
// Gallery 页面使用示例
import { BreathingAnimation, MagneticHover, ParallaxItem } from '@/components/animation'

// 组合使用的推荐顺序：ParallaxItem -> MagneticHover -> BreathingAnimation -> 内容
<ParallaxItem layer={index % 3}>
  <MagneticHover strength={0.15}>
    <BreathingAnimation contentType="landscape" delay={index * 0.3}>
      <div className="gallery-item">
        {/* 图片内容 */}
      </div>
    </BreathingAnimation>
  </MagneticHover>
</ParallaxItem>

// Blog 页面使用示例
<MagneticHover strength={0.1}>
  <BreathingAnimation contentType="article" delay={index * 0.4}>
    <article className="blog-card">
      {/* 文章内容 */}
    </article>
  </BreathingAnimation>
</MagneticHover>
```

## 实现优先级

### 第一阶段：核心组件

1. BreathingAnimation 组件
2. MagneticHover 组件
3. 基础 CSS 样式文件

### 第二阶段：视差和详情

1. ParallaxItem 组件
2. ScrollIndicator 组件
3. FullscreenCarousel 增强

### 第三阶段：详情和优化

1. ImageDetails 组件
2. 移动端适配优化
3. 主题变量配置
