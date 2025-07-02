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

export { default as Navigation } from "./Navigation";
export type { NavigationProps, NavigationItem } from "./Navigation";

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
} from "./AnimatedDiv";
export type { AnimatedDivProps, AnimationPreset } from "./AnimatedDiv";

export {
	AnimatedList,
	StaggerList,
	CascadeList,
	WaveList,
	ScaleList,
	RotateList,
} from "./AnimatedList";
export type { AnimatedListProps, ListAnimationType } from "./AnimatedList";

export {
	PageTransition,
	SlideTransition,
	FadeTransition,
	ScaleTransition,
	SlideUpTransition,
	SlideDownTransition,
	RotateTransition,
	FlipTransition,
} from "./PageTransition";
export type { PageTransitionProps, PageTransitionType } from "./PageTransition";

// 动画工具函数和预设
export * from "@/lib/animations";

// 导航组件
export { default as TopNavigation } from "./TopNavigation";
