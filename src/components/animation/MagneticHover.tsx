"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/shared/utils";


interface MagneticHoverProps {
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
 * 磁吸悬停组件
 * 鼠标接近时产生轻微的"吸引"效果，包含 3D 变换和光晕效果
 */
export function MagneticHover({
    children,
    strength = 0.15,
    scaleOnHover = 1.03,
    showHalo = true,
    haloColor,
    rotationIntensity = 0.05,
    className = "",
    disabled = false,
}: MagneticHoverProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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

    // 鼠标移动处理
    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!ref.current || disabled || prefersReducedMotion) return;

            // 阻止事件冒泡，确保每个元素独立处理
            e.stopPropagation();

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * strength;
            const deltaY = (e.clientY - centerY) * strength;

            setMousePosition({ x: deltaX, y: deltaY });
        },
        [strength, disabled, prefersReducedMotion]
    );

    // 触摸移动处理（移动端支持）
    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (!ref.current || disabled || prefersReducedMotion) return;

            // 阻止事件冒泡
            e.stopPropagation();

            const touch = e.touches[0];
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // 触摸时减少强度
            const deltaX = (touch.clientX - centerX) * strength * 0.5;
            const deltaY = (touch.clientY - centerY) * strength * 0.5;

            setMousePosition({ x: deltaX, y: deltaY });
        },
        [strength, disabled, prefersReducedMotion]
    );

    // 悬停开始
    const handleHoverStart = () => {
        if (!disabled && !prefersReducedMotion) {
            setIsHovered(true);
        }
    };

    // 悬停结束
    const handleHoverEnd = () => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
    };

    // 触摸开始
    const handleTouchStart = () => {
        if (!disabled && !prefersReducedMotion) {
            setIsHovered(true);
        }
    };

    // 触摸结束
    const handleTouchEnd = () => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
    };

    // 如果禁用或用户偏好减少动画，则不应用效果
    const shouldAnimate = !disabled && !prefersReducedMotion;

    return (
        <motion.div
            ref={ref}
            className={cn("magnetic-hover-container", className)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            animate={
                shouldAnimate
                    ? {
                        x: mousePosition.x,
                        y: mousePosition.y,
                        scale: isHovered ? scaleOnHover : 1,
                        rotateX: mousePosition.y * rotationIntensity,
                        rotateY: mousePosition.x * rotationIntensity,
                    }
                    : {}
            }
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
            style={{
                transformStyle: "preserve-3d",
                zIndex: isHovered ? 9999 : 1, // 悬停时提升到最高层级
                position: isHovered ? "relative" : "static",
                isolation: isHovered ? "isolate" : "auto", // 创建新的层叠上下文
            }}
        >
            {children}

            {/* 光晕效果 */}
            <AnimatePresence>
                {showHalo && isHovered && shouldAnimate && (
                    <motion.div
                        className="magnetic-halo absolute inset-0 pointer-events-none -z-10"
                        style={{
                            background: haloColor
                                ? `radial-gradient(circle at center, ${haloColor}10 0%, ${haloColor}05 50%, transparent 100%)`
                                : `radial-gradient(
                    circle at center,
                    rgba(var(--primary-rgb, 0, 112, 243), 0.1) 0%,
                    rgba(var(--primary-rgb, 0, 112, 243), 0.05) 50%,
                    transparent 100%
                  )`,
                            borderRadius: "12px",
                            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 0.6,
                            scale: 1.2,
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut",
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}