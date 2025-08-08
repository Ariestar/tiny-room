"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    prefersReducedMotion,
    createResponsiveAnimationConfig,
    createThrottledAnimationTrigger
} from "@/lib/ui/animations";

export interface MouseFollowParticlesProps {
    /** 粒子数量 */
    particleCount?: number;
    /** 粒子颜色 */
    colors?: string[];
    /** 粒子大小范围 */
    sizeRange?: [number, number];
    /** 跟随强度 */
    followStrength?: number;
    /** 是否启用 */
    enabled?: boolean;
    /** 粒子生命周期 */
    lifetime?: number;
    className?: string;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    size: number;
    color: string;
    opacity: number;
    velocityX: number;
    velocityY: number;
    life: number;
    maxLife: number;
}

/**
 * 鼠标跟随粒子系统 - 性能优化版本
 * 创建跟随鼠标移动的粒子效果
 */
export function MouseFollowParticles({
    particleCount = 20,
    colors = ["hsl(var(--primary))", "hsl(var(--accent-blue))", "hsl(var(--accent-purple))"],
    sizeRange = [2, 6],
    followStrength = 0.05,
    enabled = true,
    lifetime = 60,
    className = "",
}: MouseFollowParticlesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();
    const [particles, setParticles] = useState<Particle[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMouseInside, setIsMouseInside] = useState(false);
    const isReducedMotion = prefersReducedMotion();

    // 根据性能调整粒子数量
    const optimizedParticleCount = Math.min(particleCount, 15);

    // 创建粒子
    const createParticle = useCallback((id: number, x: number, y: number): Particle => {
        return {
            id,
            x,
            y,
            targetX: x,
            targetY: y,
            size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 0.6 + Math.random() * 0.4,
            velocityX: 0,
            velocityY: 0,
            life: lifetime,
            maxLife: lifetime,
        };
    }, [colors, sizeRange, lifetime]);

    // 优化的鼠标移动处理 - 使用节流
    const throttledMouseMove = useCallback(
        createThrottledAnimationTrigger((e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        }, 16), // ~60fps
        []
    );

    // 初始化粒子
    useEffect(() => {
        if (!enabled) return;

        const initialParticles: Particle[] = [];
        for (let i = 0; i < optimizedParticleCount; i++) {
            initialParticles.push(createParticle(i, 0, 0));
        }
        setParticles(initialParticles);
    }, [enabled, optimizedParticleCount, createParticle]);

    // 鼠标事件处理 - 优化版本
    useEffect(() => {
        if (!enabled || !containerRef.current) return;

        const container = containerRef.current;

        const handleMouseEnter = () => setIsMouseInside(true);
        const handleMouseLeave = () => {
            setIsMouseInside(false);
            // 清理动画帧
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };

        container.addEventListener("mousemove", throttledMouseMove);
        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", throttledMouseMove);
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [enabled, throttledMouseMove]);

    // 粒子动画循环
    useEffect(() => {
        if (!enabled || !isMouseInside) return;

        const animate = () => {
            setParticles((prevParticles) => {
                return prevParticles.map((particle) => {
                    // 计算目标位置（鼠标位置附近的随机分布）
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 50;
                    const targetX = mousePosition.x + Math.cos(angle) * distance;
                    const targetY = mousePosition.y + Math.sin(angle) * distance;

                    // 计算速度（朝向目标位置）
                    const dx = targetX - particle.x;
                    const dy = targetY - particle.y;

                    const newVelocityX = particle.velocityX + dx * followStrength;
                    const newVelocityY = particle.velocityY + dy * followStrength;

                    // 应用阻尼
                    const damping = 0.95;
                    const finalVelocityX = newVelocityX * damping;
                    const finalVelocityY = newVelocityY * damping;

                    // 更新位置
                    const newX = particle.x + finalVelocityX;
                    const newY = particle.y + finalVelocityY;

                    // 更新生命周期
                    const newLife = particle.life - 1;
                    const lifeRatio = newLife / particle.maxLife;

                    return {
                        ...particle,
                        x: newX,
                        y: newY,
                        velocityX: finalVelocityX,
                        velocityY: finalVelocityY,
                        life: newLife > 0 ? newLife : particle.maxLife, // 重置生命周期
                        opacity: lifeRatio * (0.6 + Math.random() * 0.4),
                    };
                });
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [enabled, isMouseInside, mousePosition, followStrength]);

    if (!enabled || isReducedMotion) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
        >
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: particle.x - particle.size / 2,
                        top: particle.y - particle.size / 2,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        opacity: particle.opacity,
                        willChange: "transform, opacity"
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={createResponsiveAnimationConfig({
                        duration: 2,
                        ease: "easeInOut"
                    })}
                    onAnimationComplete={() => {
                        const element = document.querySelector(`[data-particle="${particle.id}"]`) as HTMLElement;
                        if (element) element.style.willChange = 'auto';
                    }}
                    data-particle={particle.id}
                />
            ))}
        </div>
    );
}

/**
 * 简化版鼠标跟随粒子
 * 性能更好的版本
 */
export function SimpleMouseParticles({
    particleCount = 10,
    className = "",
}: {
    particleCount?: number;
    className?: string;
}) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
            return () => container.removeEventListener("mousemove", handleMouseMove);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 pointer-events-none ${className}`}
        >
            {Array.from({ length: particleCount }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/30 rounded-full"
                    animate={{
                        x: mousePosition.x + Math.sin(i + Date.now() * 0.001) * 20,
                        y: mousePosition.y + Math.cos(i + Date.now() * 0.001) * 20,
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    );
}

// 默认导出
export default MouseFollowParticles;