"use client";

import { forwardRef, ReactNode, ButtonHTMLAttributes, HTMLAttributes } from "react";
import { motion, MotionProps } from "framer-motion";
import { useResponsive, useTouch, useOrientation } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

// 移动端优化按钮
interface MobileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    touchOptimized?: boolean;
    hapticFeedback?: boolean;
}

export const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
    ({
        children,
        variant = 'primary',
        size = 'md',
        fullWidth = false,
        touchOptimized = true,
        hapticFeedback = true,
        className,
        onClick,
        ...props
    }, ref) => {
        const { isMobile } = useResponsive();
        const isTouch = useTouch();

        // 触觉反馈
        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (hapticFeedback && 'vibrate' in navigator && isTouch) {
                navigator.vibrate(10); // 轻微震动反馈
            }
            onClick?.(e);
        };

        // 基础样式
        const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95";

        // 变体样式
        const variantStyles = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 active:bg-gray-300",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200",
            outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 active:bg-gray-100"
        };

        // 尺寸样式（移动端优化）
        const sizeStyles = {
            sm: touchOptimized && (isMobile || isTouch) ? "px-4 py-3 text-sm min-h-[44px]" : "px-3 py-2 text-sm",
            md: touchOptimized && (isMobile || isTouch) ? "px-6 py-4 text-base min-h-[48px]" : "px-4 py-2 text-base",
            lg: touchOptimized && (isMobile || isTouch) ? "px-8 py-5 text-lg min-h-[52px]" : "px-6 py-3 text-lg",
            xl: touchOptimized && (isMobile || isTouch) ? "px-10 py-6 text-xl min-h-[56px]" : "px-8 py-4 text-xl"
        };

        // 宽度样式
        const widthStyles = fullWidth ? "w-full" : "";

        // 触控优化样式
        const touchStyles = touchOptimized && (isMobile || isTouch)
            ? "touch-manipulation select-none"
            : "";

        return (
            <motion.button
                ref={ref}
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    widthStyles,
                    touchStyles,
                    className
                )}
                onClick={handleClick}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

MobileButton.displayName = 'MobileButton';

