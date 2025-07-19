import React from "react";
import { cn } from "@/lib/utils";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "./Card";
import Button from "./Button";
import Badge from "./Badge";

// Error Display Props
export interface ErrorDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Error title */
    title?: string;
    /** Error message */
    message: string;
    /** Error type */
    type?: "error" | "warning" | "info";
    /** Whether to show retry button */
    showRetry?: boolean;
    /** Retry handler */
    onRetry?: () => void;
    /** Whether to show reload button */
    showReload?: boolean;
    /** Additional actions */
    actions?: React.ReactNode;
    /** Error details (for development) */
    details?: string;
    /** Custom class name */
    className?: string;
}

const ErrorDisplay = React.forwardRef<HTMLDivElement, ErrorDisplayProps>(
    (
        {
            title,
            message,
            type = "error",
            showRetry = true,
            onRetry,
            showReload = false,
            actions,
            details,
            className = "",
            ...props
        },
        ref
    ) => {
        const getVariantStyles = () => {
            switch (type) {
                case "warning":
                    return {
                        container: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
                        badge: "warning" as const,
                        icon: "⚠️",
                        title: "text-amber-800 dark:text-amber-200"
                    };
                case "info":
                    return {
                        container: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
                        badge: "info" as const,
                        icon: "ℹ️",
                        title: "text-blue-800 dark:text-blue-200"
                    };
                case "error":
                default:
                    return {
                        container: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
                        badge: "destructive" as const,
                        icon: "❌",
                        title: "text-red-800 dark:text-red-200"
                    };
            }
        };

        const styles = getVariantStyles();

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-lg border p-4",
                    styles.container,
                    className
                )}
                {...props}
            >
                <div className="flex items-start gap-3">
                    <span className="text-lg">{styles.icon}</span>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant={styles.badge} size="sm">
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Badge>
                            {title && (
                                <h3 className={cn("font-medium", styles.title)}>
                                    {title}
                                </h3>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                            {message}
                        </p>

                        {details && process.env.NODE_ENV === 'development' && (
                            <details className="mb-3">
                                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                                    Error Details (Development)
                                </summary>
                                <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                                    <pre className="whitespace-pre-wrap">{details}</pre>
                                </div>
                            </details>
                        )}

                        <div className="flex items-center gap-2">
                            {showRetry && onRetry && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onRetry}
                                >
                                    Try Again
                                </Button>
                            )}

                            {showReload && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.location.reload()}
                                >
                                    Reload Page
                                </Button>
                            )}

                            {actions}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

ErrorDisplay.displayName = "ErrorDisplay";

export default ErrorDisplay;