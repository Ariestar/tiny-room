import React from "react";
import { cn } from "@/lib/utils";
import Card, { CardHeader, CardContent, CardFooter } from "./Card";

// ProjectCard Skeleton Props
export interface ProjectCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Card variant */
    variant?: "default" | "compact" | "featured";
    /** Custom class name */
    className?: string;
}

const ProjectCardSkeleton = React.forwardRef<HTMLDivElement, ProjectCardSkeletonProps>(
    ({ variant = "default", className = "", ...props }, ref) => {
        // Compact variant skeleton
        if (variant === "compact") {
            return (
                <Card
                    ref={ref}
                    variant="default"
                    size="sm"
                    className={cn("animate-pulse", className)}
                    {...props}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-4 bg-muted rounded w-24"></div>
                                <div className="h-4 bg-muted rounded w-16"></div>
                            </div>
                            <div className="h-3 bg-muted rounded w-32"></div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                            <div className="h-3 bg-muted rounded w-8"></div>
                            <div className="h-3 bg-muted rounded w-8"></div>
                        </div>
                    </div>
                </Card>
            );
        }

        // Default and featured variant skeleton
        return (
            <Card
                ref={ref}
                variant="default"
                size="md"
                className={cn("animate-pulse", className)}
                {...props}
            >
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="h-6 bg-muted rounded w-32 mb-2"></div>
                            <div className="flex items-center gap-2">
                                <div className="h-4 bg-muted rounded w-12"></div>
                                <div className="h-4 bg-muted rounded w-16"></div>
                            </div>
                        </div>
                        <div className="h-5 bg-muted rounded w-16"></div>
                    </div>
                </CardHeader>

                <CardContent padding="none" className="px-6">
                    <div className="space-y-2 mb-4">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                        <div className="h-5 bg-muted rounded w-12"></div>
                        <div className="h-5 bg-muted rounded w-16"></div>
                        <div className="h-5 bg-muted rounded w-14"></div>
                    </div>
                </CardContent>

                <CardFooter divider align="between">
                    <div className="flex items-center gap-4">
                        <div className="h-4 bg-muted rounded w-8"></div>
                        <div className="h-4 bg-muted rounded w-8"></div>
                    </div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                </CardFooter>
            </Card>
        );
    }
);

ProjectCardSkeleton.displayName = "ProjectCardSkeleton";

export default ProjectCardSkeleton;