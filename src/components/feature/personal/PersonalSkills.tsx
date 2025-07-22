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
import { ScrollRevealContainer, ScrollRevealItem } from "@/components/animation/ScrollReveal";

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
        <div className={`space-y-8 ${className} mobile-skills-container`}>
            {/* 当前位置和状态 */}
            <ScrollRevealContainer>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center mobile-text-optimized">
                    <MapPin className="w-5 h-5 mr-2 text-cyan-500 flex-shrink-0" />
                    当前位置与状态
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">📍 位置</div>
                        <div className="font-medium text-gray-800 text-sm sm:text-base mobile-text-optimized">{locationData.city}, {locationData.country}</div>
                    </div>

                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">🕐 本地时间</div>
                        <div className="font-medium text-gray-800 font-mono text-sm sm:text-base mobile-text-optimized">{currentTime}</div>
                    </div>

                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">🌤️ 天气</div>
                        <div className="font-medium text-gray-800 text-sm sm:text-base mobile-text-optimized">{locationData.weather} {locationData.temperature}</div>
                    </div>

                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">⏰ 时区</div>
                        <div className="font-medium text-gray-800 text-sm sm:text-base mobile-text-optimized">{locationData.timezone}</div>
                    </div>
                </div>
            </ScrollRevealContainer>

            {/* 技能展示 */}
            <ScrollRevealContainer>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center mobile-text-optimized">
                    <Code2 className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
                    技能专长
                </h3>

                {/* 技能分类选择 */}
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 mobile-skill-categories">
                    {skillCategories.map((category, index) => (
                        <motion.button
                            key={category.title}
                            onClick={() => setSelectedCategory(index)}
                            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base mobile-skill-category-button touch-target ${selectedCategory === index
                                ? `${category.bgColor} ${category.color} ${category.borderColor} border-2`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <category.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="mobile-text-optimized">{category.title}</span>
                        </motion.button>
                    ))}
                </div>

                {/* 选中分类的技能详情 */}
                <ScrollRevealItem className="space-y-4 sm:space-y-6">
                    {skillCategories[selectedCategory].skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="space-y-2 mobile-skill-item"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                    <span className="font-medium text-gray-800 text-sm sm:text-base mobile-text-optimized truncate">{skill.name}</span>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                                        {skill.experience}
                                    </span>
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-600 flex-shrink-0 ml-2">{skill.level}%</span>
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
                </ScrollRevealItem>

                {/* 成就展示 */}
                <ScrollRevealItem className="mt-6 sm:mt-8">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center mobile-text-optimized">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0" />
                        主要成就
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mobile-achievement-grid">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.text}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white rounded-xl p-3 sm:p-4 shadow-sm flex items-center space-x-3 cursor-pointer touch-target mobile-touch-feedback"
                            >
                                <achievement.icon className={`w-4 sm:w-5 h-4 sm:h-5 ${achievement.color} flex-shrink-0`} />
                                <span className="font-medium text-gray-700 text-sm sm:text-base mobile-text-optimized">{achievement.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </ScrollRevealItem>
            </ScrollRevealContainer>
        </div >
    );
}