'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas'; // 라이브러리 임포트

const RESULT_DETAILS: Record<string, any> = {
    '유행의 파도술사': {
        tags: ['#얼리어답터', '#호기심천국', '#인싸의길', '#변화무쌍', '#트렌드세터', '#실행력갑'],
        longDesc:
            '세상의 모든 변화를 가장 먼저 흡수하는 유행의 선두주자입니다. 새로운 정보가 들어오면 직접 경험해봐야 직성이 풀리며, 주변 사람들에게 트렌드를 전파하는 역할을 즐깁니다.',
        good: { name: '중심 잡는 관찰자', emoji: '🧐' },
        bad: { name: '고고한 독고다이', emoji: '🌵' },
        color: 'bg-[#D4E96E]',
    },
    '트렌디한 센스쟁이': {
        tags: ['#센스쟁이', '#검증된취향', '#조화로운', '#적응왕', '#스마트소비', '#매력만점'],
        longDesc:
            '센스 있게 유행을 받아들일 줄 아는 분입니다. 무작정 따라하기보다 나에게 잘 어울리는지를 먼저 고민하며, 적절한 조화를 찾는 능력이 탁월합니다.',
        good: { name: '고고한 독고다이', emoji: '🌵' },
        bad: { name: '유행의 파도술사', emoji: '🌊' },
        color: 'bg-[#FFCFE3]',
    },
    '중심 잡는 관찰자': {
        tags: ['#신중함', '#주관뚜렷', '#필터링천재', '#실속파', '#유행관찰', '#나만의길'],
        longDesc:
            '남들이 다 한다고 해서 쉽게 휩쓸리지 않습니다. 유행이 충분히 검증된 후에야 나에게 필요한 것만 쏙쏙 골라내는 영리한 분이시군요.',
        good: { name: '유행의 파도술사', emoji: '🌊' },
        bad: { name: '트렌디한 센스쟁이', emoji: '✨' },
        color: 'bg-[#CEE5FF]',
    },
    '고고한 독고다이': {
        tags: ['#마이웨이', '#독립심', '#클래식선호', '#유행무시', '#확고한취향', '#자유영혼'],
        longDesc:
            '세상의 속도와 상관없이 나만의 리듬으로 살아갑니다. 유행은 주기적으로 바뀌는 피곤한 굴레일 뿐, 본인의 취향과 신념이 훨씬 소중합니다.',
        good: { name: '트렌디한 센스쟁이', emoji: '✨' },
        bad: { name: '중심 잡는 관찰자', emoji: '🧐' },
        color: 'bg-[#FFE79B]',
    },
};

const questions = [
    {
        id: 1,
        text: '새로운 유행이 시작되면 나는?',
        a: '나도 빨리 해보고 싶어 안달 난다',
        b: '사람들이 얼마나 하나 지켜본다',
    },
    {
        id: 2,
        text: '친구가 유행하는 옷을 입고 왔을 때 나의 반응은?',
        a: '오! 이거 요즘 핫한 거잖아? 예쁘다!',
        b: "그냥 '새 옷 샀네' 하고 별 생각 없다",
    },
    {
        id: 3,
        text: '주말에 가고 싶은 카페는?',
        a: '인스타에서 난리 난 웨이팅 맛집',
        b: '그냥 내가 평소 가던 편안한 단골집',
    },
    {
        id: 4,
        text: '유행하는 챌린지 영상을 보면?',
        a: '나도 한번 찍어서 올려볼까 고민한다',
        b: '보는 건 재밌지만 직접 하긴 귀찮다',
    },
    {
        id: 5,
        text: '내가 산 물건이 갑자기 유행하기 시작한다면?',
        a: '역시 내 안목! 유행을 앞서간 것 같아 뿌듯하다',
        b: '너무 흔해지는 것 같아서 정이 떨어진다',
    },
    {
        id: 6,
        text: '물건을 살 때 더 중요한 기준은?',
        a: '요즘 어떤 브랜드가 제일 잘 나가는지',
        b: '브랜드 상관없이 내 눈에 예쁜지',
    },
    {
        id: 7,
        text: '신조어를 들었을 때 나의 모습은?',
        a: '검색해서 뜻을 알아내고 바로 써먹는다',
        b: '굳이 그런 말까지 써야 하나 싶다',
    },
    {
        id: 8,
        text: "쇼핑하러 갔는데 점원이 '요즘 제일 잘나가요'라고 한다면?",
        a: '귀가 솔깃해서 자세히 살펴본다',
        b: '부담스러워서 다른 쪽으로 피한다',
    },
    {
        id: 9,
        text: "다들 'A'가 유행이라고 할 때 내 취향은 'B'라면?",
        a: "일단 유행인 'A'도 한번 시도해본다",
        b: "남들이 뭐라든 꿋꿋하게 'B'를 선택한다",
    },
    { id: 10, text: '나에게 유행이란?', a: '세상과 소통하는 즐거운 방법', b: '주기적으로 바뀌는 피곤한 굴레' },
    {
        id: 11,
        text: '친구가 내 스타일이 유행에 뒤처졌다고 한다면?',
        a: '충격받고 바로 쇼핑 리스트를 짠다',
        b: '이게 내 개성인데 뭐 어쩌라고 생각한다',
    },
    {
        id: 12,
        text: '새로운 기술이나 가전제품이 출시되면?',
        a: '사전예약 페이지를 기웃거린다',
        b: '나중에 가격 떨어지고 후기 많아지면 본다',
    },
];

