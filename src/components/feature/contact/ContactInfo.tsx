"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    Mail,
    MessageCircle,
    Phone,
    MapPin,
    Coffee,
    Moon,
    Sun,
    Zap,
    Heart,
    Star,
    Timer
} from "lucide-react";

interface ContactInfoProps {
    className?: string;
}

// 联系方式偏好数据
const contactPreferences = [
    {
        method: "邮箱",
        icon: Mail,
        preference: "最佳",
        responseTime: "6-12小时",
        availability: "24/7",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        description: "详细讨论和正式沟通的首选方式",
        tips: ["适合项目咨询", "技术讨论", "合作提案"]
    },
    {
        method: "微信",
        icon: MessageCircle,
        preference: "快速",
        responseTime: "1-3小时",
        availability: "9:00-22:00",
        color: "text-green-500",
        bgColor: "bg-green-50",
        description: "日常交流和快速问题解答",
        tips: ["简单问题", "日常交流", "紧急联系"]
    },
    {
        method: "电话",
        icon: Phone,
        preference: "紧急",
        responseTime: "立即",
        availability: "预约制",
        color: "text-orange-500",
        bgColor: "bg-orange-50",
        description: "紧急事务或深度技术讨论",
        tips: ["紧急问题", "技术讨论", "面试安排"]
    }
];

// 工作时间状态
const workingHours = {
    weekdays: "9:00 - 18:00",
    weekends: "10:00 - 16:00",
    timezone: "GMT+8 (北京时间)",
    currentStatus: "在线"
};

// 有趣的联系提示
const contactTips = [
    "💡 提问前可以先查看我的博客，也许能找到答案",
    "🚀 项目合作请详细描述需求和预期时间",
    "☕ 如果在北京，欢迎约个咖啡面聊",
    "🌙 深夜消息我可能不会立即回复，但一定会看到",
    "📝 技术问题请提供具体的错误信息或代码",
    "🎯 简历投递请说明具体职位和公司信息",
    "🤝 开源项目合作随时欢迎",
    "📚 学习交流和技术分享都很乐意参与"
];

export function ContactInfo({ className = "" }: ContactInfoProps) {
    const [currentTip, setCurrentTip] = useState(0);
    const [currentTime, setCurrentTime] = useState("");
    const [isWorkingHours, setIsWorkingHours] = useState(true);

    // 更新当前时间和工作状态
    useEffect(() => {
        const updateTimeAndStatus = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('zh-CN', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            setCurrentTime(timeString);

            // 判断是否在工作时间内
            const hour = now.getHours();
            const day = now.getDay();
            const isWeekend = day === 0 || day === 6;

            if (isWeekend) {
                setIsWorkingHours(hour >= 10 && hour < 16);
            } else {
                setIsWorkingHours(hour >= 9 && hour < 18);
            }
        };

        updateTimeAndStatus();
        const timer = setInterval(updateTimeAndStatus, 1000);
        return () => clearInterval(timer);
    }, []);

    // 轮播联系提示
    useEffect(() => {
        const tipTimer = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % contactTips.length);
        }, 4000);

        return () => clearInterval(tipTimer);
    }, []);

    return (
        <div className={`space-y-8 ${className}`}>
            {/* 当前状态卡片 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                        当前状态
                    </h3>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${isWorkingHours ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <span className="text-sm text-gray-600">
                            {isWorkingHours ? '工作时间' : '非工作时间'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <div className="flex items-center justify-center mb-2">
                            {isWorkingHours ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-blue-500" />
                            )}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">当前时间</div>
                        <div className="font-medium text-gray-800 font-mono">{currentTime}</div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <MapPin className="w-5 h-5 text-red-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-1">时区</div>
                        <div className="font-medium text-gray-800">{workingHours.timezone}</div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <Timer className="w-5 h-5 text-green-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-1">响应时间</div>
                        <div className="font-medium text-gray-800">
                            {isWorkingHours ? '1-3小时' : '6-12小时'}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 联系方式偏好 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    联系方式偏好
                </h3>

                <div className="space-y-4">
                    {contactPreferences.map((contact, index) => (
                        <motion.div
                            key={contact.method}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            className={`${contact.bgColor} rounded-xl p-4 border border-gray-200/50`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                                    <contact.icon className={`w-5 h-5 ${contact.color}`} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-800">{contact.method}</h4>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${contact.preference === '最佳' ? 'bg-green-100 text-green-700' :
                                                    contact.preference === '快速' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-orange-100 text-orange-700'
                                                }`}>
                                                {contact.preference}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {contact.responseTime}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">{contact.description}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {contact.tips.map((tip, tipIndex) => (
                                            <span
                                                key={tipIndex}
                                                className="text-xs px-2 py-1 bg-white/70 text-gray-600 rounded-full"
                                            >
                                                {tip}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-2 text-xs text-gray-500">
                                        可用时间：{contact.availability}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* 工作时间说明 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    工作时间
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-2">工作日</div>
                        <div className="font-medium text-gray-800 flex items-center">
                            <Sun className="w-4 h-4 text-yellow-500 mr-2" />
                            {workingHours.weekdays}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-sm text-gray-600 mb-2">周末</div>
                        <div className="font-medium text-gray-800 flex items-center">
                            <Coffee className="w-4 h-4 text-amber-500 mr-2" />
                            {workingHours.weekends}
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-white/70 rounded-lg">
                    <p className="text-sm text-gray-600">
                        💡 <strong>小贴士：</strong>工作时间内发送的消息通常能得到更快的回复。
                        非工作时间的消息我也会看到，只是回复可能会稍晚一些。
                    </p>
                </div>
            </motion.div>

            {/* 有趣的联系提示 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    联系小贴士
                </h3>

                <div className="min-h-[80px] flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTip}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="text-gray-700 text-base leading-relaxed"
                        >
                            {contactTips[currentTip]}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                        {contactTips.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentTip ? 'bg-yellow-500' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* 联系鼓励 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center"
            >
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl p-6">
                    <h4 className="text-lg font-semibold mb-2">别犹豫，联系我吧！</h4>
                    <p className="text-purple-100 mb-4">
                        无论是技术讨论、项目合作，还是简单的问候，我都很乐意与你交流。
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>友好交流</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4" />
                            <span>快速响应</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>专业建议</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}