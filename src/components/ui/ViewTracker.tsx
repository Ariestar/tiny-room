"use client";

import { useEffect } from 'react';

interface ViewTrackerProps {
    slug: string;
}

export const ViewTracker: React.FC<ViewTrackerProps> = ({ slug }) => {
    useEffect(() => {
        const trackView = async () => {
            try {
                await fetch('/api/analytics/views', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ slug }),
                });
            } catch (error) {
                console.error('Failed to track view:', error);
            }
        };

        // 延迟执行，确保页面加载完成
        const timer = setTimeout(trackView, 1000);

        return () => clearTimeout(timer);
    }, [slug]);

    return null; // 这个组件不渲染任何内容
};

export default ViewTracker;