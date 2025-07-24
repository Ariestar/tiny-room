"use client"

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/shared/utils";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "./Card";
import Button from "./Button";
import Input from "./Input";
import Badge from "./Badge";
import Loading from "./Loading";
import { githubService } from "@/lib/data/api/github";

// GitHub Config Modal Props
export interface GitHubConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (token: string) => void;
}

const GitHubConfigModal = React.forwardRef<HTMLDivElement, GitHubConfigModalProps>(
    ({ isOpen, onClose, onSave }, ref) => {
        const [token, setToken] = useState("");
        const [testing, setTesting] = useState(false);
        const [testResult, setTestResult] = useState<{
            success: boolean;
            user?: any;
            error?: string;
        } | null>(null);
        const [saving, setSaving] = useState(false);

        // Load existing token on mount
        useEffect(() => {
            const existingToken = githubService.getToken();
            if (existingToken) {
                setToken(existingToken);
            }
        }, [isOpen]);

        // Test GitHub connection
        const handleTestConnection = async () => {
            if (!token.trim()) {
                setTestResult({
                    success: false,
                    error: "Please enter a GitHub token"
                });
                return;
            }

            setTesting(true);
            setTestResult(null);

            try {
                // Temporarily set token for testing
                const originalToken = githubService.getToken();
                githubService.setToken(token.trim());

                const result = await githubService.testConnection();
                setTestResult(result);

                // Restore original token if test failed
                if (!result.success && originalToken) {
                    githubService.setToken(originalToken);
                }
            } catch (error) {
                setTestResult({
                    success: false,
                    error: error instanceof Error ? error.message : "Connection test failed"
                });
            } finally {
                setTesting(false);
            }
        };

        // Save configuration
        const handleSave = async () => {
            if (!testResult?.success) {
                await handleTestConnection();
                return;
            }

            setSaving(true);
            try {
                githubService.setToken(token.trim());
                onSave(token.trim());
                onClose();
            } catch (error) {
                console.error("Failed to save GitHub configuration:", error);
            } finally {
                setSaving(false);
            }
        };

        // Handle close
        const handleClose = () => {
            setToken("");
            setTestResult(null);
            onClose();
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card
                    ref={ref}
                    variant="elevated"
                    className="w-full max-w-md mx-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CardHeader>
                        <CardTitle level={3}>GitHub Configuration</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Configure your GitHub Personal Access Token to sync repositories
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Token Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Personal Access Token
                            </label>
                            <Input
                                type="password"
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Create a token at{" "}
                                <a
                                    href="https://github.com/settings/tokens"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    GitHub Settings → Developer settings → Personal access tokens
                                </a>
                            </p>
                        </div>

                        {/* Required Permissions */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Required Permissions
                            </label>
                            <div className="flex flex-wrap gap-1">
                                <Badge variant="outline" size="sm">repo</Badge>
                                <Badge variant="outline" size="sm">user</Badge>
                                <Badge variant="outline" size="sm">read:org</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                These permissions are needed to read your repositories and profile information
                            </p>
                        </div>

                        {/* Test Connection */}
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                onClick={handleTestConnection}
                                disabled={testing || !token.trim()}
                                className="w-full"
                            >
                                {testing ? (
                                    <>
                                        <Loading size="sm" className="mr-2" />
                                        Testing Connection...
                                    </>
                                ) : (
                                    "Test Connection"
                                )}
                            </Button>

                            {/* Test Result */}
                            {testResult && (
                                <div className={cn(
                                    "p-3 rounded-md text-sm",
                                    testResult.success
                                        ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                                        : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
                                )}>
                                    {testResult.success ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600 dark:text-green-400">✓</span>
                                            <div>
                                                <p className="font-medium">Connection successful!</p>
                                                {testResult.user && (
                                                    <p className="text-xs mt-1">
                                                        Connected as: {testResult.user.name || testResult.user.login}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-600 dark:text-red-400">✗</span>
                                            <div>
                                                <p className="font-medium">Connection failed</p>
                                                <p className="text-xs mt-1">{testResult.error}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter align="between">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving || !token.trim()}
                        >
                            {saving ? (
                                <>
                                    <Loading size="sm" className="mr-2" />
                                    Saving...
                                </>
                            ) : (
                                testResult?.success ? "Save Configuration" : "Test & Save"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
);

GitHubConfigModal.displayName = "GitHubConfigModal";

export default GitHubConfigModal;