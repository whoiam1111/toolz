'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image'; // html2canvas보다 깔끔한 처리를 위해 권장

const QUESTIONS = [
    { q: '눈 뜨자마자 가장 먼저 스마트폰을 찾는가?' },
    { q: '식사 중 영상이 없으면 허전함을 느끼는가?' },
    { q: '릴스/쇼츠를 켜면 1시간이 금방 지나가는가?' },
    { q: '화장실 갈 때 스마트폰은 필수인가?' },
    { q: '알림 소리가 들리면 즉시 확인해야 하는가?' },
    { q: '영화 한 편을 정속도로 보기 힘든가?' },
    { q: '배터리가 10% 미만이면 극도로 불안한가?' },
    { q: '친구와 대화 중에도 수시로 폰을 확인하는가?' },
    { q: '아무것도 안 하고 10분 멍때리기가 고통스러운가?' },
    { q: '잠들기 직전까지 화면을 보고 있는가?' },
];

const RESULT_DATA = [
    {
        range: [0, 15],
        title: '아날로그 수도자',
        subtitle: '고도의 집중력을 소유한 존재',
        desc: '당신은 디지털 자극에 휘둘리지 않고 자신의 감각을 온전히 소유하고 있습니다. 뇌의 전두엽이 매우 건강한 상태이며, 깊은 사고와 몰입이 가능합니다.',
        status: 'Optimal',
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        diet: ['현재의 독서/명상 루틴 유지', '디지털 기기를 순수 도구로만 사용', '가끔은 완벽한 오프라인 여행 추천'],
    },
    {
        range: [16, 40],
        title: '디지털 아키텍트',
        subtitle: '의도적인 도파민 컨트롤러',
        desc: '기술을 즐기면서도 선을 넘지 않는 균형 잡힌 상태입니다. 필요할 때 폰을 내려놓을 줄 아는 절제력이 돋보입니다. 일상적인 행복에 민감하게 반응할 수 있습니다.',
        status: 'Stable',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-600',
        diet: ["주말 중 반나절은 '폰 없는 시간' 설정", '알림 설정 최소화 유지', '고강도 운동으로 건강한 도파민 생성'],
    },
    {
        range: [41, 65],
        title: '와이어드 완더러',
        subtitle: '알고리즘의 경계에 선 방랑자',
        desc: '서서히 즉각적인 보상에 뇌가 익숙해지고 있습니다. 예전보다 책 한 권을 끝까지 읽는 것이 힘들지 않나요? 지금이 브레이크를 걸어야 할 가장 중요한 타이밍입니다.',
        status: 'Caution',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
        diet: ['쇼츠/릴스 하루 30분 제한', '식사 중 스마트폰 사용 금지', '잠들기 1시간 전 종이책 읽기'],
    },
    {
        range: [66, 85],
        title: '알고리즘의 포로',
        subtitle: '자극에 소유당한 무의식',
        desc: '뇌가 강한 자극 없이는 즐거움을 느끼기 어려운 상태입니다. 일상의 소소한 일들이 지루하게 느껴지는 것은 당신 탓이 아니라 과부하된 도파민 수용체 때문입니다.',
        status: 'Warning',
        color: 'bg-orange-500',
        textColor: 'text-orange-600',
        diet: ['3일간 SNS 앱 삭제 (디톡스)', '흑백 모드(Grayscale) 설정 사용', "아무것도 안 하는 '멍때리기' 훈련"],
    },
    {
        range: [86, 100],
        title: '도파민 고스트',
        subtitle: '타버린 보상 회로의 비명',
        desc: '현실의 감각이 무디고 오직 화면 속 세상에서만 살아있음을 느낍니다. 심각한 뇌의 피로 상태이며, 이대로는 번아웃과 우울감이 찾아오기 쉽습니다. 즉각적인 외부 차단이 필요합니다.',
        status: 'Critical',
        color: 'bg-red-500',
        textColor: 'text-red-600',
        diet: [
            '일주일간 스크린 타임 2시간 제한',
            '물리적 환경 격리 (금고 활용)',
            '전문적인 상담 또는 강제적 아날로그 활동',
        ],
    },
];

