"use client";

import { motion, MotionProps, Variants } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import { useOptimizedAnimation, optimizedAnimationVariants as performantVariants, optimizedSpringConfig as performantTransitions } from "@/lib/ui/animations";

interface OptimizedMotionProps extends Omit<MotionProps, 'variants' | 'transition'> {
    children: ReactNode;
    variant?: keyof typeof performantVariants;
    speed?: 'fast' | 'default' | 'slow';
    delay?: number;
    stagger?: boolean;
    staggerDelay?: number;
    enableWillChange?: boolean;
    className?: string;
}

/**
 * 优化的Motion组件
 * 自动应用性能优化和prefers-reduced-motion支持
 */
export const OptimizedMotion = forwardRef<HTMLDivElement, OptimizedMotionProps>(
    ({
        children,
        variant = 'fadeIn',
        speed = 'default',
        delay = 0,
        stagger = false,
        staggerDelay = 0.1,
        enableWillChange = true,
        className = "",
        ...props
    }, ref) => {
        const { getVariants, getTransition, shouldReduceMotion } = useOptimizedAnimation();

        // 获取优化的变体
        const variants = getVariants(performantVariants[variant]);

        // 获取优化的过渡
        const speedConfig = speed === 'fast' ? performantTransitions.quick :
            speed === 'slow' ? performantTransitions.gentle :
                performantTransitions.smooth;

        const transition = getTransition({
            ...speedConfig,
            delay: stagger ? delay + (staggerDelay * (props.custom || 0)) : delay
        });

        // 性能优化的样式
        const optimizedStyle = {
            ...props.style,
            ...(enableWillChange && !shouldReduceMotion ? {
                willChange: 'transform, opacity'
            } : {}),
            // 启用硬件加速
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden' as const
        };

        return (
            <motion.div
                ref={ref}
                className={`${className} ${enableWillChange ? 'animate-element' : ''}`}
                variants={variants}
                transition={transition}
                style={optimizedStyle}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

OptimizedMotion.displayName = 'OptimizedMotion';

/**
 * 优化的容器组件，用于交错动画
 */
export const OptimizedMotionContainer = forwardRef<HTMLDivElement, {
    children: ReactNode;
    staggerChildren?: number;
    delayChildren?: number;
    className?: string;
}>(({ children, staggerChildren = 0.1, delayChildren = 0, className = "" }, ref) => {
    const { shouldReduceMotion } = useOptimizedAnimation();

    const containerVariants: Variants = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : staggerChildren,
                delayChildren: shouldReduceMotion ? 0 : delayChildren
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={containerVariants}
            initial="initial"
            animate="animate"
        >
            {children}
        </motion.div>
    );
});

OptimizedMotionContainer.displayName = 'OptimizedMotionContainer';

/**
 * 优化的文本动画组件
 */
export const OptimizedTextMotion = forwardRef<HTMLDivElement, {
    children: ReactNode;
    as?: React.ElementType;
    variant?: 'slideUp' | 'slideDown' | 'fadeIn' | 'scale';
    delay?: number;
    className?: string;
}>(({ children, as: Component = 'p', variant = 'slideUp', delay = 0, className = "" }, ref) => {
    const { getVariants, getTransition } = useOptimizedAnimation();

    const variants = getVariants(performantVariants[variant]);
    const transition = getTransition({ ...performantTransitions.smooth, delay });

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={variants}
            transition={transition}
            style={{
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
            }}
        >
            <Component>{children}</Component>
        </motion.div>
    );
});

OptimizedTextMotion.displayName = 'OptimizedTextMotion';

/**
 * 优化的按钮动画组件
 */
export const OptimizedButtonMotion = forwardRef<HTMLButtonElement, {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'scale' | 'lift' | 'rotate';
    className?: string;
}>(({ children, onClick, disabled = false, variant = 'scale', className = "" }, ref) => {
    const { shouldReduceMotion } = useOptimizedAnimation();

    const hoverVariants = {
        scale: { scale: shouldReduceMotion ? 1 : 1.05 },
        lift: { y: shouldReduceMotion ? 0 : -2 },
        rotate: { rotate: shouldReduceMotion ? 0 : 5 }
    };

    const tapVariants = {
        scale: { scale: shouldReduceMotion ? 1 : 0.95 },
        lift: { y: shouldReduceMotion ? 0 : 0 },
        rotate: { rotate: shouldReduceMotion ? 0 : -5 }
    };

    return (
        <motion.button
            ref={ref}
            className={className}
            onClick={onClick}
            disabled={disabled}
            whileHover={hoverVariants[variant]}
            whileTap={tapVariants[variant]}
            transition={performantTransitions.quick}
            style={{
                willChange: 'transform',
                transform: 'translateZ(0)'
            }}
        >
            {children}
        </motion.button>
    );
});

OptimizedButtonMotion.displayName = 'OptimizedButtonMotion';

/**
 * 优化的卡片动画组件
 */
export const OptimizedCardMotion = forwardRef<HTMLDivElement, {
    children: ReactNode;
    hover?: boolean;
    delay?: number;
    className?: string;
}>(({ children, hover = true, delay = 0, className = "" }, ref) => {
    const { shouldReduceMotion } = useOptimizedAnimation();

    const cardVariants: Variants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: shouldReduceMotion ? 0.01 : 0.3,
                delay: shouldReduceMotion ? 0 : delay,
                ease: "easeOut"
            }
        }
    };

    const hoverVariants = hover && !shouldReduceMotion ? {
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
    } : {};

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover={hoverVariants}
            style={{
                willChange: hover ? 'transform' : 'auto',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
            }}
        >
            {children}
        </motion.div>
    );
});

OptimizedCardMotion.displayName = 'OptimizedCardMotion';

/**
 * 优化的图标动画组件
 */
export const OptimizedIconMotion = forwardRef<HTMLDivElement, {
    children: ReactNode;
    animation?: 'bounce' | 'pulse' | 'rotate' | 'none';
    trigger?: 'hover' | 'always' | 'none';
    className?: string;
}>(({ children, animation = 'none', trigger = 'none', className = "" }, ref) => {
    const { shouldReduceMotion } = useOptimizedAnimation();

    if (shouldReduceMotion || animation === 'none') {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }

    const animationVariants = {
        bounce: performantVariants.bounce,
        pulse: performantVariants.pulse,
        rotate: {
            animate: {
                rotate: [0, 360],
                transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }
            }
        },
        none: {}
    };

    const triggerProps = trigger === 'hover' ? {
        whileHover: "animate"
    } : trigger === 'always' ? {
        animate: "animate"
    } : {};

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={animationVariants[animation]}
            style={{
                willChange: 'transform',
                transform: 'translateZ(0)'
            }}
            {...triggerProps}
        >
            {children}
        </motion.div>
    );
});

OptimizedIconMotion.displayName = 'OptimizedIconMotion';