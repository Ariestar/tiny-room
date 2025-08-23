import { LatLngExpression } from "leaflet";

// 美食店铺数据类型
export interface Restaurant {
	id: string;
	name: string;
	category: string;
	coordinates: LatLngExpression;
	address: string;
	rating?: number;
	priceRange?: string;
	description?: string;
	tags?: string[];
	images?: string[];
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

// 美食分类
export type FoodCategory =
	| "川菜"
	| "粤菜"
	| "湘菜"
	| "鲁菜"
	| "苏菜"
	| "浙菜"
	| "闽菜"
	| "徽菜"
	| "北京菜"
	| "东北菜"
	| "西北菜"
	| "火锅"
	| "烧烤"
	| "日料"
	| "韩料"
	| "西餐"
	| "快餐"
	| "小吃"
	| "甜品"
	| "咖啡"
	| "酒吧"
	| "面食"
	| "小笼包"
	| "麻辣小龙虾"
	| "其他";

// 价格区间
export type PriceRange = "¥0-30" | "¥30-60" | "¥60-100" | "¥100-200" | "¥200+";

// 地图样式类型
export type MapStyle = "light" | "dark" | "satellite";

// 筛选条件
export interface FilterOptions {
	category?: FoodCategory | "全部";
	priceRange?: PriceRange | "全部";
	rating?: number;
	tags?: string[];
	searchKeyword?: string;
}

// 地图配置
export interface MapConfig {
	center: LatLngExpression;
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
