'use client'

import { useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Restaurant } from '../../../types/foodmap'

interface AmapProps {
    restaurants: Restaurant[]
    mapStyle: string
    showSatellite: boolean
}

// Set security token at the module level to ensure it's available before loader execution
if (typeof window !== 'undefined') {
    window._AMapSecurityConfig = {
        securityJsCode: process.env.NEXT_PUBLIC_AMAP_TOKEN || '',
    }
}

declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string,
        },
    }
}

const Amap = ({ restaurants, mapStyle, showSatellite }: AmapProps) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const [mapInstance, setMapInstance] = useState<any>(null)
    const [AMap, setAMap] = useState<any>(null)
    const [isMapReady, setIsMapReady] = useState(false); // New state for map readiness
    const markersRef = useRef<any[]>([])
    const satelliteLayerRef = useRef<any>(null)
    const activeInfoWindowRef = useRef<any>(null)

    useEffect(() => {
        console.log("Reading AMAP Key:", process.env.NEXT_PUBLIC_AMAP_KEY);
        console.log("Reading AMAP Security Token:", process.env.NEXT_PUBLIC_AMAP_SECURITY_TOKEN);

        AMapLoader.load({
            key: process.env.NEXT_PUBLIC_AMAP_KEY || '',
            version: '2.0',
            plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.TileLayer.Satellite', 'AMap.Text'], // 加载 AMap.Text 插件
        })
            .then(loadedAMap => {
                setAMap(loadedAMap)
                if (mapRef.current) {
                    const map = new loadedAMap.Map(mapRef.current, {
                        zoom: 12,
                        center: [116.4074, 39.9042],
                        mapStyle: mapStyle,
                        preserveDrawingBuffer: true,
                    })

                    map.on('complete', () => {
                        setIsMapReady(true); // Set map ready state on 'complete' event
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
        const wgs84Coords: [number, number][] = restaurants.map(r => [r.coordinates[1], r.coordinates[0]])

        AMap.convertFrom(wgs84Coords, 'gps', (status: string, result: any) => {
            if (status === 'complete' && result.info === 'ok') {
                result.locations.forEach((gcj02Coord: any, index: number) => {
                    const restaurant = restaurants[index];
                    const isDarkMode = mapStyle.includes('dark');

                    // --- 1. 定义所有需要的样式 ---
                    const styles = {
                        infoContainer: `
                            background-color: ${isDarkMode ? 'hsl(0, 0%, 10%)' : 'hsl(0, 0%, 99%)'};
                            color: ${isDarkMode ? 'hsl(210, 40%, 98%)' : 'hsl(222.2, 84%, 10%)'};
                            padding: 16px; border-radius: 12px; width: 320px;
                            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                            border: 1px solid ${isDarkMode ? 'hsl(0, 0%, 14.9%)' : 'hsl(0, 0%, 89.8%)'};
                            font-family: 'Inter', sans-serif;
                        `,
                        title: `font-weight: 600; font-size: 18px; margin-bottom: 4px;`,
                        address: `font-size: 13px; color: ${isDarkMode ? 'hsl(0, 0%, 62.9%)' : 'hsl(0, 0%, 45.1%)'}; margin-bottom: 12px;`,
                        detailsGrid: `display: grid; grid-template-columns: auto 1fr; gap: 8px; align-items: center; font-size: 14px; margin-bottom: 12px;`,
                        icon: `display: inline-block; width: 1.5em; text-align: center;`,
                        description: `margin-top: 12px; font-size: 14px; line-height: 1.6; color: ${isDarkMode ? 'hsl(0, 0%, 80%)' : 'hsl(0, 0%, 30%)'}; border-top: 1px solid ${isDarkMode ? 'hsl(0, 0%, 14.9%)' : 'hsl(0, 0%, 89.8%)'}; padding-top: 12px;`,
                        tagsContainer: `display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px;`,
                        tag: `background-color: ${isDarkMode ? 'hsla(0, 0%, 98%, 0.1)' : 'hsla(0, 0%, 9%, 0.05)'}; color: ${isDarkMode ? 'hsl(0, 0%, 80%)' : 'hsl(0, 0%, 30%)'}; padding: 3px 10px; border-radius: 99px; font-size: 12px;`,
                    };

                    // --- 2. 构建详细的信息窗体内容 ---
                    const detailRow = (icon: string, content: string | number | undefined | null, isLink = false, linkPrefix = '') => {
                        if (!content) return '';
                        const contentHtml = isLink ? `<a href="${linkPrefix}${content}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">${content}</a>` : content;
                        return `<div><span style="${styles.icon}">${icon}</span></div><div>${contentHtml}</div>`;
                    };

                    const infoWindowContent = `
                        <div style="${styles.infoContainer}">
                            <h3 style="${styles.title}">${restaurant.name}</h3>
                            <p style="${styles.address}">${restaurant.address}</p>
                            <div style="${styles.detailsGrid}">
                                ${detailRow('⭐', restaurant.rating ? `${restaurant.rating} / 5.0` : null)}
                                ${detailRow('💰', restaurant.priceRange)}
                                ${detailRow('🕒', restaurant.openingHours)}
                                ${detailRow('📞', restaurant.phone, true, 'tel:')}
                                ${detailRow('🌐', restaurant.website, true, restaurant.website || '')}
                            </div>
                            ${restaurant.tags && restaurant.tags.length > 0 ? `<div style="${styles.tagsContainer}">${restaurant.tags.map((tag: string) => `<span style="${styles.tag}">${tag}</span>`).join('')}</div>` : ''}
                            ${restaurant.description ? `<p style="${styles.description}">${restaurant.description}</p>` : ''}
                        </div>
                    `;

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
                    });

                    // --- 5. 创建独立的文本标签 (AMap.Text) ---
                    const textLabel = new AMap.Text({
                        text: restaurant.name,
                        position: gcj02Coord,
                        map: mapInstance,
                        offset: new AMap.Pixel(15, -10), // 微调位置
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
                        }
                    });

                    // --- 6. 创建信息窗体实例 ---
                    const infoWindow = new AMap.InfoWindow({
                        isCustom: true,
                        anchor: 'bottom-center',
                        content: infoWindowContent,
                        offset: new AMap.Pixel(0, -40)
                    });

                    marker.on('click', () => {
                        if (activeInfoWindowRef.current) {
                            activeInfoWindowRef.current.close();
                        }
                        infoWindow.open(mapInstance, marker.getPosition());
                        activeInfoWindowRef.current = infoWindow;
                    });

                    newMarkers.push(marker);
                    newMarkers.push(textLabel); // 将文本标签也加入管理
                });

                markersRef.current = newMarkers
                mapInstance.setFitView(newMarkers)
            } else {
                console.error('坐标转换失败', result);
            }
        });
    }, [restaurants, mapInstance, AMap, isMapReady]); // Add isMapReady to dependency array


    return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}

export default Amap