// 移动端优化输入框
interface MobileInputProps extends HTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    touchOptimized?: boolean;
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
    ({
        label,
        error,
        fullWidth = false,
        touchOptimized = true,
        className,
        ...props
    }, ref) => {
        const { isMobile } = useResponsive();
        const isTouch = useTouch();

        // 基础样式
        const baseStyles = "w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

        // 触控优化样式
        const touchStyles = touchOptimized && (isMobile || isTouch)
            ? "min-h-[48px] text-base" // 防止iOS缩放
            : "min-h-[40px] text-sm";

        // 错误样式
        const errorStyles = error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300";

        return (
            <div className={fullWidth ? "w-full" : ""}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        baseStyles,
                        touchStyles,
                        errorStyles,
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

MobileInput.displayName = 'MobileInput';

// 移动端优化卡片
interface MobileCardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    interactive?: boolean;
    touchOptimized?: boolean;
    padding?: 'sm' | 'md' | 'lg';
}

export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
    ({
        children,
        interactive = false,
        touchOptimized = true,
        padding = 'md',
        className,
        ...props
    }, ref) => {
        const { isMobile } = useResponsive();
        const isTouch = useTouch();

        // 基础样式
        const baseStyles = "bg-white rounded-2xl shadow-sm border border-gray-200";

        // 交互样式
        const interactiveStyles = interactive
            ? "cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            : "";

        // 内边距样式（移动端优化）
        const paddingStyles = {
            sm: touchOptimized && (isMobile || isTouch) ? "p-4" : "p-3",
            md: touchOptimized && (isMobile || isTouch) ? "p-6" : "p-4",
            lg: touchOptimized && (isMobile || isTouch) ? "p-8" : "p-6"
        };

        // 触控优化样式
        const touchStyles = touchOptimized && interactive && (isMobile || isTouch)
            ? "touch-manipulation"
            : "";

        return (
            <motion.div
                ref={ref}
                className={cn(
                    baseStyles,
                    interactiveStyles,
                    paddingStyles[padding],
                    touchStyles,
                    className
                )}
                whileTap={interactive ? { scale: 0.98 } : undefined}
                transition={{ duration: 0.1 }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

MobileCard.displayName = 'MobileCard';

// 移动端导航栏
interface MobileNavProps {
    children: ReactNode;
    fixed?: boolean;
    transparent?: boolean;
    className?: string;
}

export const MobileNav = ({
    children,
    fixed = true,
    transparent = false,
    className
}: MobileNavProps) => {
    const { isMobile } = useResponsive();
    const orientation = useOrientation();

    // 基础样式
    const baseStyles = "w-full z-50 transition-all duration-200";

    // 固定定位样式
    const fixedStyles = fixed ? "fixed top-0 left-0 right-0" : "";

    // 背景样式
    const backgroundStyles = transparent
        ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50"
        : "bg-white border-b border-gray-200";

    // 移动端特定样式
    const mobileStyles = isMobile
        ? "px-4 py-3 min-h-[60px]"
        : "px-6 py-4";

    // 安全区域样式
    const safeAreaStyles = isMobile && fixed
        ? "pt-safe-top"
        : "";

    return (
        <nav className={cn(
            baseStyles,
            fixedStyles,
            backgroundStyles,
            mobileStyles,
            safeAreaStyles,
            className
        )}>
            <div className="flex items-center justify-between h-full">
                {children}
            </div>
        </nav>
    );
};

// 移动端底部导航
interface MobileBottomNavProps {
    children: ReactNode;
    className?: string;
}

export const MobileBottomNav = ({ children, className }: MobileBottomNavProps) => {
    const { isMobile } = useResponsive();

    if (!isMobile) return null;

    return (
        <nav className={cn(
            "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 pb-safe-bottom z-50",
            className
        )}>
            <div className="flex items-center justify-around h-16">
                {children}
            </div>
        </nav>
    );
};

// 移动端抽屉组件
interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    position?: 'left' | 'right' | 'bottom';
    className?: string;
}

export const MobileDrawer = ({
    isOpen,
    onClose,
    children,
    position = 'left',
    className
}: MobileDrawerProps) => {
    const { isMobile } = useResponsive();

    // 位置样式
    const positionStyles = {
        left: "left-0 top-0 h-full w-80 max-w-[80vw]",
        right: "right-0 top-0 h-full w-80 max-w-[80vw]",
        bottom: "bottom-0 left-0 right-0 h-auto max-h-[80vh]"
    };

    // 动画变体
    const variants = {
        left: {
            closed: { x: '-100%' },
            open: { x: 0 }
        },
        right: {
            closed: { x: '100%' },
            open: { x: 0 }
        },
        bottom: {
            closed: { y: '100%' },
            open: { y: 0 }
        }
    };

    if (!isMobile) return null;

    return (
        <>
            {/* 背景遮罩 */}
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
            )}

            {/* 抽屉内容 */}
            <motion.div
                className={cn(
                    "fixed bg-white shadow-xl z-50",
                    positionStyles[position],
                    position === 'bottom' ? "rounded-t-2xl" : "",
                    className
                )}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={variants[position]}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
                <div className="h-full overflow-y-auto">
                    {children}
                </div>
            </motion.div>
        </>
    );
};

// 移动端手势处理组件
interface MobileGestureProps extends MotionProps {
    children: ReactNode;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    swipeThreshold?: number;
    className?: string;
}

export const MobileGesture = ({
    children,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    swipeThreshold = 50,
    className,
    ...props
}: MobileGestureProps) => {
    const isTouch = useTouch();

    if (!isTouch) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
                const { offset } = info;

                if (Math.abs(offset.x) > Math.abs(offset.y)) {
                    // 水平滑动
                    if (offset.x > swipeThreshold && onSwipeRight) {
                        onSwipeRight();
                    } else if (offset.x < -swipeThreshold && onSwipeLeft) {
                        onSwipeLeft();
                    }
                } else {
                    // 垂直滑动
                    if (offset.y > swipeThreshold && onSwipeDown) {
                        onSwipeDown();
                    } else if (offset.y < -swipeThreshold && onSwipeUp) {
                        onSwipeUp();
                    }
                }
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};