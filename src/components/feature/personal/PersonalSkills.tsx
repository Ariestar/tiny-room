"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Code2,
    Server,
    Palette,
    GitBranch,
    Trophy,
    Target,
    MapPin,
    Clock,
    Zap,
    Globe
} from "lucide-react";

interface PersonalSkillsProps {
    className?: string;
}

// 技能数据
const skillCategories = [
    {
        title: "前端开发",
        icon: Code2,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        skills: [
            { name: "React/Next.js", level: 95, experience: "3年+" },
            { name: "TypeScript", level: 90, experience: "2年+" },
            { name: "Tailwind CSS", level: 88, experience: "2年+" },
            { name: "Framer Motion", level: 85, experience: "1年+" },
        ]
    },
    {
        title: "后端开发",
        icon: Server,
        color: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        skills: [
            { name: "Node.js", level: 85, experience: "2年+" },
            { name: "Python", level: 80, experience: "3年+" },
            { name: "PostgreSQL", level: 75, experience: "2年+" },
            { name: "API设计", level: 88, experience: "2年+" },
        ]
    }
];

// 当前位置和状态数据
const locationData = {
    city: "北京",
    country: "中国",
    timezone: "GMT+8",
    weather: "☀️ 晴朗",
    temperature: "22°C"
};

// 成就数据
const achievements = [
    { icon: Trophy, text: "完成 50+ 个项目", color: "text-yellow-500" },
    { icon: Target, text: "代码质量评分 A+", color: "text-green-500" },
    { icon: Zap, text: "性能优化专家", color: "text-blue-500" },
    { icon: Globe, text: "全栈开发能力", color: "text-purple-500" },
];

export function PersonalSkills({ className = "" }: PersonalSkillsProps) {
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [currentTime, setCurrentTime] = useState("");

    // 更新当前时间
    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString('zh-CN', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            }));
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`space-y-8 ${className}`}>
            {/* 当前位置和状态 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-cyan-500" />
                    当前位置与状态
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">📍 位置</div>
                        <div className="font-medium text-gray-800">{locationData.city}, {locationData.country}</div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">🕐 本地时间</div>
                        <div className="font-medium text-gray-800 font-mono">{currentTime}</div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">🌤️ 天气</div>
                        <div className="font-medium text-gray-800">{locationData.weather} {locationData.temperature}</div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">⏰ 时区</div>
                        <div className="font-medium text-gray-800">{locationData.timezone}</div>
                    </div>
                </div>
            </motion.div>

            {/* 技能展示 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Code2 className="w-5 h-5 mr-2 text-blue-500" />
                    技能专长
                </h3>

                {/* 技能分类选择 */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {skillCategories.map((category, index) => (
                        <motion.button
                            key={category.title}
                            onClick={() => setSelectedCategory(index)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${selectedCategory === index
                                ? `${category.bgColor} ${category.color} ${category.borderColor} border-2`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <category.icon className="w-4 h-4" />
                            <span>{category.title}</span>
                        </motion.button>
                    ))}
                </div>

                {/* 选中分类的技能详情 */}
                <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                >
                    {skillCategories[selectedCategory].skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-800">{skill.name}</span>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                        {skill.experience}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-600">{skill.level}%</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                    className={`h-2 rounded-full bg-gradient-to-r ${skillCategories[selectedCategory].color.includes('blue') ? 'from-blue-400 to-blue-600' :
                                        'from-green-400 to-green-600'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* 成就展示 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    主要成就
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={achievement.text}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-3 cursor-pointer"
                        >
                            <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                            <span className="font-medium text-gray-700">{achievement.text}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}