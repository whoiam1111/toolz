'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const TEST_LIST = [
    {
        id: 'midia',
        title: '유행 민감도 테스트',
        emoji: '📈',
        desc: '나는 어느 속도로 트렌디할까',
        color: 'from-amber-100 to-amber-50',
        tag: 'TREND',
        path: '/minitest/ToolzQuiz',
    },
    {
        id: 'book',
        title: '나의 인생 책 찾기',
        emoji: '📚',
        desc: '내 영혼이 갈망하는 문장을 찾아보세요',
        color: 'from-stone-200 to-stone-100',
        tag: 'BOOK',
        path: '/minitest/BookTest',
    },
    {
        id: 'dopamine',
        title: '도파민 중독 스캔',
        emoji: '📱',
        desc: '당신의 뇌는 자극에 얼마나 절여져 있나요?',
        color: 'from-black to-zinc-900',
        tag: 'DOPAMINE',
        path: '/minitest/DopamineTest',
    },
    {
        id: 'existence',
        title: '소유 vs 존재',
        emoji: '🌱',
        desc: '당신은 어떻게 살아가고 있나요?',
        color: 'from-white to-gray-100',
        tag: 'PHILOSOPHY',
        path: '/minitest/FrommTest',
    },
    {
        id: 'digimon',
        title: '디지몬 파트너',
        emoji: '🦖',
        desc: '나와 함께할 디지털 파트너는?',
        color: 'from-orange-400 to-orange-300',
        tag: 'RETRO',
        path: '/minitest/DigimonTest',
    },
    {
        id: 'persona',
        title: '페르소나 지수',
        emoji: '🎭',
        desc: '당신이 쓰고 있는 가면의 두께',
        color: 'from-zinc-200 to-zinc-100',
        tag: 'PERSONA',
        path: '/minitest/PersonaTest',
    },
];

export default function TestLobby() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-16">
            <div className="max-w-5xl mx-auto">
                {/* 헤더 */}
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-black tracking-tight mb-4">PERSONAL TEST LAB</h1>
                    <p className="text-gray-500 text-sm">당신을 분석하는 6가지 실험</p>

                    <div className="mt-6 flex justify-center gap-2">
                        <span className="px-3 py-1 text-xs bg-black text-white rounded-full">10 QUESTIONS</span>
                        <span className="px-3 py-1 text-xs bg-gray-200 rounded-full">QUICK TEST</span>
                    </div>
                </header>

                {/* 카드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TEST_LIST.map((test) => (
                        <div
                            key={test.id}
                            onClick={() => router.push(test.path)}
                            className={`
                                group cursor-pointer relative overflow-hidden rounded-3xl p-[1px]
                                bg-gradient-to-br ${test.color}
                                hover:scale-[1.03] transition-all duration-300
                            `}
                        >
                            {/* 내부 카드 */}
                            <div className="h-full rounded-3xl bg-white p-6 flex flex-col justify-between">
                                {/* 상단 */}
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-[10px] font-bold tracking-widest text-gray-400">
                                            {test.tag}
                                        </span>

                                        <span className="text-3xl transition-transform duration-300 group-hover:scale-125">
                                            {test.emoji}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-extrabold mb-2">{test.title}</h3>

                                    <p className="text-sm text-gray-500">{test.desc}</p>
                                </div>

                                {/* 하단 */}
                                <div className="mt-8 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400">START</span>

                                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition">
                                        →
                                    </div>
                                </div>
                            </div>

                            {/* hover glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
