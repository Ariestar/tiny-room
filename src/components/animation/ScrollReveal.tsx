"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useInView, scrollAnimationVariants } from "@/hooks/useInView";

interface ScrollRevealProps {
    children: ReactNode;
    animation?: keyof typeof scrollAnimationVariants;
    delay?: number;
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    className?: string;
}

/**
 * 滚动触发动画组件
 * 当元素进入视窗时触发动画效果
 */
export function ScrollReveal({
    children,
    animation = "fadeInUp",
    delay = 0,
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    triggerOnce = true,
    className = ""
}: ScrollRevealProps) {
    const { ref, isInView } = useInView({
        threshold,
        rootMargin,
        triggerOnce,
        delay
    });

    const variants = scrollAnimationVariants[animation];

    return (
        <motion.div
            ref={ref as any}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * 容器动画组件
 * 用于子元素的错开动画效果
 */
export function ScrollRevealContainer({
    children,
    delay = 0,
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    triggerOnce = true,
    className = "",
    staggerChildren = 0.1,
    delayChildren = 0
}: {
    children: ReactNode;
    delay?: number;
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    className?: string;
    staggerChildren?: number;
    delayChildren?: number;
}) {
    const { ref, isInView } = useInView({
        threshold,
        rootMargin,
        triggerOnce,
        delay
    });

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren,
                delayChildren
            }
        }
    };

    return (
        <motion.div
            ref={ref as any}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * 滚动触发的子元素组件
 * 配合 ScrollRevealContainer 使用
 */
export function ScrollRevealItem({
    children,
    className = ""
}: {
    children: ReactNode;
    className?: string;
}) {
    const itemVariants = scrollAnimationVariants.item;

    return (
        <motion.div
            variants={itemVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * 数字计数动画组件
 */
export function ScrollRevealCounter({
    from = 0,
    to,
    duration = 2,
    delay = 0,
    threshold = 0.3,
    className = "",
    suffix = "",
    prefix = ""
}: {
    from?: number;
    to: number;
    duration?: number;
    delay?: number;
    threshold?: number;
    className?: string;
    suffix?: string;
    prefix?: string;
}) {
    const { ref, isInView } = useInView({
        threshold,
        triggerOnce: true,
        delay
    });

    return (
        <motion.span
            ref={ref as any}
            className={className}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {prefix}
            <motion.span
                initial={{ textContent: from }}
                animate={isInView ? { textContent: to } : { textContent: from }}
                transition={{
                    duration,
                    ease: "easeOut",
                    delay: 0.2
                }}
                onUpdate={(latest: any) => {
                    if (ref.current) {
                        const value = Math.round(latest.textContent);
                        ref.current.textContent = `${prefix}${value}${suffix}`;
                    }
                }}
            />
            {suffix}
        </motion.span>
    );
}

/**
 * 打字机效果组件
 */
export function ScrollRevealTypewriter({
    text,
    delay = 0,
    speed = 0.05,
    threshold = 0.3,
    className = "",
    cursor = true
}: {
    text: string;
    delay?: number;
    speed?: number;
    threshold?: number;
    className?: string;
    cursor?: boolean;
}) {
    const { ref, isInView } = useInView({
        threshold,
        triggerOnce: true,
        delay
    });

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: speed,
                delayChildren: delay
            }
        }
    };

    const letterVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <motion.span
            ref={ref as any}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    variants={letterVariants}
                >
                    {char}
                </motion.span>
            ))}
            {cursor && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: text.length * speed + delay + 0.5
                    }}
                    className="inline-block w-0.5 h-5 bg-current ml-1"
                />
            )}
        </motion.span>
    );
}

/**
 * 进度条动画组件
 */
export function ScrollRevealProgressBar({
    progress,
    delay = 0,
    duration = 1.5,
    threshold = 0.3,
    className = "",
    height = "h-2",
    backgroundColor = "bg-gray-200",
    fillColor = "bg-blue-500"
}: {
    progress: number;
    delay?: number;
    duration?: number;
    threshold?: number;
    className?: string;
    height?: string;
    backgroundColor?: string;
    fillColor?: string;
}) {
    const { ref, isInView } = useInView({
        threshold,
        triggerOnce: true,
        delay
    });

    return (
        <div
            ref={ref as any}
            className={`w-full ${height} ${backgroundColor} rounded-full overflow-hidden ${className}`}
        >
            <motion.div
                className={`${height} ${fillColor} rounded-full`}
                initial={{ width: "0%" }}
                animate={isInView ? { width: `${progress}%` } : { width: "0%" }}
                transition={{
                    duration,
                    ease: "easeOut",
                    delay
                }}
            />
        </div>
    );
}