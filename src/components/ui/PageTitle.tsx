"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/shared/utils';

interface PageTitleProps {
    title: string;
    className?: string;
    emoji?: string;
}

export function PageTitle({ title, className, emoji }: PageTitleProps) {
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
    );
}
