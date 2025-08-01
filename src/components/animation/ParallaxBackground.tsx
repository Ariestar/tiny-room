"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

// 定义装饰元素的属性类型
interface DecoElement {
    id: number;
    top: string;
    left: string;
    size: number;
    gradient: string;
    blur: string;
    parallaxDepth: number; // Store depth instead of the motion value itself
    rotationSpeed: number; // Store speed instead of the motion value itself
}

interface ParallaxBackgroundProps {
    scrollYProgress: MotionValue<number>;
    elementCount?: number;
    disabled?: boolean;
    isMobile?: boolean;
    className?: string;
}

const gradients = [
    "from-blue-400/10 to-purple-400/10",
    "from-pink-400/10 to-rose-400/10",
    "from-cyan-400/10 to-blue-400/10",
    "from-green-400/10 to-teal-400/10",
    "from-orange-400/10 to-yellow-400/10",
    "from-rose-400/10 to-red-400/10",
    "from-indigo-400/10 to-violet-400/10",
];

const blurs = ["blur-lg", "blur-xl", "blur-2xl"];

/**
 * 通用的、随机化的视差背景组件
 */
export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
    scrollYProgress,
    elementCount = 8, // 默认生成8个元素
    disabled = false,
    isMobile = false,
    className,
}) => {
    const [elements, setElements] = useState<DecoElement[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Generate the random properties once and memoize them
    const randomProperties = useMemo(() => {
        if (!isMounted || disabled || isMobile) return [];

        const newElements: Omit<DecoElement, 'id'>[] = [];
        for (let i = 0; i < elementCount; i++) {
            newElements.push({
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
                size: Math.random() * 200 + 50, // 50px to 250px
                gradient: gradients[Math.floor(Math.random() * gradients.length)],
                blur: blurs[Math.floor(Math.random() * blurs.length)],
                parallaxDepth: Math.random() * 100 + 20, // 20% to 120%
                rotationSpeed: Math.random() * 180 - 90, // -90 to 90 degrees
            });
        }
        return newElements.map((el, i) => ({ ...el, id: i }));
    }, [isMounted, elementCount, disabled, isMobile]);

    if (disabled || isMobile) {
        return null;
    }

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {randomProperties.map(el => (
                <ParallaxElement
                    key={el.id}
                    scrollYProgress={scrollYProgress}
                    {...el}
                />
            ))}
        </div>
    );
};


// Create a sub-component where hooks can be called at the top level
const ParallaxElement: React.FC<DecoElement & { scrollYProgress: MotionValue<number> }> = ({
    scrollYProgress,
    top,
    left,
    size,
    gradient,
    blur,
    parallaxDepth,
    rotationSpeed
}) => {
    // Hooks are now called at the top level of this component
    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${parallaxDepth}%`]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, rotationSpeed]);

    return (
        <motion.div
            className={`absolute rounded-full ${gradient} ${blur}`}
            style={{
                top: top,
                left: left,
                width: `${size}px`,
                height: `${size}px`,
                y,
                rotate,
            }}
        />
    );
};
