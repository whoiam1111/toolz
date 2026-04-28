'use client';

import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

import { useRouter } from 'next/navigation';
// --- 확장된 결과 데이터 ---
const RESULT_TYPES = [
    {
        range: [0, 20],
        title: '강박적 수집가',
        subtitle: '소유가 곧 존재인 불안의 단계',
        description:
            "무엇을 가졌는지가 곧 자신이라고 믿는 양식입니다. 프롬은 말했습니다. '내가 가진 것이 곧 나라면, 그것을 잃었을 때 나는 누구인가?' 소유물에 대한 집착이 당신의 자유를 가로막고 있을지 모릅니다.",
        advice: '소유하기 위해 소비하는 시간 대신, 아무것도 하지 않고 오롯이 숨 쉬는 5분을 가져보세요.',
        stats: { empathy: 15, freedom: 10, creation: 20 },
        match: '경계의 관찰자',
        clash: '깨어있는 존재',
        themeColor: 'bg-slate-800',
        textColor: 'text-slate-800',
    },
    {
        range: [21, 45],
        title: '시장형 전략가',
        subtitle: '자신을 상품화하는 소유 양식',
        description:
            "현대 사회에 최적화된 소유 양식입니다. 지식과 인간관계를 '투자 대비 가치'로 판단하는 경향이 있습니다. 당신의 가치는 타인의 평가나 시장 가격이 아닌, 당신 안의 생동감에 있습니다.",
        advice: '효율성이라는 잣대를 버리고, 아무런 보상이 없는 순수한 취미에 몰입해 보세요.',
        stats: { empathy: 40, freedom: 35, creation: 50 },
        match: '능동적 탐구자',
        clash: '강박적 수집가',
        themeColor: 'bg-blue-600',
        textColor: 'text-blue-600',
    },
    {
        range: [46, 75],
        title: '능동적 탐구자',
        subtitle: '창조적 활동으로 존재를 증명함',
        description:
            '지식을 쌓아두는 것이 아니라 세상을 통찰하는 도구로 사용합니다. 소유의 안락함보다는 변화의 생동감을 즐기며, 타인과 경쟁하기보다 함께 성장하는 것에서 기쁨을 찾습니다.',
        advice: '당신은 이미 생산적 인간의 삶을 살고 있습니다. 당신의 성찰을 기록으로 남겨보세요.',
        stats: { empathy: 75, freedom: 80, creation: 85 },
        match: '시장형 전략가',
        clash: '경계의 관찰자',
        themeColor: 'bg-emerald-600',
        textColor: 'text-emerald-600',
    },
    {
        range: [76, 100],
        title: '깨어있는 존재',
        subtitle: '소유의 사슬을 끊은 자유인',
        description:
            "에리히 프롬이 꿈꿨던 인간상입니다. '가진 것이 없어도 온전히 나로 존재한다'는 진리를 실천합니다. 타인을 지배하려 하지 않고, 있는 그대로의 생명을 사랑하며 공감하는 능력이 탁월합니다.",
        advice: '당신의 존재 자체가 주변에 영감이 됩니다. 그 충만한 생명력을 나누어 주세요.',
        stats: { empathy: 98, freedom: 95, creation: 90 },
        match: '능동적 탐구자',
        clash: '강박적 수집가',
        themeColor: 'bg-rose-500',
        textColor: 'text-rose-500',
    },
];

