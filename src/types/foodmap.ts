// 美食店铺数据类型
export interface Restaurant {
	id: string;
	name: string;
	category?: string; // 主要分类标签（可选）
	coordinates: [number, number];
	address: string;
	rating?: number;
	priceRange?: string;
	description?: string;
	tags?: string[]; // 多个标签，可以自由组合
	images?: string[];
	visitStatus: VisitStatus;
	visitDate?: string;
	personalNotes?: string;
	recommendedDishes?: string[];
	openingHours?: string;
	phone?: string;
	website?: string;
	socialMedia?: {
		instagram?: string;
		weibo?: string;
		dianping?: string;
	};
}

// 美食分类标签（主要分类）
export type FoodCategory = string; // 现在使用灵活的字符串类型，支持任意标签

// 价格区间
export type PriceRange = "¥0-30" | "¥30-60" | "¥60-100" | "¥100-200" | "¥200+";

// 访问状态
export type VisitStatus = "已去" | "未去";

// 地图样式类型
export type MapStyle = "light" | "dark" | "satellite";

// 筛选条件
export interface FilterOptions {
	category?: FoodCategory | "全部";
	priceRange?: PriceRange | "全部";
	rating?: number;
	visitStatus?: VisitStatus | "全部";
	tags?: string[];
	searchKeyword?: string;
}

// 地图配置
export interface MapConfig {
	center: [number, number];
	zoom: number;
	style: MapStyle;
	showControls: boolean;
	enableClustering: boolean;
}

// 本地存储的数据结构
export interface FoodMapData {
	restaurants: Restaurant[];
	mapConfig: MapConfig;
	lastUpdated: string;
	version: string;
}

// 扩展Window接口以避免空接口错误
declare global {
	interface Window {
		_AMapSecurityConfig: {
			securityJsCode: string;
		};
	}
}
