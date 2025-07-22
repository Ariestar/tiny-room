"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Gamepad2,
    Trophy,
    Star,
    Heart,
    Zap,
    Gift,
    Sparkles,
    Target,
    Dice1,
    Dice2,
    Dice3,
    Dice4,
    Dice5,
    Dice6,
    Coffee,
    Rocket,
    Music,
    Camera
} from "lucide-react";

interface InteractiveEasterEggsProps {
    className?: string;
}

// 彩蛋类型
type EasterEggType = 'click' | 'sequence' | 'time' | 'konami';

// 彩蛋数据
const easterEggs = [
    {
        id: 'coffee-lover',
        type: 'click' as EasterEggType,
        trigger: 'coffee-icon',
        title: '咖啡爱好者',
        message: '☕ 你发现了我的咖啡秘密！我今天已经喝了 3 杯咖啡了...',
        icon: Coffee,
        color: 'text-amber-500',
        bgColor: 'bg-amber-50',
        points: 10
    },
    {
        id: 'night-owl',
        type: 'time' as EasterEggType,
        trigger: 'late-night',
        title: '夜猫子',
        message: '🌙 深夜还在浏览？我们真是同道中人！最佳编程时间：凌晨 2-4 点',
        icon: Star,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        points: 15
    },
    {
        id: 'click-master',
        type: 'sequence' as EasterEggType,
        trigger: 'multiple-clicks',
        title: '点击大师',
        message: '🎯 哇！你点击了 10 次！你一定很有耐心，或者很无聊... 😄',
        icon: Target,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        points: 20
    },
    {
        id: 'konami-code',
        type: 'konami' as EasterEggType,
        trigger: 'konami-sequence',
        title: 'Konami 大师',
        message: '🎮 上上下下左右左右BA！经典的 Konami 代码！你是真正的游戏玩家！',
        icon: Gamepad2,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        points: 50
    }
];

// 小游戏：掷骰子
const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

// 在线活跃度数据
const activityData = {
    todayVisitors: 42,
    currentOnline: 3,
    totalInteractions: 156,
    easterEggsFound: 0
};

