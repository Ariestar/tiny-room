"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/shared/utils";


interface ParallaxItemProps {
    children: ReactNode;
    layer?: number; // 视差层级，0-2
    intensity?: number; // 视差强度，默认 0.5
    className?: string;
    disabled?: boolean;
}

/**
 * 视差滚动组件
 * 基于滚动位置为元素添加视差效果，不同层级有不同的移动速度
 */
export function ParallaxItem({
    children,
    layer = 0,
    intensity = 0.5,
    className = "",
    disabled = false,
}: ParallaxItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [isInViewport, setIsInViewport] = useState(false);

    // 检测用户的动画偏好设置
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // 视口检测优化性能
    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                // 扩大检测范围，提前开始视差效果
                setIsInViewport(entry.isIntersecting);
            },
            {
                rootMargin: "100px 0px 100px 0px", // 提前100px开始检测
                threshold: 0,
            }
        );

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    const { scrollY } = useScroll();

    // 计算视差偏移
    const y = useTransform(scrollY, (value) => {
        if (!ref.current || !isInViewport || disabled || prefersReducedMotion) {
            return 0;
        }

        const rect = ref.current.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // 只对视口内或附近的元素应用视差
        if (rect.bottom < -100 || rect.top > windowHeight + 100) {
            return 0;
        }

        // 计算视差速度
        // layer 0: 正常速度 (无视差)
        // layer 1: 稍慢速度 (轻微视差)
        // layer 2: 最慢速度 (明显视差)
        const speed = layer * 0.3 * intensity;

        // 基于元素在视口中的位置计算偏移
        const progress = (value - elementTop + windowHeight) / (windowHeight + elementHeight);
        const clampedProgress = Math.max(0, Math.min(1, progress));

        return (clampedProgress - 0.5) * speed * 100;
    });

    // 如果禁用或用户偏好减少动画，则不应用视差效果
    const shouldAnimate = !disabled && !prefersReducedMotion && isInViewport;

    return (
        <motion.div
            ref={ref}
            className={cn("parallax-item", className)}
            style={{
                y: shouldAnimate ? y : 0,
                // 移除负 z-index，改用 transform 的 translateZ 来创建深度感
                willChange: shouldAnimate ? "transform" : "auto",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}

/**
 * 多层视差容器组件
 * 为子元素自动分配不同的视差层级
 */
export function ParallaxContainer({
    children,
    intensity = 0.5,
    className = "",
    disabled = false,
}: {
    children: ReactNode;
    intensity?: number;
    className?: string;
    disabled?: boolean;
}) {
    return (
        <div className={cn("parallax-container relative", className)}>
            {Array.isArray(children)
                ? children.map((child, index) => (
                    <ParallaxItem
                        key={index}
                        layer={index % 3} // 循环分配 0, 1, 2 层级
                        intensity={intensity}
                        disabled={disabled}
                    >
                        {child}
                    </ParallaxItem>
                ))
                : children}
        </div>
    );
}