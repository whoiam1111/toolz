'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const QUESTIONS = [
    { q: '주말 오후, 당신이 선호하는 풍경은?', a: '북적이는 카페에서 사람 구경', b: '고요한 서재에서 혼자만의 시간' },
    { q: '책을 고를 때 더 끌리는 것은?', a: '베스트셀러의 화제성', b: '나만 알고 싶은 보석 같은 문장' },
    { q: '영화의 전개 방식 중 선호하는 것은?', a: '숨 막히는 반전과 빠른 전개', b: '인물의 깊은 심리 묘사와 여운' },
    { q: '고민이 생겼을 때 해결하는 방식은?', a: '실질적인 조언과 해결책 찾기', b: '따뜻한 공감과 위로 얻기' },
    { q: '여행지에 책 한 권을 가져간다면?', a: '가볍고 트렌디한 에세이', b: '두고두고 읽을 묵직한 고전' },
    { q: "나에게 '지혜'란 무엇인가?", a: '세상을 살아가는 효율적인 기술', b: '나 자신을 깊게 이해하는 도구' },
    { q: '사람들과 대화할 때 즐거운 순간은?', a: '새로운 정보를 공유할 때', b: '가치관과 깊은 생각을 나눌 때' },
    { q: '선호하는 결말의 스타일은?', a: '권선징악의 명쾌한 엔딩', b: '생각할 거리를 던져주는 열린 결말' },
    { q: '일상에서 영감을 얻는 통로는?', a: '다양한 사람과의 만남', b: '혼자 하는 산책과 사색' },
    {
        q: '책의 마지막 장을 덮으며 느끼고 싶은 것?',
        a: '새로운 지식을 얻었다는 뿌듯함',
        b: '마음이 정화되는 깊은 울림',
    },
];

export default function BookTest() {
    const [view, setView] = useState<'main' | 'quiz' | 'result'>('main');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0); // B 선택 시 +1
    const resultRef = useRef<HTMLDivElement>(null);

    const handleAnswer = (isB: boolean) => {
        if (isB) setScore(score + 1);
        if (currentIdx < QUESTIONS.length - 1) setCurrentIdx(currentIdx + 1);
        else setView('result');
    };

    const saveImage = async () => {
        if (!resultRef.current) return;
        const canvas = await html2canvas(resultRef.current);
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'book-result.png';
        link.click();
    };

    return (
        <div className="min-h-screen bg-[#F5F5DC] font-serif flex items-center justify-center p-4 text-[#4A342E]">
            <div className="w-full max-w-md bg-white border border-[#D7CCC8] shadow-lg rounded-sm overflow-hidden">
                {view === 'main' && (
                    <div className="p-10 text-center">
                        <h1 className="text-3xl font-bold mb-6">나의 인생 책 찾기</h1>
                        <p className="text-sm opacity-70 mb-10 italic">"내 영혼이 갈망하는 문장은 무엇일까?"</p>
                        <div className="text-7xl mb-12">📚</div>
                        <button
                            onClick={() => setView('quiz')}
                            className="w-full py-4 bg-[#4A342E] text-white font-bold border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all"
                        >
                            시작하기
                        </button>
                    </div>
                )}

                {view === 'quiz' && (
                    <div className="p-8">
                        <div className="w-full h-px bg-gray-200 mb-10">
                            <div
                                className="h-full bg-[#4A342E] transition-all"
                                style={{ width: `${((currentIdx + 1) / 10) * 100}%` }}
                            ></div>
                        </div>
                        <h2 className="text-xl font-medium mb-16 leading-relaxed break-keep">
                            {QUESTIONS[currentIdx].q}
                        </h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => handleAnswer(false)}
                                className="w-full py-4 border-b border-gray-100 hover:bg-gray-50 transition-all text-left px-2"
                            >
                                {QUESTIONS[currentIdx].a}
                            </button>
                            <button
                                onClick={() => handleAnswer(true)}
                                className="w-full py-4 border-b border-gray-100 hover:bg-gray-50 transition-all text-left px-2"
                            >
                                {QUESTIONS[currentIdx].b}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'result' && (
                    <div className="p-6">
                        <div
                            ref={resultRef}
                            className="bg-white p-6 border-2 border-[#4A342E]"
                        >
                            <p className="text-[10px] tracking-widest mb-4 opacity-50 uppercase">Book Curation</p>
                            <h2 className="text-3xl font-bold mb-4">
                                {score >= 6 ? '고독한 사색가' : '현실의 항해자'}
                            </h2>
                            <div className="bg-[#FAF8F5] p-6 italic text-sm leading-loose border-y border-gray-100 mb-6">
                                {score >= 6
                                    ? '보이지 않는 가치와 마음의 결을 소중히 여기는 당신. 문장 사이의 여백에서 의미를 찾는 심오한 문학이 어울립니다.'
                                    : '당신은 현실에 발을 딛고 명확한 해답을 찾는 분이군요. 지식을 도구 삼아 더 나은 내일을 만드는 책이 어울립니다.'}
                            </div>
                            <p className="font-bold">추천 도서: 《{score >= 6 ? '데미안' : '타이탄의 도구들'}》</p>
                        </div>
                        <button
                            onClick={saveImage}
                            className="w-full mt-6 py-4 bg-[#4A342E] text-white font-bold"
                        >
                            결과 저장하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
