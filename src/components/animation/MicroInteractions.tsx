"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/shared/utils";

export interface MicroInteractionProps {
    /** 交互类型 */
    type?: "hover-lift" | "hover-glow" | "hover-rotate" | "hover-scale" | "magnetic" | "tilt";
    /** 交互强度 */
    intensity?: "subtle" | "medium" | "strong";
    /** 是否启用 */
    enabled?: boolean;
    /** 自定义类名 */
    className?: string;
    children: React.ReactNode;
}

/**
 * 微交互组件
 * 为元素添加各种悬停和交互效果
 */
export function MicroInteraction({
    type = "hover-lift",
    intensity = "medium",
    enabled = true,
    className,
    children,
}: MicroInteractionProps) {
    if (!enabled) {
        return <div className={className}>{children}</div>;
    }

    switch (type) {
        case "hover-lift":
            return <HoverLift intensity={intensity} className={className}>{children}</HoverLift>;
        case "hover-glow":
            return <HoverGlow intensity={intensity} className={className}>{children}</HoverGlow>;
        case "hover-rotate":
            return <HoverRotate intensity={intensity} className={className}>{children}</HoverRotate>;
        case "hover-scale":
            return <HoverScale intensity={intensity} className={className}>{children}</HoverScale>;
        case "magnetic":
            return <MagneticEffect intensity={intensity} className={className}>{children}</MagneticEffect>;
        case "tilt":
            return <TiltEffect intensity={intensity} className={className}>{children}</TiltEffect>;
        default:
            return <HoverLift intensity={intensity} className={className}>{children}</HoverLift>;
    }
}

/**
 * 悬停上升效果
 */
function HoverLift({
    intensity,
    className,
    children
}: {
    intensity: string;
    className?: string;
    children: React.ReactNode;
}) {
    const liftValues = {
        subtle: { y: -2, shadow: "0 4px 12px rgba(0,0,0,0.1)" },
        medium: { y: -4, shadow: "0 8px 25px rgba(0,0,0,0.15)" },
        strong: { y: -8, shadow: "0 12px 40px rgba(0,0,0,0.2)" },
    };

    const config = liftValues[intensity as keyof typeof liftValues];

    return (
        <motion.div
            className={cn("cursor-pointer", className)}
            whileHover={{
                y: config.y,
                boxShadow: config.shadow,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    );
}

/**
 * 悬停发光效果
 */
function HoverGlow({
    intensity,
    className,
    children
}: {
    intensity: string;
    className?: string;
    children: React.ReactNode;
}) {
    const glowValues = {
        subtle: "0 0 20px rgba(var(--primary), 0.3)",
        medium: "0 0 30px rgba(var(--primary), 0.5)",
        strong: "0 0 40px rgba(var(--primary), 0.7)",
    };

    const glow = glowValues[intensity as keyof typeof glowValues];

    return (
        <motion.div
            className={cn("cursor-pointer", className)}
            whileHover={{
                boxShadow: glow,
            }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
}

/**
 * 悬停旋转效果
 */
function HoverRotate({
    intensity,
    className,
    children
}: {
    intensity: string;
    className?: string;
    children: React.ReactNode;
}) {
    const rotateValues = {
        subtle: 5,
        medium: 10,
        strong: 15,
    };

    const rotation = rotateValues[intensity as keyof typeof rotateValues];

    return (
        <motion.div
            className={cn("cursor-pointer", className)}
            whileHover={{
                rotate: rotation,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    );
}

/**
 * 悬停缩放效果
 */
function HoverScale({
    intensity,
    className,
    children
}: {
    intensity: string;
    className?: string;
    children: React.ReactNode;
}) {
    const scaleValues = {
        subtle: 1.02,
        medium: 1.05,
        strong: 1.1,
    };

    const scale = scaleValues[intensity as keyof typeof scaleValues];

    return (
        <motion.div
            className={cn("cursor-pointer", className)}
            whileHover={{
                scale,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    );
}

/**
 * 磁性效果
 */
function MagneticEffect({
    intensity,
    className,
    children
}: {
    intensity: string;
    className?: string;
    children: React.ReactNode;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 300, damping: 20 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const strengthValues = {
        subtle: 0.1,
        medium: 0.2,
        strong: 0.3,
    };

    const strength = strengthValues[intensity as keyof typeof strengthValues];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        x.set(deltaX);
        y.set(deltaY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            className={cn("cursor-pointer", className)}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    );
}

/**
 * 倾斜效果
 */
function TiltEffect({
    intensity,
    className,
    children
}: {
    intensity: string;
    className?: string;
    children: React.ReactNode;
}) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const tiltValues = {
        subtle: 5,
        medium: 10,
        strong: 15,
    };

    const maxTilt = tiltValues[intensity as keyof typeof tiltValues];

    const rotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        x.set(deltaX);
        y.set(deltaY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            className={cn("cursor-pointer", className)}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {children}
        </motion.div>
    );
}

/**
 * 组合微交互效果
 */
export function CombinedMicroInteraction({
    effects = ["hover-lift", "hover-glow"],
    intensity = "medium",
    className,
    children,
}: {
    effects?: Array<"hover-lift" | "hover-glow" | "hover-rotate" | "hover-scale">;
    intensity?: "subtle" | "medium" | "strong";
    className?: string;
    children: React.ReactNode;
}) {
    let wrappedChildren = children;

    // 从内到外包装效果
    effects.reverse().forEach((effect) => {
        wrappedChildren = (
            <MicroInteraction type={effect} intensity={intensity}>
                {wrappedChildren}
            </MicroInteraction>
        );
    });

    return <div className={className}>{wrappedChildren}</div>;
}

/**
 * 按钮微交互预设
 */
export function InteractiveButton({
    variant = "primary",
    size = "md",
    className,
    children,
    onClick,
    disabled,
    type = "button",
    ...htmlProps
}: {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    className?: string;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'disabled' | 'type' | 'className'>) {
    const variantStyles = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-primary hover:bg-primary/10",
    };

    const sizeStyles = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <MicroInteraction type="hover-lift" intensity="medium">
            <motion.button
                className={cn(
                    "rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                disabled={disabled}
                type={type}
                {...htmlProps}
            >
                {children}
            </motion.button>
        </MicroInteraction>
    );
}