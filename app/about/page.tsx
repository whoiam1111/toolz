'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HistorySection from './components/HistorySection';
import About from './components/About';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('TOOL:Z');

    const tabs = ['TOOL:Z', '연혁'];

    return (
        /* 전체 배경: 깔끔한 오프화이트 톤 (#f8fafc) */
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
            {/* 상단 히어로 섹션 타이틀 영역 */}
            <div className="pt-36 pb-16 text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#0a1f44]"
                >
                    ABOUT <span className="text-blue-600">TOOL : Z</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-500 font-medium text-base md:text-lg"
                >
                    도구를 통해 당신의 세계를 재정의합니다.
                </motion.p>
            </div>

            {/* 탭 네비게이션: 스티키 헤더 반투명 블러 및 딥 블루 하이라이트 */}
            <div className="sticky top-[70px] z-40 bg-[#f8fafc]/90 backdrop-blur-md border-b border-slate-200/80">
                <div className="max-w-screen-xl mx-auto px-6 flex justify-center space-x-8 md:space-x-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`relative py-6 text-sm md:text-base font-bold tracking-widest transition-all duration-300 ${
                                activeTab === tab ? 'text-[#0a1f44]' : 'text-slate-400 hover:text-slate-600'
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a1f44]"
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

            {/* 하단 푸터 대용 장식 (은은한 딥 블루 워터마크) */}
            <div className="py-20 flex justify-center opacity-10">
                <div className="text-4xl font-black tracking-[1rem] text-[#0a1f44] select-none">TOOL:Z</div>
            </div>
        </div>
    );
}