export function InteractiveEasterEggs({ className = "" }: InteractiveEasterEggsProps) {
    const [foundEggs, setFoundEggs] = useState<string[]>([]);
    const [currentEgg, setCurrentEgg] = useState<typeof easterEggs[0] | null>(null);
    const [clickCount, setClickCount] = useState(0);
    const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
    const [diceValue, setDiceValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);
    const [showGame, setShowGame] = useState(false);

    // Konami 代码序列
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

    // 检查是否是深夜
    const isLateNight = () => {
        const hour = new Date().getHours();
        return hour >= 22 || hour <= 6;
    };

    // 触发彩蛋
    const triggerEasterEgg = useCallback((eggId: string) => {
        const egg = easterEggs.find(e => e.id === eggId);
        if (egg && !foundEggs.includes(eggId)) {
            setFoundEggs(prev => [...prev, eggId]);
            setCurrentEgg(egg);
            setTotalPoints(prev => prev + egg.points);

            // 3秒后隐藏彩蛋消息
            setTimeout(() => setCurrentEgg(null), 3000);
        }
    }, [foundEggs]);

    // 处理点击事件
    const handleClick = () => {
        setClickCount(prev => {
            const newCount = prev + 1;
            if (newCount === 10) {
                triggerEasterEgg('click-master');
            }
            return newCount;
        });
    };

    // 处理键盘事件（Konami 代码）
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            setKonamiSequence(prev => {
                const newSequence = [...prev, event.code].slice(-konamiCode.length);

                if (newSequence.length === konamiCode.length &&
                    newSequence.every((key, index) => key === konamiCode[index])) {
                    triggerEasterEgg('konami-code');
                    return [];
                }

                return newSequence;
            });
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [triggerEasterEgg]);

    // 检查深夜彩蛋
    useEffect(() => {
        if (isLateNight()) {
            const timer = setTimeout(() => {
                triggerEasterEgg('night-owl');
            }, 5000); // 5秒后触发

            return () => clearTimeout(timer);
        }
    }, [triggerEasterEgg]);

    // 掷骰子游戏
    const rollDice = () => {
        if (isRolling) return;

        setIsRolling(true);

        // 模拟掷骰子动画
        let rollCount = 0;
        const rollInterval = setInterval(() => {
            setDiceValue(Math.floor(Math.random() * 6) + 1);
            rollCount++;

            if (rollCount >= 10) {
                clearInterval(rollInterval);
                const finalValue = Math.floor(Math.random() * 6) + 1;
                setDiceValue(finalValue);
                setIsRolling(false);

                // 特殊结果触发彩蛋
                if (finalValue === 6) {
                    triggerEasterEgg('lucky-six');
                }
            }
        }, 100);
    };

    const DiceIcon = diceIcons[diceValue - 1];

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 彩蛋通知 */}
            <AnimatePresence>
                {currentEgg && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.8 }}
                        className="fixed top-4 right-4 z-50 max-w-sm"
                    >
                        <div className={`${currentEgg.bgColor} border-2 border-current rounded-2xl p-4 shadow-lg`}>
                            <div className="flex items-start space-x-3">
                                <currentEgg.icon className={`w-6 h-6 ${currentEgg.color} flex-shrink-0 mt-1`} />
                                <div>
                                    <h4 className={`font-semibold ${currentEgg.color} mb-1`}>
                                        🎉 {currentEgg.title}
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-2">
                                        {currentEgg.message}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                            +{currentEgg.points} 分
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 在线活跃度显示 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-green-500" />
                    实时活跃度
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            {activityData.todayVisitors}
                        </div>
                        <div className="text-xs text-gray-600">今日访客</div>
                    </div>

                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-green-600 mb-1 flex items-center justify-center">
                            {activityData.currentOnline}
                            <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
                        </div>
                        <div className="text-xs text-gray-600">当前在线</div>
                    </div>

                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                            {activityData.totalInteractions}
                        </div>
                        <div className="text-xs text-gray-600">总互动数</div>
                    </div>

                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-yellow-600 mb-1">
                            {foundEggs.length}
                        </div>
                        <div className="text-xs text-gray-600">发现彩蛋</div>
                    </div>
                </div>
            </motion.div>

            {/* 互动游戏区域 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Gamepad2 className="w-5 h-5 mr-2 text-purple-500" />
                        互动小游戏
                    </h3>
                    <button
                        onClick={() => setShowGame(!showGame)}
                        className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                    >
                        {showGame ? '隐藏' : '显示'}
                    </button>
                </div>

                <AnimatePresence>
                    {showGame && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {/* 掷骰子游戏 */}
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <h4 className="font-medium text-gray-800 mb-3 text-center">🎲 掷骰子</h4>
                                <div className="flex flex-col items-center space-y-4">
                                    <motion.button
                                        onClick={rollDice}
                                        disabled={isRolling}
                                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={isRolling ? { rotate: 360 } : {}}
                                        transition={{ duration: 0.1, repeat: isRolling ? Infinity : 0 }}
                                    >
                                        <DiceIcon className="w-8 h-8" />
                                    </motion.button>
                                    <div className="text-center">
                                        <div className="text-sm text-gray-600">
                                            {isRolling ? '掷骰子中...' : `结果: ${diceValue}`}
                                        </div>
                                        {diceValue === 6 && !isRolling && (
                                            <div className="text-xs text-yellow-600 mt-1">
                                                🎉 幸运数字！
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 点击计数器 */}
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <h4 className="font-medium text-gray-800 mb-3 text-center">👆 点击挑战</h4>
                                <div className="flex flex-col items-center space-y-3">
                                    <motion.button
                                        onClick={handleClick}
                                        className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Target className="w-8 h-8" />
                                    </motion.button>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-800">{clickCount}</div>
                                        <div className="text-xs text-gray-600">点击次数</div>
                                        {clickCount >= 10 && (
                                            <div className="text-xs text-green-600 mt-1">
                                                🏆 点击大师！
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* 彩蛋收集进度 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-yellow-500" />
                    彩蛋收集 ({foundEggs.length}/{easterEggs.length})
                </h3>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">收集进度</span>
                        <span className="text-sm font-medium text-gray-800">
                            {Math.round((foundEggs.length / easterEggs.length) * 100)}%
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                            className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(foundEggs.length / easterEggs.length) * 100}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                        {easterEggs.map((egg) => (
                            <div
                                key={egg.id}
                                className={`p-2 rounded-lg text-center transition-all duration-300 ${foundEggs.includes(egg.id)
                                    ? `${egg.bgColor} ${egg.color} border-2 border-current`
                                    : 'bg-gray-100 text-gray-400'
                                    }`}
                            >
                                <egg.icon className="w-4 h-4 mx-auto mb-1" />
                                <div className="text-xs font-medium">{egg.title}</div>
                                {foundEggs.includes(egg.id) && (
                                    <div className="text-xs mt-1">+{egg.points}分</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {totalPoints > 0 && (
                        <div className="text-center mt-4">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full">
                                <Trophy className="w-4 h-4" />
                                <span className="font-medium">总分: {totalPoints}</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 隐藏的咖啡彩蛋触发器 */}
            <div className="hidden">
                <button
                    id="coffee-icon"
                    onClick={() => triggerEasterEgg('coffee-lover')}
                    className="opacity-0"
                >
                    Coffee Easter Egg
                </button>
            </div>

            {/* 彩蛋提示 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center"
            >
                <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                        彩蛋提示
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>💡 尝试在深夜访问网站</p>
                        <p>🎮 试试经典的 Konami 代码</p>
                        <p>☕ 寻找隐藏的咖啡图标</p>
                        <p>👆 多点击几次看看会发生什么</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}// 默认导出

export default InteractiveEasterEggs;