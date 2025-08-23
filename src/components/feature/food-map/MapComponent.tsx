'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { Restaurant } from '@/types/food-map'
import { MapPin, Star, Clock, Phone, Globe } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// 修复 leaflet 图标问题
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
    restaurants: Restaurant[]
    mapStyle: 'light' | 'dark' | 'satellite'
}

// 自定义美食图标
const createFoodIcon = (category: string) => {
    const getIconData = (cat: string) => {
        switch (cat) {
            case '川菜': return { emoji: '🌶️', color: '#ef4444' }
            case '北京菜': return { emoji: '🥟', color: '#3b82f6' }
            case '火锅': return { emoji: '🍲', color: '#f59e0b' }
            case '小笼包': return { emoji: '🥟', color: '#10b981' }
            case '麻辣小龙虾': return { emoji: '🦞', color: '#dc2626' }
            default: return { emoji: '🍽️', color: '#6b7280' }
        }
    }

    const { emoji, color } = getIconData(category)

    return new Icon({
        iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
        <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" fill="${color}" stroke="#fff" stroke-width="2"/>
        <text x="16" y="20" font-size="14" text-anchor="middle" fill="white">${emoji}</text>
      </svg>
    `)}`,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
    })
}

export default function MapComponent({ restaurants, mapStyle }: MapComponentProps) {
    // 地图样式选项
    const mapStyles = {
        light: {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        dark: {
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        },
        satellite: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &copy; Earthstar Geographics'
        }
    }

    return (
        <div className="h-full w-full [&_.leaflet-container]:font-sans [&_.leaflet-popup-content-wrapper]:rounded-lg [&_.leaflet-popup-content-wrapper]:border-none [&_.leaflet-popup-content-wrapper]:shadow-lg [&_.leaflet-popup-content]:m-0 [&_.leaflet-popup-content]:p-0 [&_.leaflet-popup-tip]:border-none [&_.leaflet-control-zoom]:border-none [&_.leaflet-control-zoom]:shadow-md [&_.leaflet-control-zoom_a]:bg-background [&_.leaflet-control-zoom_a]:text-foreground [&_.leaflet-control-zoom_a]:border [&_.leaflet-control-zoom_a]:border-border [&_.leaflet-control-zoom_a]:transition-colors [&_.leaflet-control-zoom_a:hover]:bg-accent [&_.leaflet-control-zoom_a:hover]:text-accent-foreground [&_.leaflet-marker-icon]:transition-transform [&_.leaflet-marker-icon]:cursor-pointer [&_.leaflet-marker-icon:hover]:scale-110 [&_.leaflet-marker-icon:hover]:z-[1000]">
            <MapContainer
                center={[39.9042, 116.4074]}
                zoom={13}
                className="h-full w-full"
                zoomControl={true}
            >
                <TileLayer
                    key={mapStyle}
                    url={mapStyles[mapStyle].url}
                    attribution={mapStyles[mapStyle].attribution}
                />

                {restaurants.map((restaurant) => (
                    <Marker
                        key={restaurant.id}
                        position={restaurant.coordinates}
                        icon={createFoodIcon(restaurant.category)}
                    >
                        <Popup className="custom-popup" maxWidth={320}>
                            <div className="p-4 bg-background text-foreground">
                                {/* 餐厅头部 */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">
                                            {restaurant.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                                                {restaurant.category}
                                            </span>
                                            {restaurant.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                    <span className="text-sm font-medium">{restaurant.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 餐厅信息 */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{restaurant.address}</span>
                                    </div>

                                    {restaurant.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="text-muted-foreground">{restaurant.phone}</span>
                                        </div>
                                    )}

                                    {restaurant.openingHours && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="text-muted-foreground">{restaurant.openingHours}</span>
                                        </div>
                                    )}

                                    {restaurant.priceRange && (
                                        <div className="text-muted-foreground">
                                            💰 人均消费: {restaurant.priceRange}
                                        </div>
                                    )}

                                    {restaurant.description && (
                                        <div className="text-foreground bg-muted p-2 rounded text-sm leading-relaxed">
                                            {restaurant.description}
                                        </div>
                                    )}

                                    {restaurant.tags && (
                                        <div className="flex flex-wrap gap-1 pt-2">
                                            {restaurant.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {restaurant.website && (
                                        <div className="pt-2">
                                            <a
                                                href={restaurant.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm transition-colors"
                                            >
                                                <Globe className="h-4 w-4" />
                                                访问官网
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
