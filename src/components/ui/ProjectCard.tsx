import React from "react";
import { cn } from "@/lib/shared/utils";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "./Card";
import Badge from "./Badge";
import Checkbox from "./Checkbox";
import Button from "./Button";

// Project data interface
export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
  topics?: string[];
  isVisible?: boolean;
  isFeatured?: boolean;
  isPrivate?: boolean;
}

// ProjectCard Props
export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Project data */
  project: ProjectData;
  /** Card variant */
  variant?: "default" | "compact" | "featured" | "management";
  /** Whether to show statistics */
  showStats?: boolean;
  /** Whether to show management controls */
  showControls?: boolean;
  /** Whether the project is selected */
  selected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether the card is clickable */
  clickable?: boolean;
  /** Visibility toggle handler */
  onVisibilityToggle?: (id: string, visible: boolean) => void;
  /** Featured toggle handler */
  onFeaturedToggle?: (id: string, featured: boolean) => void;
  /** Selection handler */
  onSelectionChange?: (id: string, selected: boolean) => void;
  /** Custom class name */
  className?: string;
}

// Language color mapping for badges
const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-500",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-red-500",
  "C++": "bg-purple-500",
  C: "bg-gray-600",
  Go: "bg-cyan-500",
  Rust: "bg-orange-600",
  PHP: "bg-indigo-500",
  Ruby: "bg-red-600",
  Swift: "bg-orange-500",
  Kotlin: "bg-purple-600",
  Dart: "bg-blue-600",
  HTML: "bg-orange-400",
  CSS: "bg-blue-400",
  Shell: "bg-gray-500",
};

// Format date helper
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  (
    {
      project,
      variant = "default",
      showStats = true,
      showControls = false,
      selected = false,
      onClick,
      clickable = true,
      onVisibilityToggle,
      onFeaturedToggle,
      onSelectionChange,
      className = "",
      ...props
    },
    ref
  ) => {
    // Determine card variant based on ProjectCard variant
    const cardVariant = variant === "featured" ? "gradient" : "default";

    // Handle click
    const handleClick = (e: React.MouseEvent) => {
      // Don't trigger card click if clicking on controls
      if ((e.target as HTMLElement).closest('.project-controls')) {
        return;
      }

      if (clickable && onClick) {
        onClick();
      } else if (clickable && project.url) {
        window.open(project.url, "_blank", "noopener,noreferrer");
      }
    };

    // Handle visibility toggle
    const handleVisibilityToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      onVisibilityToggle?.(project.id, !project.isVisible);
    };

    // Handle featured toggle
    const handleFeaturedToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      onFeaturedToggle?.(project.id, !project.isFeatured);
    };

    // Handle selection change
    const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onSelectionChange?.(project.id, e.target.checked);
    };

    // Compact variant layout
    if (variant === "compact") {
      return (
        <Card
          ref={ref}
          variant={cardVariant}
          size="sm"
          hoverable={clickable}
          clickable={clickable}
          className={cn("transition-all duration-200", className)}
          onClick={handleClick}
          {...props}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{project.name}</h4>
                {project.language && (
                  <Badge
                    size="sm"
                    className={cn(
                      "text-white text-xs",
                      languageColors[project.language] || "bg-gray-500"
                    )}
                  >
                    {project.language}
                  </Badge>
                )}
              </div>
              {project.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
            {showStats && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground ml-4">
                <span className="flex items-center gap-1">
                  ⭐ {project.stars}
                </span>
                <span className="flex items-center gap-1">
                  🍴 {project.forks}
                </span>
              </div>
            )}
          </div>
        </Card>
      );
    }

    // Default and featured variant layout
    return (
      <Card
        ref={ref}
        variant={cardVariant}
        size="md"
        hoverable={clickable}
        clickable={clickable}
        className={cn(
          "transition-all duration-200",
          selected && "ring-2 ring-primary ring-offset-2",
          !project.isVisible && "opacity-60",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {/* Selection checkbox for management mode */}
              {showControls && (
                <div className="project-controls mt-1">
                  <Checkbox
                    checked={selected}
                    onChange={handleSelectionChange}
                    size="sm"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle level={4} className="truncate">
                    {project.name}
                  </CardTitle>

                  {/* Status badges */}
                  {project.isPrivate && (
                    <Badge variant="outline" size="sm" className="text-xs">
                      Private
                    </Badge>
                  )}
                  {project.isFeatured && (
                    <Badge variant="primary" size="sm" className="text-xs">
                      ⭐ Featured
                    </Badge>
                  )}
                  {!project.isVisible && (
                    <Badge variant="secondary" size="sm" className="text-xs">
                      Hidden
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {project.language && (
              <Badge
                size="sm"
                className={cn(
                  "text-white shrink-0",
                  languageColors[project.language] || "bg-gray-500"
                )}
              >
                {project.language}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent padding="none" className="px-6">
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {project.description}
            </p>
          )}

          {project.topics && project.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {project.topics.slice(0, 3).map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {topic}
                </Badge>
              ))}
              {project.topics.length > 3 && (
                <Badge variant="outline" size="sm" className="text-xs">
                  +{project.topics.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Management Controls */}
          {showControls && (
            <div className="project-controls flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={handleVisibilityToggle}
                className="text-xs"
              >
                {project.isVisible ? "👁️ Visible" : "🙈 Hidden"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFeaturedToggle}
                className="text-xs"
              >
                {project.isFeatured ? "⭐ Featured" : "☆ Feature"}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter divider={showStats || showControls} align="between">
          {showStats && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                ⭐ {project.stars}
              </span>
              <span className="flex items-center gap-1">
                🍴 {project.forks}
              </span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            Updated {formatDate(project.updatedAt)}
          </span>
        </CardFooter>
      </Card>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;