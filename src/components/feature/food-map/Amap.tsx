'use client'

import { useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Restaurant } from '@/types/food-map'

interface AmapComponentProps {
    restaurants: Restaurant[]
    mapStyle: string
    showSatellite: boolean
}

// Set security token at the module level to ensure it's available before loader execution
if (typeof window !== 'undefined') {
    window._AMapSecurityConfig = {
        securityJsCode: process.env.NEXT_PUBLIC_AMAP_SECURITY_TOKEN || '',
    }
}

declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string,
        },
    }
}

const AmapComponent = ({ restaurants, mapStyle, showSatellite }: AmapComponentProps) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const [mapInstance, setMapInstance] = useState<any>(null)
    const [AMap, setAMap] = useState<any>(null)
    const markersRef = useRef<any[]>([])
    const satelliteLayerRef = useRef<any>(null)

    useEffect(() => {
        console.log("Reading AMAP Key:", process.env.NEXT_PUBLIC_AMAP_KEY);
        console.log("Reading AMAP Security Token:", process.env.NEXT_PUBLIC_AMAP_SECURITY_TOKEN);

        AMapLoader.load({
            key: process.env.NEXT_PUBLIC_AMAP_KEY || '',
            version: '2.0',
            plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.TileLayer.Satellite'],
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
        if (!mapInstance || !AMap) {
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

                    const content = `
                        <div class="p-3 bg-background text-foreground rounded-lg shadow-lg" style="width: 280px;">
                            <h3 class="font-bold text-base mb-1">${restaurant.name}</h3>
                            <p class="text-xs text-muted-foreground mb-2">${restaurant.address}</p>
                            <span class="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">${restaurant.category}</span>
                        </div>
                    `;

                    const marker = new AMap.Marker({
                        position: gcj02Coord,
                        map: mapInstance,
                    });

                    const infoWindow = new AMap.InfoWindow({
                        content: content,
                        offset: new AMap.Pixel(0, -30)
                    });

                    marker.on('click', () => {
                        infoWindow.open(mapInstance, marker.getPosition());
                    });

                    newMarkers.push(marker);
                });

                markersRef.current = newMarkers
                mapInstance.setFitView() // 自动调整视野
            } else {
                console.error('坐标转换失败', result);
            }
        });
    }, [restaurants, mapInstance, AMap]);


    return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}

export default AmapComponent
