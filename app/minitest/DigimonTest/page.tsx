'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

// --- 데이터 구성 ---
const QUESTIONS = [
    {
        q: '낯선 디지털 월드에 떨어지면 당신은?',
        a: '새로운 세상을 향해 신나게 뛰어간다',
        b: '안전한 곳인지 신중히 주변을 살핀다',
    },
    { q: '동료가 적에게 붙잡혔다면?', a: '앞뒤 재지 않고 구하러 달려간다', b: '이길 수 있는 전략을 먼저 짠다' },
    {
        q: '팀을 이끌게 되었을 때 당신의 스타일은?',
        a: '넘치는 에너지로 모두를 독려하는 리더',
        b: '조용히 뒤에서 부족한 점을 채우는 조력자',
    },
    {
        q: '눈앞에 거대한 장애물이 나타난다면?',
        a: '일단 부딪히며 돌파구를 찾는다',
        b: '우회하거나 효율적인 방법을 계산한다',
    },
    {
        q: '당신이 생각하는 가장 큰 가치는?',
        a: '뜨거운 용기와 절대 포기하지 않는 마음',
        b: '냉철한 지혜와 변하지 않는 우정',
    },
    {
        q: '새로운 기술을 배울 때 당신은?',
        a: '실전에서 직접 써보며 몸으로 익힌다',
        b: '작동 원리와 이론을 먼저 완벽히 이해한다',
    },
    {
        q: '갈등 상황이 생겼을 때 대처법은?',
        a: '솔직하게 속마음을 다 털어놓고 푼다',
        b: '잠시 거리를 두고 이성적으로 생각한다',
    },
    { q: '주변 사람들이 말하는 당신의 이미지는?', a: '밝고 열정적인 분위기 메이커', b: '침착하고 믿음직한 브레인' },
    { q: '진화할 수 있다면 어떤 모습이 되고 싶은가?', a: '압도적인 파괴력의 용사', b: '신비롭고 영리한 마법사' },
    {
        q: '모험이 끝난 뒤 당신에게 남는 것은?',
        a: '함께 싸운 동료들과의 뜨거운 추억',
        b: '세상의 진리에 한 걸음 다가간 지식',
    },
];

const RESULTS: Record<string, any> = {
    아구몬: {
        emoji: '🦖',
        color: 'bg-[#FFD700]',
        tags: ['용기 충만', '직진 본능', '단순 명쾌', '의리파'],
        desc: '특유의 열정을 품고 자라는 당신은 누구보다 용감하고 정열적인 존재입니다. 복잡하게 생각하기보다 행동으로 본질을 뚫어 보는 능력이 탁월합니다. 불의를 보면 참지 못하고 정의를 위해 앞장서는 것을 좋아하며, 감정에 솔직하여 언제나 주변에 활기를 불어넣습니다. 가끔은 너무 성급하게 결정하여 시행착오를 겪기도 하지만, 포기를 모르는 끈기로 결국 목표를 달성하고야 맙니다.',
        best: '파피몬',
        worst: '플롯트몬',
    },
    파피몬: {
        emoji: '🐺',
        color: 'bg-[#ADD8E6]',
        tags: ['신중한 사색', '우정의 상징', '냉철한 이성', '츤데레'],
        desc: '겉으로는 차가워 보이지만 속은 누구보다 따뜻한 당신은 신중하고 독립적인 존재입니다. 날카로운 분석력과 전략적인 사고로 문제의 핵심을 꿰뚫어 보는 능력이 탁월합니다. 논리적이고 계획적인 행동을 좋아하며, 쉽게 흔들리지 않고 언제나 가장 효율적인 해결책을 찾아냅니다. 인간관계에서도 호불호가 명확하여 깊은 유대감을 가진 소수의 사람과 끈끈한 관계를 유지합니다.',
        best: '아구몬',
        worst: '가트몬',
    },
    텐타몬: {
        emoji: '🐞',
        color: 'bg-[#FF6347]',
        tags: ['지식 탐구', '호기심 천국', '재치 만점', '정보왕'],
        desc: '세상의 모든 원리가 궁금한 당신은 지적인 호기심이 매우 강한 존재입니다. 새로운 정보를 습득하고 분석하는 것을 즐기며, 남들이 보지 못하는 세세한 부분까지 캐치하는 능력이 좋습니다. 위트 있는 말솜씨로 주변을 즐겁게 만들면서도, 중요한 순간에는 방대한 지식을 바탕으로 팀의 나침반 역할을 수행합니다.',
        best: '쉬라몬',
        worst: '피요몬',
    },
    팔몬: {
        emoji: '🌸',
        color: 'bg-[#90EE90]',
        tags: ['감성 풍부', '솔직 당당', '예술적 기질', '자유 영혼'],
        desc: '자기표현이 확실하고 감수성이 풍부한 당신은 자연스러운 매력이 돋보이는 존재입니다. 남의 눈치를 보기보다 자신의 감정에 충실하며, 아름다운 가치를 찾아내는 미적 감각이 뛰어납니다. 다소 고집스럽게 보일 때도 있지만, 그것은 자신만의 확고한 세계관이 있기 때문입니다. 진심 어린 공감을 통해 타인의 마음을 녹이는 힘을 가지고 있습니다.',
        best: '피요몬',
        worst: '텐타몬',
    },
    // 추가 타입(쉬라몬, 피요몬 등)도 동일한 형식으로 확장 가능합니다.
};

