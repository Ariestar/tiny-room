"use client";

import { useState, useEffect } from "react";

interface MobileOptimizationConfig {
	/** 是否为移动设备 */
	isMobile: boolean;
	/** 是否为平板设备 */
	isTablet: boolean;
	/** 是否为桌面设备 */
	isDesktop: boolean;
	/** 屏幕宽度 */
	screenWidth: number;
	/** 屏幕高度 */
	screenHeight: number;
	/** 是否为触控设备 */
	isTouchDevice: boolean;
	/** 是否支持悬停 */
	supportsHover: boolean;
	/** 设备像素比 */
	devicePixelRatio: number;
	/** 是否为横屏 */
	isLandscape: boolean;
	/** 是否为竖屏 */
	isPortrait: boolean;
	/** 网络连接类型 */
	connectionType: string;
	/** 是否为慢速网络 */
	isSlowConnection: boolean;
}

/**
 * 移动端优化Hook
 * 提供设备检测和优化配置
 */
export function useMobileOptimization(): MobileOptimizationConfig {
	const [config, setConfig] = useState<MobileOptimizationConfig>({
		isMobile: false,
		isTablet: false,
		isDesktop: true,
		screenWidth: 1920,
		screenHeight: 1080,
		isTouchDevice: false,
		supportsHover: true,
		devicePixelRatio: 1,
		isLandscape: true,
		isPortrait: false,
		connectionType: "4g",
		isSlowConnection: false,
	});

	useEffect(() => {
		const updateConfig = () => {
			const screenWidth = window.innerWidth;
			const screenHeight = window.innerHeight;
			const devicePixelRatio = window.devicePixelRatio || 1;

			// 设备类型检测
			const isMobile = screenWidth < 900;
			const isTablet = screenWidth >= 900 && screenWidth < 1024;
			const isDesktop = screenWidth >= 1024;

			// 触控设备检测
			const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

			// 悬停支持检测
			const supportsHover = window.matchMedia("(hover: hover)").matches;

			// 屏幕方向检测
			const isLandscape = screenWidth > screenHeight;
			const isPortrait = screenHeight > screenWidth;

			// 网络连接检测
			let connectionType = "4g";
			let isSlowConnection = false;

			if ("connection" in navigator) {
				const connection = (navigator as any).connection;
				connectionType = connection.effectiveType || "4g";
				isSlowConnection = ["slow-2g", "2g", "3g"].includes(connectionType);
			}

			setConfig({
				isMobile,
				isTablet,
				isDesktop,
				screenWidth,
				screenHeight,
				isTouchDevice,
				supportsHover,
				devicePixelRatio,
				isLandscape,
				isPortrait,
				connectionType,
				isSlowConnection,
			});
		};

		// 初始化
		updateConfig();

		// 监听窗口大小变化
		window.addEventListener("resize", updateConfig);
		window.addEventListener("orientationchange", updateConfig);

		// 监听网络变化
		if ("connection" in navigator) {
			(navigator as any).connection.addEventListener("change", updateConfig);
		}

		return () => {
			window.removeEventListener("resize", updateConfig);
			window.removeEventListener("orientationchange", updateConfig);
			if ("connection" in navigator) {
				(navigator as any).connection.removeEventListener("change", updateConfig);
			}
		};
	}, []);

	return config;
}

/**
 * 移动端动画配置Hook
 * 根据设备性能调整动画配置
 */
export function useMobileAnimationConfig() {
	const { isMobile, isSlowConnection, devicePixelRatio } = useMobileOptimization();

	// 检测用户是否偏好减少动画
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mediaQuery.matches);

		const handleChange = (e: MediaQueryListEvent) => {
			setPrefersReducedMotion(e.matches);
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	// 根据设备性能调整动画配置
	const animationConfig = {
		// 是否启用动画
		enableAnimations: !prefersReducedMotion && !isSlowConnection,

		// 动画持续时间倍数
		durationMultiplier: isMobile ? 0.8 : 1,

		// 是否启用复杂动画
		enableComplexAnimations: !isMobile && !isSlowConnection && devicePixelRatio <= 2,

		// 是否启用3D变换
		enable3DTransforms: !isMobile && !isSlowConnection,

		// 是否启用模糊效果
		enableBlurEffects: !isMobile && !isSlowConnection,

		// 是否启用粒子效果
		enableParticleEffects: !isMobile && !isSlowConnection,

		// 动画缓动函数
		easing: isMobile ? "ease-out" : "cubic-bezier(0.4, 0, 0.2, 1)",

		// 弹簧动画配置
		springConfig: {
			stiffness: isMobile ? 200 : 300,
			damping: isMobile ? 25 : 30,
		},
	};

	return animationConfig;
}

