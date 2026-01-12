'use client';

import * as motion from 'motion/react-client';
import React from 'react';

const MainStatistics = () => {
    return (
        <section className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
            {/* 배경 미세 장식 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
                    {[
                        {
                            count: '5,000+',
                            unit: '명',
                            label: '누적 참여자',
                            delay: 0,
                        },
                        {
                            count: '200+',
                            unit: '개',
                            label: '개설 프로그램',
                            delay: 0.1,
                        },
                        {
                            count: '1,000+',
                            unit: '시간',
                            label: '누적 활동 시간',
                            delay: 0.2,
                        },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: item.delay, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            {/* 카드 배경 및 효과 */}
                            <div className="absolute -inset-px bg-gradient-to-b from-orange-600/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative bg-[#151515] border border-white/5 rounded-3xl px-8 py-12 md:py-20 transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-[#1a1a1a] group-hover:border-orange-500/30 shadow-2xl">
                                
                                {/* 수치 부분 */}
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 group-hover:text-orange-500 transition-colors duration-300">
                                        {item.count}
                                    </span>
                                    <span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-6">
                                        {item.unit} {item.label.split(' ')[0]}
                                    </span>
                                </div>

                                {/* 가로선 장식 */}
                                <div className="w-8 h-1 bg-white/10 mx-auto rounded-full group-hover:w-16 group-hover:bg-orange-600 transition-all duration-500" />

                                {/* 설명 부분 */}
                                <p className="mt-8 text-gray-500 font-medium group-hover:text-gray-300 transition-colors">
                                    {item.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 하단 미세 장식 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </section>
    );
};

export default MainStatistics;