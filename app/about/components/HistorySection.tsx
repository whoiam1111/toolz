'use client';

import React from 'react';
import { motion } from 'framer-motion';

const historyData = [
    {
        year: '2022',
        event: 'TOOL : Z 설립',
        description: '전문가들의 재능기부로 시작된 내면 성장과 관점 변화를 위한 첫 프레임워크가 구축되었습니다.',
    },
    {
        year: '2023',
        event: 'Insight Journey 프로그램 확장',
        description: '맞춤형 내면 탐색 도구를 통해 수많은 참여자의 삶에 실질적인 리프레임 경험을 제공했습니다.',
    },
    {
        year: '2024',
        event: 'CorePath Initiative 고도화',
        description: 'A부터 Z까지 체계적인 성장을 지원하는 프리미엄 코칭 시스템으로 거듭났습니다.',
    },
];

export default function HistorySection() {
    return (
        <section className="py-24 max-w-5xl mx-auto px-6 bg-[#0f0f0f]">
            <motion.h3
                className="text-3xl md:text-4xl font-black text-center mb-24 tracking-tighter text-white"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                Our <span className="text-orange-500">History</span>
            </motion.h3>

            <div className="relative max-w-2xl mx-auto">
                {/* 세로 타임라인 라인 - 그라데이션 적용 */}
                <div className="absolute top-2 left-[7px] h-full w-[2px] bg-gradient-to-b from-orange-600 via-orange-900/20 to-transparent rounded"></div>

                {historyData.map((item, index) => (
                    <motion.div
                        key={index}
                        className="relative pl-12 mb-20 last:mb-0 group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: index * 0.2 }}
                    >
                        {/* 타임라인 포인트 원 */}
                        <div className="absolute left-0 top-1.5 w-4 h-4 bg-[#0f0f0f] border-2 border-orange-500 rounded-full z-10 group-hover:bg-orange-500 transition-colors duration-300"></div>

                        {/* 연도 및 이벤트 제목 */}
                        <div className="flex flex-col md:flex-row md:items-baseline md:gap-6 mb-3">
                            <time className="text-2xl font-black text-orange-500 tracking-tighter">
                                {item.year}
                            </time>
                            <h4 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                                {item.event}
                            </h4>
                        </div>

                        {/* 상세 설명 */}
                        <p className="leading-relaxed text-gray-400 font-light break-keep max-w-lg">
                            {item.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}