/**
 * 移动端触控优化Hook
 * 提供触控交互优化
 */
export function useMobileTouchOptimization() {
	const { isTouchDevice, isMobile } = useMobileOptimization();

	const touchConfig = {
		// 是否启用触控反馈
		enableTouchFeedback: isTouchDevice,

		// 触控目标最小尺寸
		minTouchTargetSize: isMobile ? 44 : 32,

		// 是否启用长按
		enableLongPress: isTouchDevice,

		// 长按延迟时间
		longPressDelay: 500,

		// 是否启用滑动手势
		enableSwipeGestures: isMobile,

		// 滑动阈值
		swipeThreshold: 50,

		// 是否禁用悬停效果
		disableHoverEffects: isTouchDevice && isMobile,

		// 触控样式类名
		touchClasses: {
			touchTarget: "touch-target",
			touchFeedback: "mobile-touch-feedback",
			buttonFeedback: "mobile-button-feedback",
		},
	};

	return touchConfig;
}

/**
 * 移动端性能优化Hook
 * 提供性能优化配置
 */
export function useMobilePerformanceOptimization() {
	const { isMobile, isSlowConnection, devicePixelRatio } = useMobileOptimization();

	const performanceConfig = {
		// 是否启用图片懒加载
		enableImageLazyLoading: true,

		// 图片质量
		imageQuality: isMobile ? 75 : 85,

		// 是否使用WebP格式
		useWebPFormat: true,

		// 是否启用代码分割
		enableCodeSplitting: true,

		// 是否预加载关键资源
		enablePreloading: !isSlowConnection,

		// 是否启用服务工作者
		enableServiceWorker: true,

		// 缓存策略
		cacheStrategy: isSlowConnection ? "cache-first" : "network-first",

		// 是否启用压缩
		enableCompression: true,

		// 批处理大小
		batchSize: isMobile ? 5 : 10,

		// 虚拟滚动阈值
		virtualScrollThreshold: isMobile ? 20 : 50,

		// 防抖延迟
		debounceDelay: isMobile ? 300 : 200,

		// 节流延迟
		throttleDelay: isMobile ? 100 : 50,
	};

	return performanceConfig;
}

/**
 * 移动端布局优化Hook
 * 提供布局优化配置
 */
export function useMobileLayoutOptimization() {
	const { isMobile, isTablet, screenWidth, isPortrait } = useMobileOptimization();

	const layoutConfig = {
		// 容器最大宽度
		maxContainerWidth: isMobile ? "100%" : isTablet ? "768px" : "1200px",

		// 网格列数
		gridColumns: {
			mobile: 1,
			tablet: 2,
			desktop: 3,
		},

		// 间距大小
		spacing: {
			xs: isMobile ? "0.5rem" : "0.75rem",
			sm: isMobile ? "1rem" : "1.5rem",
			md: isMobile ? "1.5rem" : "2rem",
			lg: isMobile ? "2rem" : "3rem",
			xl: isMobile ? "2.5rem" : "4rem",
		},

		// 字体大小
		fontSize: {
			xs: isMobile ? "0.75rem" : "0.875rem",
			sm: isMobile ? "0.875rem" : "1rem",
			base: isMobile ? "1rem" : "1.125rem",
			lg: isMobile ? "1.125rem" : "1.25rem",
			xl: isMobile ? "1.25rem" : "1.5rem",
			"2xl": isMobile ? "1.5rem" : "2rem",
			"3xl": isMobile ? "2rem" : "2.5rem",
			"4xl": isMobile ? "2.5rem" : "3rem",
		},

		// 是否使用堆叠布局
		useStackedLayout: isMobile && isPortrait,

		// 是否隐藏侧边栏
		hideSidebar: isMobile,

		// 导航样式
		navigationStyle: isMobile ? "bottom" : "top",

		// 卡片样式
		cardStyle: isMobile ? "compact" : "default",

		// 布局样式类名
		layoutClasses: {
			container: isMobile ? "mobile-container" : "",
			grid: isMobile ? "mobile-grid-single" : "",
			card: isMobile ? "mobile-card-compact" : "",
			spacing: isMobile ? "mobile-spacing-md" : "",
		},
	};

	return layoutConfig;
}
