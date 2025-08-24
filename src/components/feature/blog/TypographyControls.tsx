"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Type,
    Plus,
    Minus,
    RotateCcw,
    Settings
} from "lucide-react";
import { cn } from "@/lib/shared/utils";

interface TypographyControlsProps {
    className?: string;
}

interface TypographySettings {
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    letterSpacing: number;
}

const DEFAULT_VALUE = {
    fontSize: 18,
    fontFamily: "font-blog",
    lineHeight: 1.4,
    letterSpacing: 0,
}

const VALUE_RANGE = {
    fontSize: {
        min: 12,
        max: 30,
        step: 1,
    },
    lineHeight: {
        min: 1.2,
        max: 1.8,
    },
    letterSpacing: {
        min: -1,
        max: 1,
        step: 0.2,
    },
}

const FONT_FAMILIES = [
    { value: "font-blog", label: "霞鹜文楷", preview: "霞鹜文楷", actualFont: "var(--font-bookerly), var(--font-lxgw-wenkai), serif" },
    { value: "font-sans", label: "无衬线字体", preview: "无衬线字体", actualFont: "ui-sans-serif, system-ui, sans-serif" },
    { value: "font-serif", label: "衬线字体", preview: "衬线字体", actualFont: "ui-serif, Georgia, serif" },
    { value: "font-mono", label: "等宽字体", preview: "等宽字体", actualFont: "ui-monospace, SFMono-Regular, monospace" },
];


const LINE_HEIGHTS = [
    { value: 1.2, label: "紧凑" },
    { value: 1.4, label: "标准" },
    { value: 1.6, label: "宽松" },
    { value: 1.8, label: "很宽松" },
];

export function TypographyControls({ className }: TypographyControlsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState<TypographySettings>({
        ...DEFAULT_VALUE,
    });
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    // 从localStorage加载设置
    useEffect(() => {
        const savedSettings = localStorage.getItem("blog-typography-settings");
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(parsed);
                applySettings(parsed);
            } catch (error) {
                console.error("Failed to parse typography settings:", error);
            }
        }
    }, []);

    // 点击外部区域关闭面板
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                panelRef.current &&
                buttonRef.current &&
                !panelRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // 应用字体设置到页面
    const applySettings = (newSettings: TypographySettings) => {
        const root = document.documentElement;

        // 应用字体大小
        root.style.setProperty("--blog-font-size", `${newSettings.fontSize}px`);

        // 应用字体族 - 需要找到对应的实际字体值
        const selectedFont = FONT_FAMILIES.find(font => font.value === newSettings.fontFamily);
        if (selectedFont) {
            root.style.setProperty("--blog-font-family", selectedFont.actualFont);
        }

        // 应用行高
        root.style.setProperty("--blog-line-height", newSettings.lineHeight.toString());

        // 应用字母间距
        root.style.setProperty("--blog-letter-spacing", `${newSettings.letterSpacing}px`);

        // 保存到localStorage
        localStorage.setItem("blog-typography-settings", JSON.stringify(newSettings));
    };

    // 更新设置
    const updateSetting = <K extends keyof TypographySettings>(
        key: K,
        value: TypographySettings[K]
    ) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        applySettings(newSettings);
    };

    // 重置设置
    const resetSettings = () => {
        const defaultSettings: TypographySettings = {
            ...DEFAULT_VALUE,
        };
        setSettings(defaultSettings);
        applySettings(defaultSettings);
    };

    // 增加字体大小
    const increaseFontSize = () => {
        const newSize = Math.min(settings.fontSize + VALUE_RANGE.fontSize.step, VALUE_RANGE.fontSize.max);
        updateSetting("fontSize", newSize);
    };

    // 减少字体大小
    const decreaseFontSize = () => {
        const newSize = Math.max(settings.fontSize - VALUE_RANGE.fontSize.step, VALUE_RANGE.fontSize.min);
        updateSetting("fontSize", newSize);
    };

    return (
        <div className={cn("fixed top-6 right-6 z-40", className)}>
            {/* 主按钮 */}
            <motion.div
                onClick={() => setIsOpen(!isOpen)}
                // className="relative w-12 h-12 bg-background/90 backdrop-blur-sm border border-border/30 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="字体设置"
                ref={buttonRef}
            >
                <Type className="w-5 h-5 mx-auto text-foreground group-hover:text-primary transition-colors" />

                {/* 设置指示器 */}
                {(settings.fontSize !== DEFAULT_VALUE.fontSize || settings.fontFamily !== DEFAULT_VALUE.fontFamily || settings.lineHeight !== DEFAULT_VALUE.lineHeight || settings.letterSpacing !== DEFAULT_VALUE.letterSpacing) && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
            </motion.div>

            {/* 控制面板 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        className="absolute top-6 right-0 w-80 bg-background/95 backdrop-blur-md border border-border/30 rounded-2xl shadow-2xl p-6"
                        ref={panelRef}
                    >
                        {/* 面板标题 */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                字体设置
                            </h3>
                            <button
                                onClick={resetSettings}
                                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                                title="重置设置"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>

                        {/* 字体大小控制 */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-3">
                                    字体大小
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={decreaseFontSize}
                                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
                                        disabled={settings.fontSize <= VALUE_RANGE.fontSize.min}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>

                                    <div className="flex-1 text-center">
                                        <span className="text-lg font-semibold text-foreground">
                                            {settings.fontSize}px
                                        </span>
                                    </div>

                                    <button
                                        onClick={increaseFontSize}
                                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
                                        disabled={settings.fontSize >= VALUE_RANGE.fontSize.max}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* 字体族选择 */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-3">
                                    字体族
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {FONT_FAMILIES.map((font) => (
                                        <button
                                            key={font.value}
                                            onClick={() => updateSetting("fontFamily", font.value)}
                                            className={cn(
                                                "p-3 rounded-lg border transition-all duration-200 text-left",
                                                settings.fontFamily === font.value
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                            )}
                                        >
                                            <div className="text-sm font-medium">{font.label}</div>
                                            <div
                                                className="text-xs text-muted-foreground mt-1"
                                                style={{ fontFamily: font.actualFont }}
                                            >
                                                {font.preview}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 行高控制 */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-3">
                                    行高
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {LINE_HEIGHTS.map((lh) => (
                                        <button
                                            key={lh.value}
                                            onClick={() => updateSetting("lineHeight", lh.value)}
                                            className={cn(
                                                "p-2 rounded-lg border transition-all duration-200",
                                                settings.lineHeight === lh.value
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                            )}
                                        >
                                            <span className="text-sm">{lh.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 字母间距控制 */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-3">
                                    字母间距
                                </label>
                                <input
                                    type="range"
                                    min={VALUE_RANGE.letterSpacing.min}
                                    max={VALUE_RANGE.letterSpacing.max}
                                    step={VALUE_RANGE.letterSpacing.step}
                                    value={settings.letterSpacing}
                                    onChange={(e) => updateSetting("letterSpacing", parseFloat(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>{VALUE_RANGE.letterSpacing.min}px</span>
                                    <span>{settings.letterSpacing}px</span>
                                    <span>{VALUE_RANGE.letterSpacing.max}px</span>
                                </div>
                            </div>
                        </div>

                        {/* 关闭按钮 */}
                        <div className="mt-6 pt-4 border-t border-border/30">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full py-2 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
                            >
                                关闭
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default TypographyControls;