export default function DigimonTest() {
    const [view, setView] = useState<'main' | 'quiz' | 'result'>('main');
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0); // B 선택 개수
    const resultRef = useRef<HTMLDivElement>(null);

    const handleAnswer = (isB: boolean) => {
        if (isB) setScore((prev) => prev + 1);
        if (step < QUESTIONS.length - 1) setStep(step + 1);
        else setView('result');
    };

    const getResultKey = () => {
        if (score <= 2) return '아구몬';
        if (score <= 5) return '팔몬';
        if (score <= 8) return '텐타몬';
        return '파피몬';
    };

    const result = RESULTS[getResultKey()];

    const saveImage = async () => {
        if (!resultRef.current) return;
        const canvas = await html2canvas(resultRef.current);
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'digimon-result.png';
        link.click();
    };

    return (
        <div className="min-h-screen bg-[#F0F4C3] flex items-center justify-center p-4 font-sans text-slate-800">
            <div className="w-full max-w-md bg-white border-2 border-[#C0CA33] shadow-xl rounded-lg overflow-hidden">
                {/* 메인 화면 */}
                {view === 'main' && (
                    <div className="p-10 text-center">
                        <h2 className="text-[#C0CA33] font-bold mb-2">디지몬 파트너 진단</h2>
                        <h1 className="text-3xl font-black mb-8 leading-tight">
                            나와 어울리는
                            <br />
                            디지몬 성격 테스트
                        </h1>
                        <div className="text-8xl mb-12 animate-bounce">🥚</div>
                        <button
                            onClick={() => setView('quiz')}
                            className="w-full py-4 bg-[#C0CA33] text-white font-black text-xl rounded-full shadow-lg hover:brightness-105 transition-all"
                        >
                            테스트 시작하기
                        </button>
                    </div>
                )}

                {/* 퀴즈 진행 */}
                {view === 'quiz' && (
                    <div className="p-8">
                        <div className="flex justify-between items-end mb-8">
                            <span className="text-[#C0CA33] font-black text-2xl italic">Q{step + 1}</span>
                            <span className="text-xs font-bold opacity-40">{step + 1} / 10</span>
                        </div>
                        <h2 className="text-xl font-bold mb-16 leading-relaxed break-keep min-h-[4rem]">
                            {QUESTIONS[step].q}
                        </h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => handleAnswer(false)}
                                className="w-full py-5 px-6 border-2 border-[#E1E4E8] rounded-2xl font-bold text-left hover:border-[#C0CA33] hover:bg-[#F9FBE7] transition-all"
                            >
                                {QUESTIONS[step].a}
                            </button>
                            <button
                                onClick={() => handleAnswer(true)}
                                className="w-full py-5 px-6 border-2 border-[#E1E4E8] rounded-2xl font-bold text-left hover:border-[#C0CA33] hover:bg-[#F9FBE7] transition-all"
                            >
                                {QUESTIONS[step].b}
                            </button>
                        </div>
                    </div>
                )}

                {/* 결과 화면 */}
                {view === 'result' && (
                    <div className="p-4 bg-[#E1F5FE]">
                        <div
                            ref={resultRef}
                            className="bg-white p-4 border border-[#BDBDBD] rounded-sm"
                        >
                            <div className="bg-[#DCE775] text-center py-1 font-bold text-sm mb-4">
                                툴즈 디지몬 성격 테스트
                            </div>

                            <div className="flex gap-2 mb-4">
                                <div
                                    className={`w-1/3 aspect-square ${result.color} border border-black flex flex-col items-center justify-center`}
                                >
                                    <span className="text-5xl mb-2">{result.emoji}</span>
                                    <span className="text-[10px] font-black">
                                        {result.scoreName} {getResultKey()}
                                    </span>
                                </div>
                                <div className="w-2/3 grid grid-cols-2 gap-1">
                                    {result.tags.map((tag: string) => (
                                        <div
                                            key={tag}
                                            className="bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center text-[10px] font-bold"
                                        >
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#F5F5F5] p-4 text-[11px] leading-relaxed text-justify mb-4 border border-[#EEEEEE]">
                                {result.desc}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="border border-[#EEEEEE]">
                                    <div className="bg-[#DCE775] text-center text-[10px] font-bold py-0.5">
                                        찰떡 궁합 디지몬
                                    </div>
                                    <div className="p-2 flex flex-col items-center">
                                        <span className="text-2xl mb-1">🤝</span>
                                        <span className="text-[10px] font-bold">{result.best}</span>
                                    </div>
                                </div>
                                <div className="border border-[#EEEEEE]">
                                    <div className="bg-[#DCE775] text-center text-[10px] font-bold py-0.5">
                                        최악 궁합 디지몬
                                    </div>
                                    <div className="p-2 flex flex-col items-center">
                                        <span className="text-2xl mb-1">💔</span>
                                        <span className="text-[10px] font-bold">{result.worst}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={saveImage}
                                className="w-full py-4 bg-[#DCE775] font-bold rounded-md shadow-sm"
                            >
                                결과 이미지 저장하기
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-4 bg-white font-bold rounded-md border border-[#DCE775]"
                            >
                                다시 해보기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
