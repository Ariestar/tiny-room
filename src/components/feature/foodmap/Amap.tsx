'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Restaurant } from '../../../types/foodmap'
import { Navigation, MapPin, Star, DollarSign, Clock, Phone, Globe, Tag } from 'lucide-react'

interface AmapProps {
    restaurants: Restaurant[]
    mapStyle: string
    showSatellite: boolean
    center?: [number, number] // 可选的地图中心点
    onLocationUpdate?: (location: [number, number]) => void // 位置更新回调
}

// Set security token at the module level to ensure it's available before loader execution
if (typeof window !== 'undefined') {
    window._AMapSecurityConfig = {
        securityJsCode: process.env.NEXT_PUBLIC_AMAP_TOKEN || '',
    }
}



// InfoWindow内容组件
const InfoWindowContent = ({ restaurant, isDarkMode }: { restaurant: Restaurant; isDarkMode: boolean }) => {
    const navigationUrl = `https://uri.amap.com/navigation?to=${restaurant.coordinates[0]},${restaurant.coordinates[1]},${encodeURIComponent(restaurant.address)}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;

    return (
        <div className={`p-4 rounded-xl w-80 shadow-lg border font-sans ${isDarkMode
                ? 'bg-gray-900 text-gray-100 border-gray-700'
                : 'bg-white text-gray-900 border-gray-200'
            }`}>
            <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>

            {/* 地址行 - 带导航图标 */}
            <div className="flex items-center mb-3">
                <a
                    href={navigationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                    title="使用高德地图导航"
                >
                    <Navigation size={16} className="text-blue-500" />
                </a>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {restaurant.address}
                </span>
            </div>

            {/* 详细信息网格 */}
            <div className="grid grid-cols-[auto_1fr] gap-2 mb-3 text-sm">
                {restaurant.rating && (
                    <>
                        <div className="flex items-center justify-center">
                            <Star size={14} className="text-yellow-500" />
                        </div>
                        <div>{restaurant.rating} / 5.0</div>
                    </>
                )}

                {restaurant.priceRange && (
                    <>
                        <div className="flex items-center justify-center">
                            <DollarSign size={14} className="text-green-500" />
                        </div>
                        <div>{restaurant.priceRange}</div>
                    </>
                )}

                {restaurant.openingHours && (
                    <>
                        <div className="flex items-center justify-center">
                            <Clock size={14} className="text-blue-500" />
                        </div>
                        <div>{restaurant.openingHours}</div>
                    </>
                )}

                {restaurant.phone && (
                    <>
                        <div className="flex items-center justify-center">
                            <Phone size={14} className="text-purple-500" />
                        </div>
                        <div>
                            <a
                                href={`tel:${restaurant.phone}`}
                                className="text-blue-500 hover:underline"
                            >
                                {restaurant.phone}
                            </a>
                        </div>
                    </>
                )}

                {restaurant.website && (
                    <>
                        <div className="flex items-center justify-center">
                            <Globe size={14} className="text-indigo-500" />
                        </div>
                        <div>
                            <a
                                href={restaurant.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                {restaurant.website}
                            </a>
                        </div>
                    </>
                )}
            </div>

            {/* 标签 */}
            {restaurant.tags && restaurant.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs ${isDarkMode
                                    ? 'bg-gray-800 text-gray-300'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* 描述 */}
            {restaurant.description && (
                <div className={`text-sm leading-relaxed pt-3 border-t ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                    }`}>
                    {restaurant.description}
                </div>
            )}
        </div>
    );
};

const Amap = ({ restaurants, mapStyle, showSatellite, center, onLocationUpdate }: AmapProps) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const [mapInstance, setMapInstance] = useState<any>(null)
    const [AMap, setAMap] = useState<any>(null)
    const [isMapReady, setIsMapReady] = useState(false); // New state for map readiness
    const markersRef = useRef<any[]>([])
    const satelliteLayerRef = useRef<any>(null)
    const activeInfoWindowRef = useRef<any>(null)
    const [activeInfoWindow, setActiveInfoWindow] = useState<{ restaurant: Restaurant; element: HTMLElement } | null>(null)

    useEffect(() => {

        AMapLoader.load({
            key: process.env.NEXT_PUBLIC_AMAP_KEY || '',
            version: '2.0',
            plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.TileLayer.Satellite', 'AMap.Text'], // 加载 AMap.Text 插件
        })
            .then(loadedAMap => {
                setAMap(loadedAMap)
                if (mapRef.current) {
                    // 使用传入的中心点，如果没有则尝试获取用户位置，最后才使用北京作为默认值
                    const defaultCenter: [number, number] = center || [116.4074, 39.9042];

                    const map = new loadedAMap.Map(mapRef.current, {
                        zoom: 12,
                        center: defaultCenter,
                        mapStyle: mapStyle,
                        preserveDrawingBuffer: true,
                        // 改善标签显示
                        labelzIndex: 120,
                        zooms: [3, 20], // 设置缩放范围
                        // 启用POI标签显示
                        showIndoorMap: false,
                        // 设置地图样式参数
                        features: ['bg', 'road', 'building', 'point'],
                    })

                    // 如果没有传入中心点，尝试获取用户当前位置
                    if (!center && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const userLocation: [number, number] = [
                                    position.coords.longitude,
                                    position.coords.latitude
                                ];
                                map.setCenter(userLocation);
                                onLocationUpdate?.(userLocation);
                                console.log('用户位置获取成功:', userLocation);
                            },
                            (error) => {
                                console.warn('无法获取用户位置，使用默认位置:', error.message);
                            },
                            {
                                enableHighAccuracy: true,
                                timeout: 10000,
                                maximumAge: 300000 // 5分钟缓存
                            }
                        );
                    }

                    map.on('complete', () => {
                        setIsMapReady(true); // Set map ready state on 'complete' event
                    });

                    // 监听缩放级别变化，动态控制标签显示
                    map.on('zoomend', () => {
                        const currentZoom = map.getZoom();
                        // 在较小缩放级别时，确保POI标签可见
                        if (currentZoom < 10) {
                            map.setFeatures(['bg', 'road', 'building', 'point']);
                        }
                    });

                    // 点击地图空白处关闭信息窗体
                    map.on('click', () => {
                        if (activeInfoWindowRef.current) {
                            activeInfoWindowRef.current.close();
                            activeInfoWindowRef.current = null;
                        }
                    });

                    setMapInstance(map)
                }
            })
            .catch(e => {
                console.error('高德地图加载失败:', e)
            })

        return () => {
            mapInstance?.destroy()
        }
    }, []) // Run only once on mount

    useEffect(() => {
        if (mapInstance && AMap) {
            mapInstance.setMapStyle(mapStyle)
        }
    }, [mapStyle, mapInstance, AMap])

    useEffect(() => {
        if (!mapInstance || !AMap) return

        if (showSatellite) {
            if (!satelliteLayerRef.current) {
                satelliteLayerRef.current = new AMap.TileLayer.Satellite()
                mapInstance.add(satelliteLayerRef.current)
            } else {
                satelliteLayerRef.current.show()
            }
        } else {
            if (satelliteLayerRef.current) {
                satelliteLayerRef.current.hide()
            }
        }
    }, [showSatellite, mapInstance, AMap])


    useEffect(() => {
        if (!mapInstance || !AMap || !isMapReady) { // Guard against running before map is ready
            return
        }

        // 清除旧的标记
        mapInstance.remove(markersRef.current)
        markersRef.current = []

        if (restaurants.length === 0) {
            return
        }

        const newMarkers: any[] = []

        // 高德地图API返回的坐标已经是GCJ-02格式，直接使用
        restaurants.forEach((restaurant, index) => {
            const gcj02Coord = restaurant.coordinates

            const isDarkMode = mapStyle.includes('dark');

            // 不再需要内联样式，使用Tailwind CSS类

            // 创建DOM元素用于Portal渲染
            const infoWindowElement = document.createElement('div');
            infoWindowElement.className = 'info-window-container';

            // --- 3. 创建自定义标记点图标 ---
            const markerColor = isDarkMode ? 'hsl(210, 40%, 98%)' : 'hsl(222.2, 84%, 10%)';
            const markerStrokeColor = isDarkMode ? 'hsl(0, 0%, 10%)' : 'hsl(0, 0%, 99%)';
            const markerSvg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="${markerColor}" stroke="${markerStrokeColor}" stroke-width="2"/></svg>`;
            const icon = new AMap.Icon({
                size: new AMap.Size(24, 24),
                image: `data:image/svg+xml;utf8,${encodeURIComponent(markerSvg)}`,
                imageSize: new AMap.Size(24, 24),
            });

            // --- 4. 创建标记点 ---
            const marker = new AMap.Marker({
                position: gcj02Coord,
                map: mapInstance,
                icon: icon,
                offset: new AMap.Pixel(-12, -12),
                // 确保在所有缩放级别下都显示
                zooms: [3, 20],
                zIndex: 150, // 高优先级显示
            });

            // --- 5. 创建独立的文本标签 (AMap.Text) ---
            const textLabel = new AMap.Text({
                text: restaurant.name,
                position: gcj02Coord,
                map: mapInstance,
                offset: new AMap.Pixel(15, -10), // 微调位置
                // 根据缩放级别控制显示
                zooms: [9, 20], // 只在缩放级别 9+ 时显示名称
                zIndex: 200, // 高优先级显示
                style: {
                    'padding': '4px 10px',
                    'background-color': isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                    'color': isDarkMode ? 'hsl(210, 40%, 98%)' : 'hsl(222.2, 84%, 10%)',
                    'border': `1px solid ${isDarkMode ? 'hsl(0, 0%, 20%)' : 'hsl(0, 0%, 85%)'}`,
                    'border-radius': '8px',
                    'font-size': '13px',
                    'white-space': 'nowrap',
                    'box-shadow': '0 2px 8px rgba(0,0,0,0.15)',
                    'backdrop-filter': 'blur(5px)',
                    '-webkit-backdrop-filter': 'blur(5px)',
                    'transition': 'all 0.2s ease-in-out',
                    // 确保标签始终可见
                    'pointer-events': 'auto',
                }
            });

            // --- 6. 创建信息窗体实例 ---
            const infoWindow = new AMap.InfoWindow({
                isCustom: true,
                anchor: 'bottom-center',
                content: infoWindowElement,
                offset: new AMap.Pixel(0, -40)
            });

            marker.on('click', () => {
                if (activeInfoWindowRef.current) {
                    activeInfoWindowRef.current.close();
                }
                infoWindow.open(mapInstance, marker.getPosition());
                activeInfoWindowRef.current = infoWindow;

                // 设置当前活动的InfoWindow，用于Portal渲染
                setActiveInfoWindow({ restaurant, element: infoWindowElement });
            });

            newMarkers.push(marker);
            newMarkers.push(textLabel); // 将文本标签也加入管理
        });

        markersRef.current = newMarkers
        mapInstance.setFitView(newMarkers)
    }, [restaurants, mapInstance, AMap, isMapReady]); // Add isMapReady to dependency array


    return (
        <>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

            {/* 使用Portal渲染InfoWindow内容 */}
            {activeInfoWindow && createPortal(
                <InfoWindowContent
                    restaurant={activeInfoWindow.restaurant}
                    isDarkMode={mapStyle.includes('dark')}
                />,
                activeInfoWindow.element
            )}
        </>
    )
}

export default Amap
