"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
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
 */
export function MagneticHover({
    children,
    strength = 0.15,
    scaleOnHover = 1.03,
    showHalo = false,
    haloColor,
    rotationIntensity = 0.05,
    className = "",
    disabled = false,
}: MagneticHoverProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [elementRect, setElementRect] = useState<DOMRect | null>(null);
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
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

    // 创建 Portal 容器（仅用于光晕效果）
    useEffect(() => {
        if (typeof window !== "undefined") {
            let container = document.getElementById("magnetic-hover-portal");
            if (!container) {
                container = document.createElement("div");
                container.id = "magnetic-hover-portal";
                container.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 200;
                `;
                document.body.appendChild(container);
            }
            setPortalContainer(container);
        }
    }, []);

    // 鼠标移动处理
    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!ref.current || disabled || prefersReducedMotion) return;

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

    // 悬停开始
    const handleHoverStart = useCallback(() => {
        if (!disabled && !prefersReducedMotion && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setElementRect(rect);
            setIsHovered(true);
        }
    }, [disabled, prefersReducedMotion]);

    // 悬停结束
    const handleHoverEnd = useCallback(() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
        setElementRect(null);
    }, []);

    // 如果禁用或用户偏好减少动画，则不应用效果
    const shouldAnimate = !disabled && !prefersReducedMotion;

    return (
        <>
            {/* 主要元素，始终保持在原位 */}
            <motion.div
                ref={ref}
                className={cn("magnetic-hover-container", className)}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
                animate={
                    shouldAnimate && isHovered
                        ? {
                            x: mousePosition.x,
                            y: mousePosition.y,
                            scale: scaleOnHover,
                            rotateX: mousePosition.y * rotationIntensity,
                            rotateY: mousePosition.x * rotationIntensity,
                        }
                        : {
                            x: 0,
                            y: 0,
                            scale: 1,
                            rotateX: 0,
                            rotateY: 0,
                        }
                }
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
                style={{
                    transformStyle: "preserve-3d",
                    zIndex: isHovered ? 9999 : 1,
                    position: "relative",
                }}
            >
                {children}
            </motion.div>

            {/* 光晕效果使用 Portal，但不移动主要内容 */}
            {showHalo && isHovered && shouldAnimate && portalContainer && elementRect && createPortal(
                <motion.div
                    className="magnetic-halo"
                    style={{
                        position: "fixed",
                        top: elementRect.top,
                        left: elementRect.left,
                        width: elementRect.width,
                        height: elementRect.height,
                        pointerEvents: "none",
                        zIndex: 9997, // 低于主要元素
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
                />,
                portalContainer
            )}
        </>
    );
}