'use client';

import React, { useState, useRef } from 'react';

const QUESTIONS = [
    {
        q: '새로운 지식을 배울 때 당신은?',
        a: '자격증이나 수료증이 남아야 보람차다',
        b: '배우는 과정에서 깨달음이 더 중요하다',
    },
    {
        q: '좋은 물건을 샀을 때의 기쁨은?',
        a: "이 물건을 '가졌다'는 소유의 기쁨",
        b: "이 물건을 '사용하는' 경험의 기쁨",
    },
    { q: '관계에서 상대를 대할 때?', a: '내 사람이기에 나에게 맞춰주길 원함', b: '그 사람 존재 자체를 존중함' },
    { q: '대화 중 내 주장과 다를 때?', a: '내 주장이 맞음을 입증하려 함', b: '상대의 관점을 이해하려 함' },
    { q: '아름다운 풍경을 마주하면?', a: '사진으로 소장해야 안심이 됨', b: '그 순간의 분위기를 온몸으로 누림' },
    { q: '물건을 비울 때 나의 마음은?', a: '언젠가 쓸모가 있을 것 같아 불안함', b: '비움으로써 내면이 홀가분해짐' },
    { q: '성공한 삶이란 무엇이라 생각하나?', a: '경제적 풍요와 높은 지위', b: '내면의 평화와 자아실현' },
    { q: '취미 생활을 할 때 중요하게 여기는 건?', a: '완벽하게 갖춰진 장비', b: '활동 그 자체에서 얻는 즐거움' },
    { q: '지식이란 당신에게 어떤 의미인가?', a: '내가 소유한 정보의 양', b: '세상을 바라보는 깊은 시선' },
    { q: '행복은 어디에서 온다고 믿나?', a: '더 많이 채우는 소유', b: '더 깊이 머무는 존재' },
];

export default function FrommTest() {
    const [view, setView] = useState<'main' | 'quiz' | 'result'>('main');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0); // B가 존재양식

    return (
        <div className="min-h-screen bg-[#fafafa] font-serif text-[#333] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-10 shadow-sm border border-gray-100 flex flex-col">
                {view === 'main' && (
                    <div className="text-center py-10">
                        <div className="w-8 h-px bg-black mx-auto mb-10"></div>
                        <h1 className="text-2xl font-medium mb-12 leading-relaxed">
                            소유인가,
                            <br />
                            존재인가?
                        </h1>
                        <button
                            onClick={() => setView('quiz')}
                            className="text-sm tracking-[0.2em] border-b border-black pb-1 hover:opacity-50 transition-all"
                        >
                            ENTER
                        </button>
                    </div>
                )}

                {view === 'quiz' && (
                    <div className="flex-1">
                        <p className="text-[10px] mb-12 opacity-30 tracking-widest uppercase">
                            Question {currentIdx + 1} / 10
                        </p>
                        <h2 className="text-lg font-medium mb-20 leading-loose text-center">
                            {QUESTIONS[currentIdx].q}
                        </h2>
                        <div className="space-y-6">
                            <button
                                onClick={() => {
                                    if (currentIdx < 9) setCurrentIdx(currentIdx + 1);
                                    else setView('result');
                                }}
                                className="w-full text-sm py-4 border-t border-b border-gray-50 hover:bg-gray-50"
                            >
                                A. {QUESTIONS[currentIdx].a}
                            </button>
                            <button
                                onClick={() => {
                                    setScore(score + 1);
                                    if (currentIdx < 9) setCurrentIdx(currentIdx + 1);
                                    else setView('result');
                                }}
                                className="w-full text-sm py-4 border-t border-b border-gray-50 hover:bg-gray-50"
                            >
                                B. {QUESTIONS[currentIdx].b}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'result' && (
                    <div className="text-center">
                        <p className="text-[10px] mb-8 opacity-30 uppercase tracking-widest">The Result</p>
                        <h2 className="text-3xl font-bold mb-6">{score >= 6 ? '존재 지향형' : '소유 지향형'}</h2>
                        <p className="text-sm leading-loose text-gray-500 mb-12 text-justify">
                            {score >= 6
                                ? '당신은 무언가를 가지는 것보다, 그 순간에 존재하고 성장하는 것에 더 큰 가치를 둡니다. 소유욕에서 자유로워질 때 진정한 자유를 얻는 분이군요.'
                                : "당신은 안정적인 소유를 통해 자신의 정체성을 확인하는 경향이 있습니다. 가끔은 '가진 것'을 내려놓고 '나 자신'에게 집중해보는 건 어떨까요?"}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-[10px] underline opacity-30"
                        >
                            RETRY
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
