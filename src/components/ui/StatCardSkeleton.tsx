import React from "react";
import { cn } from "@/lib/shared/utils";
import Card, { CardHeader, CardContent } from "./Card";

// StatCard Skeleton Props
export interface StatCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Card variant */
    variant?: "default" | "compact" | "highlighted";
    /** Custom class name */
    className?: string;
}

const StatCardSkeleton = React.forwardRef<HTMLDivElement, StatCardSkeletonProps>(
    ({ variant = "default", className = "", ...props }, ref) => {
        // Determine card variant
        const cardVariant = variant === "highlighted" ? "gradient" : "elevated";
        const cardSize = variant === "compact" ? "sm" : "md";

        // Compact variant skeleton
        if (variant === "compact") {
            return (
                <Card
                    ref={ref}
                    variant={cardVariant}
                    size={cardSize}
                    className={cn("animate-pulse", className)}
                    {...props}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="h-3 bg-muted rounded w-20 mb-2"></div>
                            <div className="h-6 bg-muted rounded w-12"></div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <div className="h-5 w-5 bg-muted rounded"></div>
                            <div className="h-3 bg-muted rounded w-8"></div>
                        </div>
                    </div>
                </Card>
            );
        }

        // Default and highlighted variant skeleton
        return (
            <Card
                ref={ref}
                variant={cardVariant}
                size={cardSize}
                className={cn("animate-pulse", className)}
                {...props}
            >
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="h-4 bg-muted rounded w-24"></div>
                        <div className="h-5 w-5 bg-muted rounded"></div>
                    </div>
                </CardHeader>

                <CardContent padding="none" className="px-6">
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                            <div className="h-4 bg-muted rounded w-32"></div>
                        </div>

                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50">
                            <div className="h-4 w-4 bg-muted rounded"></div>
                            <div className="h-4 bg-muted rounded w-8"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
);

StatCardSkeleton.displayName = "StatCardSkeleton";

export default StatCardSkeleton;