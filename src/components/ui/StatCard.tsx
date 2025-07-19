import React from "react";
import { cn } from "@/lib/utils";
import Card, { CardHeader, CardTitle, CardContent } from "./Card";

// Trend direction type
export type TrendDirection = "up" | "down" | "neutral";

// Trend data interface
export interface TrendData {
  value: number;
  direction: TrendDirection;
  label?: string;
}

// StatCard Props
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main title */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Subtitle or description */
  subtitle?: string;
  /** Trend indicator */
  trend?: TrendData;
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Card variant */
  variant?: "default" | "compact" | "highlighted";
  /** Custom class name */
  className?: string;
}

// Trend icon components
const TrendUpIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("w-4 h-4", className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const TrendDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("w-4 h-4", className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
    />
  </svg>
);

const TrendNeutralIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("w-4 h-4", className)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 12H4"
    />
  </svg>
);

// Format number helper
const formatValue = (value: string | number): string => {
  if (typeof value === "string") return value;
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

// Get trend color
const getTrendColor = (direction: TrendDirection): string => {
  switch (direction) {
    case "up":
      return "text-green-600 dark:text-green-400";
    case "down":
      return "text-red-600 dark:text-red-400";
    case "neutral":
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

// Get trend icon
const getTrendIcon = (direction: TrendDirection) => {
  switch (direction) {
    case "up":
      return TrendUpIcon;
    case "down":
      return TrendDownIcon;
    case "neutral":
    default:
      return TrendNeutralIcon;
  }
};

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      subtitle,
      trend,
      icon: Icon,
      variant = "default",
      className = "",
      ...props
    },
    ref
  ) => {
    // Determine card variant and size based on StatCard variant
    const cardVariant = variant === "highlighted" ? "gradient" : "elevated";
    const cardSize = variant === "compact" ? "sm" : "md";

    // Compact variant layout
    if (variant === "compact") {
      return (
        <Card
          ref={ref}
          variant={cardVariant}
          size={cardSize}
          className={cn("transition-all duration-200", className)}
          {...props}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground truncate">
                {title}
              </p>
              <p className="text-lg font-bold text-foreground">
                {formatValue(value)}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {Icon && (
                <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              {trend && (
                <div className={cn("flex items-center gap-1", getTrendColor(trend.direction))}>
                  {React.createElement(getTrendIcon(trend.direction), {
                    className: "w-3 h-3"
                  })}
                  <span className="text-xs font-medium">
                    {Math.abs(trend.value)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      );
    }

    // Default and highlighted variant layout
    return (
      <Card
        ref={ref}
        variant={cardVariant}
        size={cardSize}
        className={cn("transition-all duration-200", className)}
        {...props}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle level={5} className="text-muted-foreground font-medium">
              {title}
            </CardTitle>
            {Icon && (
              <Icon className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>

        <CardContent padding="none" className="px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {formatValue(value)}
              </p>
              {subtitle && (
                <p className="text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
            
            {trend && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50",
                getTrendColor(trend.direction)
              )}>
                {React.createElement(getTrendIcon(trend.direction), {
                  className: "w-4 h-4"
                })}
                <span className="text-sm font-medium">
                  {Math.abs(trend.value)}%
                </span>
                {trend.label && (
                  <span className="text-xs text-muted-foreground ml-1">
                    {trend.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";

export default StatCard;