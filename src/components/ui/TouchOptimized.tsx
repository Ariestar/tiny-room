"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

interface TouchOptimizedProps {
    children: ReactNode;
    className?: string;
    onTap?: () => void;
    onLongPress?: () => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    hapticFeedback?: boolean;
    rippleEffect?: boolean;
    longPressDelay?: number;
    swipeThreshold?: number;
    disabled?: boolean;
}

interface TouchPoint {
    x: number;
    y: number;
    timestamp: number;
}

export function TouchOptimized({
    children,
    className = "",
    onTap,
    onLongPress,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    hapticFeedback = true,
    rippleEffect = true,
    longPressDelay = 500,
    swipeThreshold = 50,
    disabled = false,
}: TouchOptimizedProps) {
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const elementRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<TouchPoint | null>(null);
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const rippleIdRef = useRef(0);

    // 触觉反馈
    const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
        if (!hapticFeedback || disabled) return;

        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30],
            };
            navigator.vibrate(patterns[type]);
        }
    };

    // 添加涟漪效果
    const addRipple = (x: number, y: number) => {
        if (!rippleEffect || disabled) return;

        const rect = elementRef.current?.getBoundingClientRect();
        if (!rect) return;

        const rippleX = x - rect.left;
        const rippleY = y - rect.top;
        const rippleId = rippleIdRef.current++;

        setRipples(prev => [...prev, { id: rippleId, x: rippleX, y: rippleY }]);

        // 移除涟漪效果
        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== rippleId));
        }, 600);
    };

    // 清除长按定时器
    const clearLongPressTimer = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    // 处理触摸开始
    const handleTouchStart = (e: React.TouchEvent) => {
        if (disabled) return;

        const touch = e.touches[0];
        touchStartRef.current = {
            x: touch.clientX,
            y: touch.clientY,
            timestamp: Date.now(),
        };

        setIsPressed(true);
        triggerHapticFeedback('light');
        addRipple(touch.clientX, touch.clientY);

        // 设置长按定时器
        if (onLongPress) {
            longPressTimerRef.current = setTimeout(() => {
                triggerHapticFeedback('medium');
                onLongPress();
                setIsPressed(false);
            }, longPressDelay);
        }
    };

    // 处理触摸移动
    const handleTouchMove = (e: React.TouchEvent) => {
        if (disabled || !touchStartRef.current) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // 如果移动距离超过阈值，取消长按
        if (distance > 10) {
            clearLongPressTimer();
        }
    };

    // 处理触摸结束
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (disabled || !touchStartRef.current) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        const deltaTime = Date.now() - touchStartRef.current.timestamp;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        setIsPressed(false);
        clearLongPressTimer();

        // 判断是否为滑动手势
        if (distance > swipeThreshold && deltaTime < 300) {
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (absX > absY) {
                // 水平滑动
                if (deltaX > 0 && onSwipeRight) {
                    triggerHapticFeedback('medium');
                    onSwipeRight();
                } else if (deltaX < 0 && onSwipeLeft) {
                    triggerHapticFeedback('medium');
                    onSwipeLeft();
                }
            } else {
                // 垂直滑动
                if (deltaY > 0 && onSwipeDown) {
                    triggerHapticFeedback('medium');
                    onSwipeDown();
                } else if (deltaY < 0 && onSwipeUp) {
                    triggerHapticFeedback('medium');
                    onSwipeUp();
                }
            }
        } else if (distance < 10 && deltaTime < 300 && onTap) {
            // 点击手势
            triggerHapticFeedback('light');
            onTap();
        }

        touchStartRef.current = null;
    };

    // 处理鼠标事件（桌面端兼容）
    const handleMouseDown = (e: React.MouseEvent) => {
        if (disabled) return;
        setIsPressed(true);
        addRipple(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        if (disabled) return;
        setIsPressed(false);
        if (onTap) onTap();
    };

    const handleMouseLeave = () => {
        setIsPressed(false);
        clearLongPressTimer();
    };

    // 清理定时器
    useEffect(() => {
        return () => {
            clearLongPressTimer();
        };
    }, []);

    return (
        <motion.div
            ref={elementRef}
            className={`relative overflow-hidden select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            animate={{
                scale: isPressed ? 0.95 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
            }}
            style={{
                WebkitTapHighlightColor: 'transparent', // 移除默认的点击高亮
                WebkitTouchCallout: 'none', // 禁用长按菜单
                WebkitUserSelect: 'none',
                userSelect: 'none',
            }}
        >
            {children}

            {/* 涟漪效果 */}
            {ripples.map((ripple) => (
                <motion.div
                    key={ripple.id}
                    className="absolute pointer-events-none bg-white/30 rounded-full"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                    }}
                    initial={{
                        width: 0,
                        height: 0,
                        x: 0,
                        y: 0,
                        opacity: 0.6,
                    }}
                    animate={{
                        width: 200,
                        height: 200,
                        x: -100,
                        y: -100,
                        opacity: 0,
                    }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut",
                    }}
                />
            ))}
        </motion.div>
    );
}

// 预设的触控优化组件
export function TouchButton({
    children,
    onClick,
    className = "",
    variant = "default",
    size = "md",
    disabled = false,
}: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "default" | "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg";

    const variantStyles = {
        default: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
        ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    };

    const sizeStyles = {
        sm: "px-3 py-2 text-sm min-h-[36px]", // 确保最小触控目标
        md: "px-4 py-2.5 text-base min-h-[44px]",
        lg: "px-6 py-3 text-lg min-h-[48px]",
    };

    return (
        <TouchOptimized
            onTap={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled}
            hapticFeedback={true}
            rippleEffect={true}
        >
            {children}
        </TouchOptimized>
    );
}

export function TouchCard({
    children,
    onTap,
    onSwipeLeft,
    onSwipeRight,
    className = "",
}: {
    children: ReactNode;
    onTap?: () => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    className?: string;
}) {
    return (
        <TouchOptimized
            onTap={onTap}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
            className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow ${className}`}
            hapticFeedback={true}
            rippleEffect={true}
        >
            {children}
        </TouchOptimized>
    );
}