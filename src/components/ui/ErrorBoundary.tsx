"use client"

import React, { Component, ErrorInfo, ReactNode } from "react";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "./Card";
import Button from "./Button";
import Badge from "./Badge";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ error, errorInfo });
        this.props.onError?.(error, errorInfo);

        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex items-center justify-center min-h-96 p-4">
                    <Card variant="outlined" className="w-full max-w-md">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Badge variant="destructive" size="sm">
                                    Error
                                </Badge>
                                <CardTitle level={4}>Something went wrong</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    An unexpected error occurred while loading this component.
                                    This might be a temporary issue.
                                </p>

                                {process.env.NODE_ENV === 'development' && this.state.error && (
                                    <details className="text-xs">
                                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                            Error Details (Development)
                                        </summary>
                                        <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                                            <div className="text-red-600 font-semibold">
                                                {this.state.error.name}: {this.state.error.message}
                                            </div>
                                            {this.state.error.stack && (
                                                <pre className="mt-2 whitespace-pre-wrap text-xs">
                                                    {this.state.error.stack}
                                                </pre>
                                            )}
                                        </div>
                                    </details>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter align="between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.reload()}
                            >
                                Reload Page
                            </Button>
                            <Button
                                size="sm"
                                onClick={this.handleRetry}
                            >
                                Try Again
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;