export default function FrommTestWhite() {
    const [view, setView] = useState<'main' | 'quiz' | 'result'>('main');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const resultRef = useRef<HTMLDivElement>(null);
    const router = useRouter(); // ✅ 이거 반드시 필요
    const handleAnswer = (val: number) => {
        const nextScore = score + val;
        if (currentIdx < 9) {
            setScore(nextScore);
            setCurrentIdx(currentIdx + 1);
        } else {
            setScore(nextScore);
            setView('result');
        }
    };

    const saveImage = async () => {
        if (resultRef.current === null) return;
        const dataUrl = await toPng(resultRef.current, { backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.download = 'fromm-result.png';
        link.href = dataUrl;
        link.click();
    };

    const res = RESULT_TYPES.find((t) => score * 10 >= t.range[0] && score * 10 <= t.range[1]) || RESULT_TYPES[1];

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* 메인 화면 */}
                {view === 'main' && (
                    <div className="text-center py-20 bg-white shadow-sm border border-slate-100 rounded-3xl p-10 animate-in fade-in duration-1000">
                        <h1 className="text-3xl font-light tracking-[0.1em] mb-6 leading-tight">
                            소유인가,
                            <br />
                            <span className="font-serif italic font-medium text-slate-400 text-4xl">존재인가?</span>
                        </h1>
                        <p className="text-xs text-slate-400 tracking-[0.3em] mb-12 uppercase">
                            Erich Fromm Philosophy Test
                        </p>
                        <button
                            onClick={() => setView('quiz')}
                            className="group relative px-12 py-4 bg-slate-900 text-white text-xs tracking-[0.4em] rounded-full overflow-hidden hover:pr-14 transition-all"
                        >
                            START TEST
                        </button>
                    </div>
                )}

                {/* 퀴즈 화면 */}
                {view === 'quiz' && (
                    <div className="bg-white shadow-sm border border-slate-100 rounded-3xl p-10 animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center mb-10">
                            <span className="text-[10px] font-bold tracking-widest text-slate-300">
                                QUESTION {currentIdx + 1}/10
                            </span>
                            <div className="w-32 h-1 bg-slate-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-slate-900 transition-all"
                                    style={{ width: `${(currentIdx + 1) * 10}%` }}
                                ></div>
                            </div>
                        </div>
                        <h2 className="text-xl font-medium mb-16 leading-relaxed text-center min-h-[100px]">
                            {QUESTIONS[currentIdx].q}
                        </h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => handleAnswer(0)}
                                className="w-full py-5 px-6 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm text-left flex justify-between items-center group"
                            >
                                <span>A. {QUESTIONS[currentIdx].a}</span>
                                <span className="opacity-0 group-hover:opacity-100 text-slate-300">→</span>
                            </button>
                            <button
                                onClick={() => handleAnswer(1)}
                                className="w-full py-5 px-6 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm text-left flex justify-between items-center group"
                            >
                                <span>B. {QUESTIONS[currentIdx].b}</span>
                                <span className="opacity-0 group-hover:opacity-100 text-slate-300">→</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* 결과 화면 */}
                {view === 'result' && (
                    <div className="animate-in fade-in duration-1000">
                        <div
                            ref={resultRef}
                            className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-50"
                        >
                            <p className="text-[10px] text-center tracking-[0.4em] text-slate-300 mb-10 uppercase">
                                Your Inner Essence
                            </p>

                            <div className="text-center mb-10">
                                <div className={`text-4xl font-bold mb-3 tracking-tighter ${res.textColor}`}>
                                    {res.title}
                                </div>
                                <div className="text-sm text-slate-400 font-light">{res.subtitle}</div>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="text-sm leading-relaxed text-slate-600 text-justify">
                                    {res.description}
                                </div>
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-tight">
                                        Erich Fromm's Advice
                                    </span>
                                    <p className="text-sm text-slate-700 font-medium italic">"{res.advice}"</p>
                                </div>
                            </div>

                            {/* 스탯 바 */}
                            <div className="space-y-4 mb-10">
                                {Object.entries(res.stats).map(([key, val]) => (
                                    <div key={key}>
                                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                                            <span>{key}</span>
                                            <span>{val}%</span>
                                        </div>
                                        <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${res.themeColor} opacity-70`}
                                                style={{ width: `${val}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 궁합 섹션 */}
                            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-emerald-500 mb-2 uppercase">
                                        BEST MATCH
                                    </div>
                                    <div className="text-xs font-medium text-slate-800">{res.match}</div>
                                </div>
                                <div className="text-center border-l border-slate-50">
                                    <div className="text-[10px] font-bold text-rose-400 mb-2 uppercase">CLASH WITH</div>
                                    <div className="text-xs font-medium text-slate-800">{res.clash}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            {/* 이미지 저장 */}
                            <button
                                onClick={saveImage}
                                className="flex-1 py-4 bg-slate-900 text-white font-bold text-xs tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-lg"
                            >
                                IMAGE SAVE
                            </button>

                            {/* 목록으로 */}
                            <button
                                onClick={() => router.push('/minitest')}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-semibold text-xs rounded-2xl hover:bg-slate-50 transition-all"
                            >
                                목록
                            </button>

                            {/* 다시 테스트 */}
                            <button
                                onClick={() => router.refresh()}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-semibold text-xs rounded-2xl hover:bg-slate-50 transition-all"
                            >
                                다시
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

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
