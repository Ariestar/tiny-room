"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    Coffee,
    BookOpen,
    Code,
    Music,
    Camera,
    Gamepad2,
    Palette,
    Brain,
    Zap,
    Star,
    Clock
} from "lucide-react";

interface PersonalStatusProps {
    className?: string;
}

// 当前心情状态
const moodStates = [
    { emoji: "😊", text: "心情愉快", color: "text-yellow-500", bg: "bg-yellow-50" },
    { emoji: "🚀", text: "充满干劲", color: "text-blue-500", bg: "bg-blue-50" },
    { emoji: "🤔", text: "思考中", color: "text-purple-500", bg: "bg-purple-50" },
    { emoji: "☕", text: "需要咖啡", color: "text-amber-500", bg: "bg-amber-50" },
    { emoji: "🎵", text: "音乐模式", color: "text-pink-500", bg: "bg-pink-50" },
    { emoji: "💡", text: "灵感爆发", color: "text-green-500", bg: "bg-green-50" },
];

// 正在学习的技术
const learningTopics = [
    { icon: Code, text: "Next.js 15", progress: 85, color: "text-blue-600" },
    { icon: Brain, text: "AI/ML", progress: 60, color: "text-purple-600" },
    { icon: Palette, text: "UI/UX设计", progress: 75, color: "text-pink-600" },
    { icon: Camera, text: "摄影技巧", progress: 40, color: "text-green-600" },
];

// 兴趣爱好
const hobbies = [
    { icon: Music, text: "音乐制作", level: "中级" },
    { icon: Camera, text: "摄影", level: "进阶" },
    { icon: BookOpen, text: "阅读", level: "资深" },
    { icon: Gamepad2, text: "游戏", level: "休闲" },
    { icon: Coffee, text: "咖啡品鉴", level: "专家" },
];

// 有趣的个人事实
const personalFacts = [
    "🎯 已连续编程 1337 天",
    "☕ 今年已喝掉 247 杯咖啡",
    "📚 正在阅读第 23 本技术书籍",
    "🌙 最喜欢在深夜 2-4 点编程",
    "🎵 编程时听过 10000+ 首歌",
    "🐛 修复了 999+ 个 bug",
    "💡 有 42 个未完成的项目想法",
    "🎨 收藏了 500+ 个设计灵感",
];

export function PersonalStatus({ className = "" }: PersonalStatusProps) {
    const [currentMood, setCurrentMood] = useState(0);
    const [currentFact, setCurrentFact] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // 定期切换心情状态
    useEffect(() => {
        const moodInterval = setInterval(() => {
            setCurrentMood((prev) => (prev + 1) % moodStates.length);
        }, 5000);

        return () => clearInterval(moodInterval);
    }, []);

    // 定期切换个人事实
    useEffect(() => {
        const factInterval = setInterval(() => {
            setCurrentFact((prev) => (prev + 1) % personalFacts.length);
        }, 8000);

        return () => clearInterval(factInterval);
    }, []);

    // 组件可见性动画
    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`space-y-8 ${className}`}>
            {/* 当前状态卡片 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                        当前状态
                    </h3>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">在线</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 心情状态 */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">😊 当前心情</h4>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentMood}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full ${moodStates[currentMood].bg}`}
                            >
                                <span className="text-lg">{moodStates[currentMood].emoji}</span>
                                <span className={`text-sm font-medium ${moodStates[currentMood].color}`}>
                                    {moodStates[currentMood].text}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* 活动状态 */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">⚡ 当前活动</h4>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-600">正在写代码</span>
                            <div className="flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 h-1 bg-blue-500 rounded-full"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 正在学习 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                    正在学习
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningTopics.map((topic, index) => (
                        <motion.div
                            key={topic.text}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <topic.icon className={`w-4 h-4 ${topic.color}`} />
                                    <span className="text-sm font-medium text-gray-700">{topic.text}</span>
                                </div>
                                <span className="text-xs text-gray-500">{topic.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                    className={`h-2 rounded-full bg-gradient-to-r ${topic.color.includes('blue') ? 'from-blue-400 to-blue-600' :
                                            topic.color.includes('purple') ? 'from-purple-400 to-purple-600' :
                                                topic.color.includes('pink') ? 'from-pink-400 to-pink-600' :
                                                    'from-green-400 to-green-600'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${topic.progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* 兴趣爱好 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-6 border border-pink-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    兴趣爱好
                </h3>
                <div className="flex flex-wrap gap-3">
                    {hobbies.map((hobby, index) => (
                        <motion.div
                            key={hobby.text}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white rounded-xl p-3 shadow-sm border border-gray-200/50 flex items-center space-x-2 cursor-pointer"
                        >
                            <hobby.icon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">{hobby.text}</span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                {hobby.level}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* 有趣的事实 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    有趣的事实
                </h3>
                <div className="min-h-[60px] flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentFact}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="text-gray-700 text-lg font-medium"
                        >
                            {personalFacts[currentFact]}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                        {personalFacts.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentFact ? 'bg-yellow-500' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}