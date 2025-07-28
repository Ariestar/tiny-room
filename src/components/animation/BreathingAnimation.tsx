"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/shared/utils";


interface BreathingAnimationProps {
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
 * 呼吸动画组件
 * 为元素添加轻微的缩放和亮度/饱和度变化，模拟自然呼吸效果
 */
export function BreathingAnimation({
    children,
    duration = 6,
    scaleRange = [1, 1.008],
    brightnessRange = [1, 1.02],
    saturateRange = [1, 1.05],
    delay = 0,
    pauseOnHover = true,
    contentType = "default",
    disabled = false,
    className = "",
}: BreathingAnimationProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

    // 如果禁用动画或用户偏好减少动画，则不应用动画效果
    const shouldAnimate = !disabled && !prefersReducedMotion;

    // 动画变体
    const breathingVariants = {
        initial: {
            scale: scaleRange[0],
            filter: `brightness(${brightnessRange[0]}) saturate(${saturateRange[0]})`,
        },
        animate: shouldAnimate
            ? {
                scale: [scaleRange[0], scaleRange[1], scaleRange[0]],
                filter: [
                    `brightness(${brightnessRange[0]}) saturate(${saturateRange[0]})`,
                    `brightness(${brightnessRange[1]}) saturate(${saturateRange[1]})`,
                    `brightness(${brightnessRange[0]}) saturate(${saturateRange[0]})`,
                ],
            }
            : {
                scale: scaleRange[0],
                filter: `brightness(${brightnessRange[0]}) saturate(${saturateRange[0]})`,
            },
    };

    // 动画配置
    const animationTransition = shouldAnimate
        ? {
            duration: adjustedDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
            times: [0, 0.5, 1], // 关键帧时间点
        }
        : {};

    return (
        <motion.div
            className={cn("breathing-animation", className)}
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
            variants={breathingVariants}
            initial="initial"
            animate={isHovered && pauseOnHover ? "initial" : "animate"}
            transition={animationTransition}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {children}
        </motion.div>
    );
}