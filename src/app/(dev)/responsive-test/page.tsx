"use client";

import { useState } from "react";
import { DeviceCompatibilityTester } from "@/components/dev/DeviceCompatibilityTester";
import { TouchInteractionTester } from "@/components/dev/TouchInteractionTester";
import { AnimationPerformanceTester } from "@/components/dev/AnimationPerformanceTester";

type TestTab = "device" | "touch" | "animation";

export default function ResponsiveTestPage() {
    const [activeTab, setActiveTab] = useState<TestTab>("device");

    const tabs = [
        { id: "device" as TestTab, name: "设备兼容性", description: "测试不同屏幕尺寸下的布局" },
        { id: "touch" as TestTab, name: "触摸交互", description: "测试触摸目标的可用性" },
        { id: "animation" as TestTab, name: "动画性能", description: "测试动画在移动端的流畅性" }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 导航标签 */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <div className="text-left">
                                    <div>{tab.name}</div>
                                    <div className="text-xs text-gray-400 mt-1">{tab.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 测试内容 */}
            <div className="py-6">
                {activeTab === "device" && <DeviceCompatibilityTester />}
                {activeTab === "touch" && <TouchInteractionTester />}
                {activeTab === "animation" && <AnimationPerformanceTester />}
            </div>
        </div>
    );
}