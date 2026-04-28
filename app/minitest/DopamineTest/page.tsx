'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const QUESTIONS = [
    { q: '눈 뜨자마자 가장 먼저 스마트폰을 찾는가?', a: '거의 매일 그렇다', b: '정신 좀 차린 뒤에 본다' },
    { q: '식사 중 영상이 없으면 허전함을 느끼는가?', a: '매우 그렇다', b: '없어도 상관없다' },
    { q: '릴스/쇼츠를 켜면 1시간이 금방 지나가는가?', a: '늘 그렇다', b: '조절 가능하다' },
    { q: '화장실 갈 때 스마트폰은 필수인가?', a: '없으면 불안하다', b: '가끔 잊기도 한다' },
    { q: '알림 소리가 들리면 즉시 확인해야 하는가?', a: '그렇다', b: '급한 게 아니면 나중에 본다' },
    { q: '영화 한 편을 정속도로 보기 힘든가?', a: '배속이나 스킵이 필수다', b: '정속도로 감상한다' },
    { q: '배터리가 10% 미만이면 극도로 불안한가?', a: '매우 불안하다', b: '충전하면 된다' },
    { q: '친구와 대화 중에도 수시로 폰을 확인하는가?', a: '자주 그런다', b: '대화에 집중한다' },
    { q: '아무것도 안 하고 10분 멍때리기가 고통스러운가?', a: '그렇다', b: '오히려 좋아한다' },
    { q: '잠들기 직전까지 화면을 보고 있는가?', a: '눈 아플 때까지 본다', b: '미리 내려놓는다' },
];

export default function DopamineTest() {
    const [view, setView] = useState<'main' | 'quiz' | 'result'>('main');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const resultRef = useRef<HTMLDivElement>(null);

    const handleAnswer = (isA: boolean) => {
        if (isA) setScore(score + 10);
        if (currentIdx < QUESTIONS.length - 1) setCurrentIdx(currentIdx + 1);
        else setView('result');
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md border border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] rounded-2xl overflow-hidden bg-[#0a0a0a]">
                {view === 'main' && (
                    <div className="p-10 text-center">
                        <p className="text-pink-500 font-mono text-xs mb-4 tracking-[0.4em]">SYSTEM WARNING</p>
                        <h1 className="text-3xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
                            도파민 중독 스캔
                        </h1>
                        <div className="text-7xl mb-12 animate-pulse">📱</div>
                        <button
                            onClick={() => setView('quiz')}
                            className="w-full py-4 border border-pink-500 text-pink-500 font-bold rounded-full hover:bg-pink-500 hover:text-black transition-all"
                        >
                            스캔 시작
                        </button>
                    </div>
                )}

                {view === 'quiz' && (
                    <div className="p-8">
                        <div className="w-full h-1 bg-gray-900 mb-8">
                            <div
                                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                                style={{ width: `${((currentIdx + 1) / 10) * 100}%` }}
                            ></div>
                        </div>
                        <h2 className="text-xl font-bold mb-16 leading-snug">{QUESTIONS[currentIdx].q}</h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => handleAnswer(true)}
                                className="w-full py-4 bg-[#111] border border-[#333] hover:border-pink-500 rounded-xl text-left px-6"
                            >
                                YES
                            </button>
                            <button
                                onClick={() => handleAnswer(false)}
                                className="w-full py-4 bg-[#111] border border-[#333] hover:border-cyan-500 rounded-xl text-left px-6"
                            >
                                NO
                            </button>
                        </div>
                    </div>
                )}

                {view === 'result' && (
                    <div className="p-8 text-center">
                        <div
                            ref={resultRef}
                            className="bg-[#0a0a0a] p-4"
                        >
                            <p className="text-cyan-400 font-mono text-xs mb-2 uppercase">Analysis Complete</p>
                            <h2 className="text-7xl font-black text-pink-500 mb-6">{score}%</h2>
                            <div className="bg-[#111] p-6 rounded-xl border border-pink-900 text-sm text-gray-400 leading-relaxed mb-6">
                                {score >= 70
                                    ? "당신은 '도파민 망령'입니다. 뇌가 즉각적인 자극에 절여져 있어 일상의 잔잔한 행복을 느끼기 어렵습니다. 지금 당장 폰을 던지세요!"
                                    : '안정적인 도파민 관리자입니다. 자극을 스스로 조절할 줄 아는 건강한 뇌를 소유하고 계시군요.'}
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-pink-600 rounded-full font-bold"
                        >
                            REBOOT
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
