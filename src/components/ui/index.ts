// UI 组件导出
export { default as Button } from "./Button";
export type { ButtonProps } from "./Button";

export { default as Input } from "./Input";
export type { InputProps } from "./Input";

export {
	default as Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "./Card";
export type {
	CardProps,
	CardHeaderProps,
	CardTitleProps,
	CardDescriptionProps,
	CardContentProps,
	CardFooterProps,
} from "./Card";

export { default as Badge } from "./Badge";
export type { BadgeProps } from "./Badge";

export { default as Alert } from "./Alert";
export type { AlertProps } from "./Alert";

export { default as Loading } from "./Loading";
export type { LoadingProps } from "./Loading";

export { default as Checkbox } from "./Checkbox";
export type { CheckboxProps } from "./Checkbox";

export { Table } from "./Table";

export { default as Navigation } from "../layout/Navigation";
export type { NavigationProps, NavigationItem } from "../layout/Navigation";

// 动画组件
export {
	AnimatedDiv,
	FadeIn,
	SlideUp,
	SlideDown,
	SlideLeft,
	SlideRight,
	ScaleIn,
	BounceIn,
	RotateIn,
} from "../animation/AnimatedDiv";
export type { AnimatedDivProps, AnimationPreset } from "../animation/AnimatedDiv";

export {
	AnimatedList,
	StaggerList,
	CascadeList,
	WaveList,
	ScaleList,
	RotateList,
} from "../animation/AnimatedList";
export type { AnimatedListProps, ListAnimationType } from "../animation/AnimatedList";

export {
	PageTransition,
	SlideTransition,
	FadeTransition,
	ScaleTransition,
	SlideUpTransition,
	SlideDownTransition,
	RotateTransition,
	FlipTransition,
} from "../animation/PageTransition";
export type { PageTransitionProps, PageTransitionType } from "../animation/PageTransition";

// 动画工具函数和预设
export * from "@/lib/ui/animations";

// 导航组件
export { default as TopNavigation } from "../layout/TopNavigation";

// 表单组件
export * from "../feature/settings/SettingsForm";

// 新增卡片组件
export * from "../feature/settings/ApiKeyCard";
export * from "../feature/dashboard/MaintenanceCard";

// Projects Management Components
export { default as ProjectCard } from "./ProjectCard";
export type { ProjectCardProps, ProjectData } from "./ProjectCard";

export { default as StatCard } from "./StatCard";
export type { StatCardProps, TrendData, TrendDirection } from "./StatCard";

export { default as FilterBar } from "./FilterBar";
export type { FilterBarProps, FilterOption, FilterType } from "./FilterBar";

export { default as GitHubConfigModal } from "./GitHubConfigModal";
export type { GitHubConfigModalProps } from "./GitHubConfigModal";

export { default as ProjectCardSkeleton } from "./ProjectCardSkeleton";
export type { ProjectCardSkeletonProps } from "./ProjectCardSkeleton";

export { default as StatCardSkeleton } from "./StatCardSkeleton";
export type { StatCardSkeletonProps } from "./StatCardSkeleton";

export { default as ErrorBoundary } from "./ErrorBoundary";

export { default as ErrorDisplay } from "./ErrorDisplay";
export type { ErrorDisplayProps } from "./ErrorDisplay";
