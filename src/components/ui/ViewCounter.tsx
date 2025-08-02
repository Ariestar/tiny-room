"use client";

import { useState, useEffect } from 'react';

interface ViewCounterProps {
    slug: string;
    className?: string;
}

export const ViewCounter: React.FC<ViewCounterProps> = ({ slug, className = "" }) => {
    const [views, setViews] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchViews = async () => {
            try {
                const response = await fetch(`/api/analytics/views?slug=${encodeURIComponent(slug)}`);

                if (response.ok) {
                    const data = await response.json();
                    setViews(data.views);
                } else {
                    setViews(0);
                }
            } catch (error) {
                console.error('Failed to fetch view count:', error);
                setViews(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchViews();
    }, [slug]);

    if (isLoading) {
        return (
            <span className={`flex items-center gap-1.5 font-medium text-sm text-muted-foreground ${className}`}>
                <svg className="w-4 h-4 opacity-60 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="w-8 h-4 bg-muted animate-pulse rounded"></span>
            </span>
        );
    }

    return (
        <span className={`flex items-center gap-1.5 font-medium text-sm text-muted-foreground ${className}`}>
            <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {views !== null ? views.toLocaleString() : '---'}
        </span>
    );
};

export default ViewCounter;