export default function TestItQuiz() {
    const [currentIdx, setCurrentIdx] = useState(-1);
    const [answers, setAnswers] = useState<string[]>([]);
    const resultRef = useRef<HTMLDivElement>(null); // 이미지 캡처를 위한 Ref

    const handleStart = () => {
        setCurrentIdx(0);
        setAnswers([]);
    };

    const handleAnswer = (type: string) => {
        const nextAnswers = [...answers, type];
        setAnswers(nextAnswers);
        setCurrentIdx(currentIdx + 1);
    };

    // [핵심 기능] 이미지 저장 함수
    const saveAsImage = async () => {
        if (!resultRef.current) return;

        try {
            const canvas = await html2canvas(resultRef.current, {
                scale: 2, // 화질 향상
                backgroundColor: '#ffffff',
                useCORS: true, // 외부 이미지 사용 시 필요
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `test-it-result-${Date.now()}.png`;
            link.click();
        } catch (error) {
            console.error('이미지 저장 중 오류 발생:', error);
            alert('이미지 저장에 실패했습니다.');
        }
    };

    const calculateResult = () => {
        const countA = answers.filter((a) => a === 'a').length;
        let title = '';
        let emoji = '';
        if (countA >= 10) {
            title = '유행의 파도술사';
            emoji = '🌊';
        } else if (countA >= 7) {
            title = '트렌디한 센스쟁이';
            emoji = '✨';
        } else if (countA >= 4) {
            title = '중심 잡는 관찰자';
            emoji = '🧐';
        } else {
            title = '고고한 독고다이';
            emoji = '🌵';
        }
        return { title, emoji, ...RESULT_DETAILS[title] };
    };

    const result = calculateResult();

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa] p-4 font-sans">
            <div className="w-full max-w-md bg-white min-h-[600px] shadow-xl rounded-[2.5rem] overflow-hidden flex flex-col relative border border-gray-100">
                {/* 메인 화면 */}
                {/* 메인 화면 */}
                {currentIdx === -1 && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                        {/* 상단 뱃지 스타일 */}
                        <div className="mb-4 px-4 py-1 bg-black text-white text-[10px] font-black tracking-[0.2em] rounded-full">
                            TREND SENSITIVITY TEST
                        </div>

                        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">유행 민감도 테스트</h1>
                        <p className="text-gray-500 text-sm mb-12 font-bold italic">
                            "나는 유행의 파도를 타는가, 맞서는가?"
                        </p>

                        {/* 메인 아이콘 박스 - 결과지와 통일감 있는 디자인 */}
                        <div className="relative mb-14">
                            {/* 뒤쪽 그림자 레이어 */}
                            <div className="absolute inset-0 bg-indigo-500 translate-x-3 translate-y-3 rounded-3xl border-2 border-black"></div>
                            {/* 앞쪽 아이콘 레이어 */}
                            <div className="relative bg-white w-44 h-44 rounded-3xl border-[2.5px] border-black flex items-center justify-center text-7xl shadow-sm">
                                <span className="animate-bounce">🕶️</span>
                            </div>
                        </div>

                        {/* 시작 버튼 - 테스트잇 스타일의 볼드한 버튼 */}
                        <div className="w-full space-y-4">
                            <button
                                onClick={handleStart}
                                className="w-full py-5 bg-[#D4E96E] text-black border-[2.5px] border-black rounded-2xl font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95"
                            >
                                테스트 시작하기
                            </button>
                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                                © 2026 TEST IT STYLE PROJECT
                            </p>
                        </div>
                    </div>
                )}

                {/* 퀴즈 진행 화면 */}
                {currentIdx >= 0 && currentIdx < questions.length && (
                    <div className="flex-1 flex flex-col p-8 pt-12">
                        <div className="w-full h-2 bg-gray-100 rounded-full mb-16 overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <span className="text-indigo-500 font-black text-xs tracking-[0.3em] mb-4">
                                QUESTION {currentIdx + 1}
                            </span>
                            <h2 className="text-2xl font-bold text-gray-800 mb-16 leading-snug break-keep">
                                {questions[currentIdx].text}
                            </h2>

                            <div className="w-full space-y-4">
                                <button
                                    onClick={() => handleAnswer('a')}
                                    className="w-full py-5 px-6 border-2 border-gray-100 rounded-[1.5rem] text-gray-700 font-bold hover:border-indigo-400 hover:bg-indigo-50 transition-all active:scale-[0.97] bg-white shadow-sm"
                                >
                                    {questions[currentIdx].a}
                                </button>
                                <button
                                    onClick={() => handleAnswer('b')}
                                    className="w-full py-5 px-6 border-2 border-gray-100 rounded-[1.5rem] text-gray-700 font-bold hover:border-indigo-400 hover:bg-indigo-50 transition-all active:scale-[0.97] bg-white shadow-sm"
                                >
                                    {questions[currentIdx].b}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 결과 화면 */}
                {currentIdx === questions.length && (
                    <div className="flex-1 flex flex-col p-6 animate-in fade-in duration-1000 overflow-y-auto">
                        {/* 캡처할 영역 시작 (ref 연결) */}
                        <div
                            ref={resultRef}
                            className="p-2 bg-white"
                        >
                            <div className="border-[2.5px] border-black p-1 rounded-sm">
                                <div className="border border-black bg-white overflow-hidden">
                                    <div
                                        className={`text-center py-3 border-b border-black font-black text-xs tracking-widest ${result.color}`}
                                    >
                                        성격 분석 결과 카드
                                    </div>
                                    <div className="flex border-b border-black">
                                        <div className="w-1/3 border-r border-black flex flex-col items-center justify-center p-4 bg-white">
                                            <span className="text-5xl mb-3">{result.emoji}</span>
                                            <div
                                                className={`text-[10px] font-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${result.color}`}
                                            >
                                                {result.title}
                                            </div>
                                        </div>
                                        <div className="w-2/3 grid grid-cols-2 text-[9px] font-bold italic">
                                            {result.tags.map((tag: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className={`flex items-center justify-center border-b border-l border-black p-2.5 ${
                                                        [0, 3, 4].includes(i) ? 'bg-white' : 'bg-gray-50'
                                                    }`}
                                                >
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-5 text-[11px] leading-6 border-b border-black text-justify font-medium bg-white">
                                        {result.longDesc}
                                    </div>
                                    <div className="grid grid-cols-2 text-center text-[10px] font-black">
                                        <div className="border-r border-black">
                                            <div
                                                className={`${result.color} py-2 border-b border-black uppercase tracking-tighter`}
                                            >
                                                Best Chemistry
                                            </div>
                                            <div className="p-4 flex flex-col items-center bg-white">
                                                <span className="text-2xl mb-1">{result.good.emoji}</span>
                                                <span className="whitespace-nowrap">{result.good.name}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50">
                                            <div className="bg-gray-200 py-2 border-b border-black uppercase tracking-tighter text-gray-500">
                                                Worst Chemistry
                                            </div>
                                            <div className="p-4 flex flex-col items-center bg-white">
                                                <span className="text-2xl mb-1">{result.bad.emoji}</span>
                                                <span className="whitespace-nowrap text-gray-400">
                                                    {result.bad.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 캡처할 영역 끝 */}

                        <div className="mt-8 space-y-3 pb-4">
                            <button
                                onClick={saveAsImage} // 함수 연결
                                className="w-full py-4 bg-white border-2 border-black font-black text-sm rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                이미지로 저장하기
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentIdx(-1);
                                }}
                                className="w-full py-4 bg-black text-white font-black text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all"
                            >
                                다시 테스트하기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
