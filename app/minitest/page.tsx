'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// 테스트 목록 데이터
const TEST_LIST = [
    {
        id: 'midia',
        title: '유행 민감도 테스트',
        emoji: '📚',
        desc: '나는 어느속도로 트렌디 할까',
        color: 'bg-[#F5F5DC]',
        textColor: 'text-[#4A342E]',
        tag: '유행',
        path: '/minitest/ToolzQuiz',
    },
    {
        id: 'book',
        title: '나의 인생 책 찾기',
        emoji: '📚',
        desc: '내 영혼이 갈망하는 문장을 찾아보세요.',
        color: 'bg-[#F5F5DC]',
        textColor: 'text-[#4A342E]',
        tag: '북 큐레이션',
        path: '/minitest/BookTest',
    },
    {
        id: 'dopamine',
        title: '도파민 중독 스캔',
        emoji: '📱',
        desc: '당신의 뇌는 자극에 얼마나 절여져 있나요?',
        color: 'bg-black',
        textColor: 'text-pink-500',
        tag: '사이버펑크',
        path: '/minitest/DopamineTest',
    },
    {
        id: 'existence',
        title: '소유 vs 존재 테스트',
        emoji: '🌱',
        desc: '에리히 프롬이 묻습니다. 당신은 어떻게 사나요?',
        color: 'bg-white',
        textColor: 'text-gray-800',
        tag: '심리 철학',
        path: '/minitest/FrommTest',
    },
    {
        id: 'digimon',
        title: '디지몬 파트너 진단',
        emoji: '🦖',
        desc: '나와 함께 디지털 월드를 구할 파트너는?',
        color: 'bg-orange-500',
        textColor: 'text-white',
        tag: '레트로 게임',
        path: '/minitest/DigimonTest',
    },
    {
        id: 'persona',
        title: '사회적 페르소나 지수',
        emoji: '🎭',
        desc: '당신이 쓰고 있는 사회적 가면의 두께는?',
        color: 'bg-[#e0e0e0]',
        textColor: 'text-black',
        tag: '브루탈리즘',
        path: '/minitest/PersonaTest',
    },
];

export default function TestLobby() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* 헤더 섹션 */}
                <header className="text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">MY PERSONAL TESTS</h1>
                    <p className="text-gray-500 font-medium">당신의 성향과 내면을 탐구하는 5가지 특별한 여정</p>
                    <div className="mt-4 flex justify-center gap-2">
                        <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">#10문항</span>
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                            #MBTI기반
                        </span>
                    </div>
                </header>

                {/* 테스트 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {TEST_LIST.map((test) => (
                        <div
                            key={test.id}
                            onClick={() => router.push(test.path)}
                            className={`group cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent hover:border-black transition-all duration-300 shadow-sm hover:shadow-xl transform hover:-translate-y-1 ${test.color}`}
                        >
                            <div className="p-8 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <span
                                        className={`text-xs font-bold px-2 py-1 bg-white bg-opacity-30 rounded-md ${test.textColor}`}
                                    >
                                        {test.tag}
                                    </span>
                                    <span className="text-4xl group-hover:scale-125 transition-transform duration-300">
                                        {test.emoji}
                                    </span>
                                </div>

                                <h3 className={`text-2xl font-black mb-2 ${test.textColor}`}>{test.title}</h3>
                                <p className={`text-sm font-medium opacity-80 mb-8 ${test.textColor}`}>{test.desc}</p>

                                <div className="mt-auto flex items-center gap-2">
                                    <div
                                        className={`w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-100 transition-all`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 ${test.textColor}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </div>
                                    <span className={`text-sm font-black uppercase tracking-widest ${test.textColor}`}>
                                        Take Test
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
