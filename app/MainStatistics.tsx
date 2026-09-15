'use client';

import { motion } from 'framer-motion';
import React from 'react';

const MainStatistics = () => {
    return (
        /* 전체 배경: 밝은 오프화이트 톤 (#f8fafc) */
        <section className="py-20 md:py-32 bg-[#f8fafc] relative overflow-hidden">
            {/* 상단 미세 장식 선 (밝은 톤에 맞춰 Slate 컬러 적용) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            
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
                            {/* 호버 시 딥 블루 외곽선 글로우 효과 */}
                            <div className="absolute -inset-px bg-gradient-to-b from-[#0a1f44]/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* 카드 배경: 깔끔한 흰색 카드 & 은은한 그림자 */}
                            <div className="relative bg-white border border-slate-200/80 rounded-3xl px-8 py-12 md:py-20 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#0a1f44]/30 shadow-sm hover:shadow-xl">
                                
                                {/* 수치 부분 */}
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-4xl md:text-6xl font-black text-[#0a1f44] tracking-tighter mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                        {item.count}
                                    </span>
                                    <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-6">
                                        {item.unit} {item.label.split(' ')[0]}
                                    </span>
                                </div>

                                {/* 가로선 장식 (호버 시 딥 블루로 가로 확장) */}
                                <div className="w-8 h-1 bg-slate-200 mx-auto rounded-full group-hover:w-16 group-hover:bg-[#0a1f44] transition-all duration-500" />

                                {/* 설명 부분 */}
                                <p className="mt-8 text-slate-500 font-medium group-hover:text-slate-800 transition-colors">
                                    {item.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 하단 미세 장식 선 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </section>
    );
};

export default MainStatistics;