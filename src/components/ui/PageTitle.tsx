"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/shared/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface PageTitleProps {
    title: string;
    className?: string;
    emoji?: string;
}

export function PageTitle({ title, className, emoji }: PageTitleProps) {
    const { isScrolled, scrollToTop } = useScrollAnimation(150);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFixed(!entry.isIntersecting);
            },
            { rootMargin: '-1px 0px 0px 0px' } // 1px top margin to trigger right at the edge
        );

        if (titleRef.current) {
            observer.observe(titleRef.current);
        }

        return () => {
            if (titleRef.current) {
                observer.unobserve(titleRef.current);
            }
        };
    }, []);

    return (
        <>
            <h1
                ref={titleRef}
                className={cn(
                    'text-6xl font-bevan font-bold my-2 text-foreground',
                    'py-4',
                    className
                )}
            >
                {title}
                {emoji && <span className="mx-2">{emoji}</span>}
            </h1>

            <AnimatePresence>
                {isScrolled && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={scrollToTop}
                        className={cn(
                            "fixed bottom-8 right-8 z-50",
                            "w-12 h-12 bg-card/80 backdrop-blur-sm border border-border/20 text-foreground",
                            "rounded-full shadow-lg",
                            "flex items-center justify-center",
                            "hover:bg-muted transition-colors"
                        )}
                        aria-label="回到顶部"
                    >
                        <span className="text-xl">↑</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
