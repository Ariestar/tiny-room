"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Calendar, Coffee, Heart, Sparkles, ChevronDown } from "lucide-react";
import { PersonalStatus } from "./PersonalStatus";
import { PersonalSkills } from "./PersonalSkills";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "@/components/animation/ScrollReveal";

interface PersonalIntroProps {
    className?: string;
}

export function PersonalIntro({ className = "" }: PersonalIntroProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`relative ${className}`}>
            {/* 背景装饰 */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-xl" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl" />
            </div>

            {/* 头像和问候区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
                {/* 左侧：头像 */}
                <ScrollReveal
                    animation="slideInLeft"
                    className="lg:col-span-5 flex flex-col items-center lg:items-start"
                >
                    {/* 创意头像 */}
                    <div className="relative">
                        <motion.div
                            className="relative"
                            onHoverStart={() => setIsHovered(true)}
                            onHoverEnd={() => setIsHovered(false)}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {/* 动画边框 */}
                            <motion.div
                                className="absolute -inset-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
                                animate={{
                                    rotate: isHovered ? 360 : 0,
                                }}
                                transition={{
                                    duration: isHovered ? 2 : 0,
                                    ease: "linear",
                                    repeat: isHovered ? Infinity : 0,
                                }}
                                style={{
                                    background: isHovered
                                        ? "conic-gradient(from 0deg, #ec4899, #8b5cf6, #06b6d4, #ec4899)"
                                        : "linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)",
                                }}
                            />

                            {/* 头像容器 */}
                            <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-white p-1">
                                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    <Image
                                        src="/images/avatar.svg"
                                        alt="个人头像"
                                        width={160}
                                        height={160}
                                        className="w-full h-full object-cover"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* 装饰性图标 */}
                            <motion.div
                                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                                animate={{
                                    y: isHovered ? [-2, 2, -2] : 0,
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: isHovered ? Infinity : 0,
                                    ease: "easeInOut",
                                }}
                            >
                                <Sparkles className="w-4 h-4 text-white" />
                            </motion.div>
                        </motion.div>
                    </div>
                </ScrollReveal>

                {/* 右侧：问候标题 */}
                <ScrollReveal
                    animation="slideInRight"
                    delay={200}
                    className="lg:col-span-7"
                >
                    <div className="space-y-4">
                        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            嗨，我是 Tiny Room 👋
                        </h2>
                        <p className="text-lg text-gray-600">
                            一个热爱代码和创意的数字工匠
                        </p>
                    </div>
                </ScrollReveal>
            </div>

            {/* 基本信息区域 */}
            <ScrollReveal animation="fadeInUp" className="mb-16">
                <div className="max-w-md mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                        <ScrollRevealContainer className="space-y-3">
                            <ScrollRevealItem>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm">📍 地球某个角落</span>
                                </div>
                            </ScrollRevealItem>
                            <ScrollRevealItem>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Calendar className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">🎂 永远18岁</span>
                                </div>
                            </ScrollRevealItem>
                            <ScrollRevealItem>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Coffee className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm">☕ 咖啡驱动的程序员</span>
                                </div>
                            </ScrollRevealItem>
                            <ScrollRevealItem>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    <span className="text-sm">❤️ 热爱创造美好事物</span>
                                </div>
                            </ScrollRevealItem>
                        </ScrollRevealContainer>
                    </div>
                </div>
            </ScrollReveal>

            {/* 自我介绍区域 */}
            <ScrollReveal animation="fadeInUp" className="mb-16">
                <div className="max-w-4xl mx-auto">
                    <ScrollRevealContainer className="space-y-6 text-gray-700 leading-relaxed">
                        <ScrollRevealItem>
                            <p className="text-base lg:text-lg text-center">
                                🚀 我是一个相信<span className="font-semibold text-purple-600">代码可以改变世界</span>的理想主义者，
                                同时也是一个知道<span className="font-semibold text-blue-600">bug永远存在</span>的现实主义者。
                            </p>
                        </ScrollRevealItem>

                        <ScrollRevealItem>
                            <p className="text-base lg:text-lg text-center">
                                💡 白天我写代码，晚上我写博客，周末我拍照片。
                                偶尔会思考人生，但更多时候在思考为什么这个CSS不居中。
                            </p>
                        </ScrollRevealItem>

                        <ScrollRevealItem>
                            <p className="text-base lg:text-lg text-center">
                                🎯 我的人生目标是：<span className="font-semibold text-green-600">让技术更有温度</span>，
                                让创意更有价值，让生活更有趣味。
                            </p>
                        </ScrollRevealItem>
                    </ScrollRevealContainer>
                </div>
            </ScrollReveal>

            {/* 有趣的事实区域 */}
            <ScrollReveal animation="scaleIn" className="mb-16">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200/50">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center">
                            <span className="mr-2">🎪</span>
                            有趣的事实
                        </h3>
                        <ScrollRevealContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <ScrollRevealItem>
                                <div className="flex items-center space-x-2">
                                    <span>🍕</span>
                                    <span>披萨是我的第二编程语言</span>
                                </div>
                            </ScrollRevealItem>
                            <ScrollRevealItem>
                                <div className="flex items-center space-x-2">
                                    <span>🌙</span>
                                    <span>夜猫子，最佳工作时间是深夜</span>
                                </div>
                            </ScrollRevealItem>
                            <ScrollRevealItem>
                                <div className="flex items-center space-x-2">
                                    <span>🎵</span>
                                    <span>编程时必须听音乐</span>
                                </div>
                            </ScrollRevealItem>
                            <ScrollRevealItem>
                                <div className="flex items-center space-x-2">
                                    <span>📚</span>
                                    <span>技术书籍收集爱好者</span>
                                </div>
                            </ScrollRevealItem>
                        </ScrollRevealContainer>
                    </div>
                </div>
            </ScrollReveal>

            {/* 展开更多信息按钮 */}
            <ScrollReveal animation="fadeIn">
                <div className="flex justify-center">
                    <motion.button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>{isExpanded ? "收起详情" : "了解更多"}</span>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </motion.div>
                    </motion.button>
                </div>
            </ScrollReveal>

            {/* 展开的详细信息区域 */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="mt-12 overflow-hidden"
                    >
                        <div className="border-t border-gray-200 pt-12 space-y-12">
                            <ScrollReveal animation="fadeInUp" delay={200}>
                                <PersonalStatus />
                            </ScrollReveal>
                            <ScrollReveal animation="fadeInUp" delay={400}>
                                <PersonalSkills />
                            </ScrollReveal>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}