export default function DopamineTest() {
    const router = useRouter();
    const [view, setView] = useState<'main' | 'quiz' | 'result'>('main');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const resultRef = useRef<HTMLDivElement>(null);

    const handleAnswer = (isYes: boolean) => {
        const nextScore = isYes ? score + 10 : score;
        if (currentIdx < QUESTIONS.length - 1) {
            setScore(nextScore);
            setCurrentIdx(currentIdx + 1);
        } else {
            setScore(nextScore);
            setView('result');
        }
    };

    const saveImage = async () => {
        if (!resultRef.current) return;
        try {
            const dataUrl = await toPng(resultRef.current, { backgroundColor: '#ffffff', quality: 1 });
            const link = document.createElement('a');
            link.download = `dopamine-report-${new Date().getTime()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('이미지 저장 실패:', err);
        }
    };

    const res = RESULT_DATA.find((r) => score >= r.range[0] && score <= r.range[1]) || RESULT_DATA[2];

    return (
        <div className="min-h-screen bg-[#F2F4F7] text-slate-900 font-sans flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
                {/* MAIN VIEW */}
                {view === 'main' && (
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-12 text-center animate-in fade-in duration-700">
                        <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-[10px] font-bold tracking-[0.2em] text-slate-400 mb-8 uppercase">
                            Neuroscience Scan
                        </div>
                        <h1 className="text-3xl font-light leading-tight mb-4">
                            나의 뇌는 지금
                            <br />
                            <span className="font-bold text-slate-900">무엇에 소유당하고 있는가?</span>
                        </h1>
                        <p className="text-sm text-slate-400 mb-12 font-light">도파민 중독 지수 정밀 스캔</p>

                        <div className="relative w-24 h-24 mx-auto mb-16">
                            <div className="absolute inset-0 border-2 border-slate-100 rounded-full animate-ping"></div>
                            <div className="relative bg-white border border-slate-100 w-full h-full rounded-full flex items-center justify-center text-3xl shadow-sm">
                                🧠
                            </div>
                        </div>

                        <button
                            onClick={() => setView('quiz')}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98]"
                        >
                            SCAN START
                        </button>
                    </div>
                )}

                {/* QUIZ VIEW */}
                {view === 'quiz' && (
                    <div className="bg-white rounded-[2.5rem] shadow-xl p-10 animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                Question {currentIdx + 1}/10
                            </span>
                            <div className="w-24 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-slate-900 transition-all duration-300"
                                    style={{ width: `${(currentIdx + 1) * 10}%` }}
                                ></div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-medium text-center mb-20 leading-snug min-h-[80px] break-keep">
                            {QUESTIONS[currentIdx].q}
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleAnswer(true)}
                                className="py-6 border border-slate-100 rounded-3xl hover:bg-slate-900 hover:text-white transition-all text-lg font-bold"
                            >
                                YES
                            </button>
                            <button
                                onClick={() => handleAnswer(false)}
                                className="py-6 border border-slate-100 rounded-3xl hover:bg-slate-900 hover:text-white transition-all text-lg font-bold"
                            >
                                NO
                            </button>
                        </div>
                    </div>
                )}

                {/* RESULT VIEW */}
                {view === 'result' && (
                    <div className="animate-in zoom-in-95 duration-700">
                        <div
                            ref={resultRef}
                            className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <p
                                        className={`text-[10px] font-black tracking-widest mb-1 uppercase ${res.textColor}`}
                                    >
                                        {res.status} Level
                                    </p>
                                    <h2 className="text-4xl font-black tracking-tighter">{res.title}</h2>
                                </div>
                                <div className="text-4xl">🔬</div>
                            </div>

                            <div className="mb-10">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter italic">
                                        Dopamine Saturation
                                    </span>
                                    <span className={`text-3xl font-black ${res.textColor}`}>{score}%</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${res.color} transition-all duration-1000`}
                                        style={{ width: `${score}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                                    <p className="text-sm leading-relaxed text-slate-600 break-keep font-medium">
                                        "{res.desc}"
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
                                        Digital Diet Solution
                                    </h3>
                                    <div className="grid gap-2">
                                        {res.diet.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 bg-white border border-slate-50 p-4 rounded-2xl shadow-sm"
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${res.color}`}></span>
                                                <span className="text-xs font-semibold text-slate-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <p className="text-[9px] text-center text-slate-300 tracking-[0.3em] uppercase border-t border-slate-50 pt-8">
                                Mental Health Lab © 2026
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-4 gap-3">
                            <button
                                onClick={saveImage}
                                className="col-span-2 py-5 bg-slate-900 text-white rounded-2xl font-bold text-xs tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                            >
                                SAVE REPORT
                            </button>
                            <button
                                onClick={() => router.refresh()}
                                className="col-span-1 py-5 bg-white border border-slate-100 rounded-2xl text-xs flex items-center justify-center"
                            >
                                🔄
                            </button>
                            <button
                                onClick={() => router.push('/minitest')}
                                className="col-span-1 py-5 bg-white border border-slate-100 rounded-2xl text-xs flex items-center justify-center"
                            >
                                LIST
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
