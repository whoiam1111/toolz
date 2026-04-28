'use client';

import React, { useState } from 'react';

const QUESTIONS = [
    { q: '집에서의 나와 밖에서의 나는 완전히 다른 사람인가?', a: '그렇다', b: '거의 비슷하다' },
    { q: '모임의 성격에 따라 나의 말투나 톤이 변하는가?', a: '자주 변한다', b: '일관적인 편이다' },
    { q: '내 속마음을 남들에게 보여주는 것이 꺼려지는가?', a: '매우 그렇다', b: '비교적 솔직하다' },
    { q: '불편한 사람 앞에서도 웃으며 대화할 수 있는가?', a: '완벽하게 가능하다', b: '표정 관리가 잘 안 된다' },
    { q: '사람들이 생각하는 나의 이미지를 관리하려 애쓰는가?', a: '그렇다', b: '별로 신경 쓰지 않는다' },
    { q: '상대방의 기분에 따라 내 행동을 즉각 수정하는가?', a: '눈치가 빨라 바로 맞춘다', b: '그냥 내 소신껏 한다' },
    { q: "사회생활용 '말투'가 따로 존재하는가?", a: '자본주의적 말투 장착 중', b: '평소와 다를 바 없다' },
    { q: '갈등 상황에서 내 감정보다 상황 수습을 먼저 하는가?', a: '상황 수습이 우선이다', b: '내 감정도 중요하다' },
    { q: '타인에게 보여주는 SNS는 철저히 계산된 연출인가?', a: '어느 정도 연출이다', b: '그냥 일상의 기록이다' },
    { q: '나를 잘 아는 사람은 극소수라고 생각하는가?', a: '그렇다', b: '대부분 나를 잘 안다' },
];

export default function PersonaTest() {
    const [view, setView] = useState<'main' | 'quiz' | 'result'>('main');
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);

    return (
        <div className="min-h-screen bg-[#e0e0e0] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white border-[3px] border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] p-8">
                {view === 'main' && (
                    <div className="py-10">
                        <h1 className="text-5xl font-black italic tracking-tighter leading-none mb-4">
                            PERSONA
                            <br />
                            INDEX
                        </h1>
                        <p className="text-sm font-bold border-l-4 border-black pl-3 mb-12 uppercase">
                            Social Mask Analysis
                        </p>
                        <button
                            onClick={() => setView('quiz')}
                            className="w-full py-5 bg-black text-white font-black text-xl hover:bg-white hover:text-black transition-colors border-2 border-black"
                        >
                            START
                        </button>
                    </div>
                )}

                {view === 'quiz' && (
                    <div>
                        <div className="flex justify-between font-black text-[10px] mb-8 border-b-2 border-black pb-1">
                            <span>ANALYZING...</span>
                            <span>{step + 1} / 10</span>
                        </div>
                        <h2 className="text-xl font-black mb-16 break-keep">{QUESTIONS[step].q}</h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setScore(score + 10);
                                    if (step < 9) setStep(step + 1);
                                    else setView('result');
                                }}
                                className="w-full py-4 border-[3px] border-black font-black text-left px-6 hover:bg-black hover:text-white transition-all"
                            >
                                TRUE
                            </button>
                            <button
                                onClick={() => {
                                    if (step < 9) setStep(step + 1);
                                    else setView('result');
                                }}
                                className="w-full py-4 border-[3px] border-black font-black text-left px-6 hover:bg-black hover:text-white transition-all"
                            >
                                FALSE
                            </button>
                        </div>
                    </div>
                )}

                {view === 'result' && (
                    <div className="text-center py-6">
                        <div className="inline-block px-4 py-1 bg-black text-white font-black text-xs mb-6">
                            FINAL DATA
                        </div>
                        <h2 className="text-6xl font-black italic mb-2 tracking-tighter">{score}%</h2>
                        <p className="font-bold text-gray-500 mb-8 uppercase">Mask Thickness Index</p>
                        <div className="text-sm font-bold leading-relaxed border-t-2 border-black pt-6 text-justify">
                            {score >= 70
                                ? "당신은 사회생활 만렙, '멀티 페르소나'의 소유자입니다. 상황에 맞는 가면을 쓰는 능력이 탁월하지만, 가끔은 가면 속 진짜 당신이 누구인지 혼란스러울 수 있습니다."
                                : '당신은 투명한 영혼의 소유자입니다. 어디서나 한결같은 모습은 당신의 강점이지만, 가끔은 너무 솔직해서 오해를 사기도 합니다.'}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-12 text-xs font-black border-b-2 border-black"
                        >
                            RE-SCAN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
