'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HistorySection from './components/HistorySection';
import About from './components/About';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('TOOL:Z');

    const tabs = ['TOOL:Z', '연혁'];

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white antialiased font-sans">
            {/* 상단 히어로 섹션 느낌의 타이틀 영역 */}
            <div className="pt-32 pb-16 text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black tracking-tighter mb-4"
                >
                    ABOUT <span className="text-orange-500">TOOL : Z</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 font-light"
                >
                    도구를 통해 당신의 세계를 재정의합니다.
                </motion.p>
            </div>

            {/* 탭 네비게이션 */}
            <div className="sticky top-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-screen-xl mx-auto px-6 flex justify-center space-x-8 md:space-x-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`relative py-6 text-sm md:text-base font-bold tracking-widest transition-all duration-300 ${
                                activeTab === tab ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 콘텐츠 영역 */}
            <main className="max-w-screen-xl mx-auto px-6 py-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {activeTab === 'TOOL:Z' && <About />}
                        {activeTab === '연혁' && <HistorySection />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* 하단 푸터 대용 장식 */}
            <div className="py-20 flex justify-center opacity-20">
                <div className="text-4xl font-black tracking-[1rem] text-orange-900 select-none">TOOL:Z</div>
            </div>
        </div>
    );
}