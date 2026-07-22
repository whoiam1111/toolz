'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { questions, PERFUME_DATA, PerfumeInfo } from '@/app/lib/data';
import { motion } from 'framer-motion';

type ZoneType = 'heart' | 'head' | 'gut';

interface ZoneState {
    heart?: number;
    head?: number;
    gut?: number;
}

const ZONES: {
    key: ZoneType;
    name: string;
    englishName: string;
    subTitle: string;
    badgeBg: string;
}[] = [
    {
        key: 'heart',
        name: '가슴형',
        englishName: 'TOP ZONE',
        subTitle: '감성과 내면의 끌림',
        badgeBg: 'bg-[#E8DED1]/60 text-[#6B5E51]',
    },
    {
        key: 'head',
        name: '머리형',
        englishName: 'MIDDLE ZONE',
        subTitle: '이성과 명확한 분석',
        badgeBg: 'bg-[#E8DED1]/60 text-[#6B5E51]',
    },
    {
        key: 'gut',
        name: '장형',
        englishName: 'BOTTOM ZONE',
        subTitle: '본능과 직관의 에너지를 담은',
        badgeBg: 'bg-[#E8DED1]/60 text-[#6B5E51]',
    },
];

export default function ResultPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentZone = (params.zone as ZoneType) || 'heart';
    const clientid = searchParams.get('clientid') || 'GUEST';
    const answersParam = searchParams.get('answers');

    const [zoneResults, setZoneResults] = useState<ZoneState>({});
    const [isCalculated, setIsCalculated] = useState(false);

    useEffect(() => {
        const savedData: ZoneState = JSON.parse(localStorage.getItem(`perfume_${clientid}`) || '{}');

        if (answersParam) {
            const scores: Record<number, number> = {};

            answersParam.split(',').forEach((item) => {
                const [qId, scoreStr] = item.split('-');
                const score = parseInt(scoreStr, 10);
                const foundQ = questions.find((q) => q.id === qId);
                if (foundQ) {
                    scores[foundQ.typeNumber] = (scores[foundQ.typeNumber] || 0) + score;
                }
            });

            let maxScore = -1;
            let winningId = 1;
            Object.entries(scores).forEach(([pId, totalScore]) => {
                if (totalScore > maxScore) {
                    maxScore = totalScore;
                    winningId = Number(pId);
                }
            });

            savedData[currentZone] = winningId;
            localStorage.setItem(`perfume_${clientid}`, JSON.stringify(savedData));
        }

        setZoneResults(savedData);
        setIsCalculated(true);
    }, [answersParam, currentZone, clientid]);

    if (!isCalculated) {
        return (
            <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center text-[#786C5E] gap-3">
                <p className="font-serif italic text-sm tracking-widest animate-pulse">
                    Blending your personal notes...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F4EE] text-[#4A4238] px-4 py-12 flex flex-col items-center justify-center font-serif relative overflow-hidden">
            {/* 햇살이 감도는 듯한 은은한 소프트 워밍 그라데이션 */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#EFE8DC] to-transparent rounded-full blur-[100px] pointer-events-none opacity-70" />

            {/* Header */}
            <header className="text-center mb-10 z-10">
                <span className="text-[10px] tracking-[0.3em] text-[#8C7A6B] uppercase font-sans border-b border-[#D8CFC4] pb-1">
                    PERFUME PROFILE · {clientid}
                </span>
                <h1 className="text-2xl md:text-3xl font-normal tracking-wide text-[#383129] mt-3 font-serif italic">
                    Invisible, Unforgettable.
                </h1>
                <p className="text-xs text-[#8C7A6B] font-sans mt-2 font-light">
                    당신의 세 가지 내면 영역에서 피어난 향의 기록
                </p>
            </header>

            {/* 3-Zone Perfume Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl z-10">
                {ZONES.map((z) => {
                    const perfumeId = zoneResults[z.key];
                    const perfume: PerfumeInfo | null = perfumeId ? PERFUME_DATA[perfumeId] : null;
                    const isCompleted = Boolean(perfume);

                    return (
                        <motion.div
                            key={z.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: ZONES.indexOf(z) * 0.15 }}
                            className={`relative w-full rounded-2xl p-7 flex flex-col justify-between transition-all duration-500 shadow-sm ${
                                isCompleted
                                    ? 'bg-[#FCFAF7] border border-[#E6DDD0] shadow-[#D8CFCE]/20 shadow-md'
                                    : 'bg-[#F0EADF]/50 border border-dashed border-[#D8CEBF]'
                            }`}
                        >
                            {/* 미완료(SEALED) 상태 */}
                            {!isCompleted ? (
                                <div className="h-[400px] flex flex-col items-center justify-center text-center p-4">
                                    <span className="text-xs font-sans tracking-[0.25em] text-[#A39585] uppercase mb-1">
                                        {z.englishName}
                                    </span>
                                    <h3 className="text-lg text-[#5E5246] font-normal mb-2">{z.name}</h3>
                                    <p className="text-xs text-[#9C8F80] font-sans font-light leading-relaxed mb-6">
                                        {z.subTitle}
                                    </p>

                                    <div className="w-12 h-12 rounded-full border border-[#D1C5B4] flex items-center justify-center text-xs text-[#A39585] font-sans">
                                        ✦
                                    </div>
                                    <p className="text-[11px] font-sans text-[#A39585] mt-4 font-light">
                                        부스 QR을 찍으면 향수가 채워집니다.
                                    </p>
                                </div>
                            ) : (
                                /* 완료(REVEALED) - 이미지 라벨 감성 노출 */
                                <div className="min-h-[400px] flex flex-col justify-between">
                                    <div>
                                        {/* Zone Badge */}
                                        <div className="flex items-center justify-between border-b border-[#ECE4DA] pb-3 mb-5">
                                            <span
                                                className={`text-[10px] font-sans tracking-widest uppercase px-2.5 py-1 rounded ${z.badgeBg}`}
                                            >
                                                {z.englishName}
                                            </span>
                                            <span className="text-[10px] font-sans text-[#A39585] tracking-widest">
                                                No. 0{perfume?.id}
                                            </span>
                                        </div>

                                        {/* Perfume Title */}
                                        <div className="text-center my-4">
                                            <p className="text-[10px] font-sans tracking-[0.3em] text-[#9C8F80] uppercase mb-1">
                                                EAU DE PARFUM
                                            </p>
                                            <h2 className="text-2xl text-[#3A322A] font-serif font-normal tracking-wide">
                                                {perfume?.title}
                                            </h2>
                                        </div>

                                        {/* 이미지 느낌의 추천 키워드 태그 */}
                                        <div className="my-5 pt-3 border-t border-[#ECE4DA] text-center">
                                            <p className="text-[10px] font-sans text-[#A39585] tracking-widest uppercase mb-2">
                                                ✦ 추천 이미지
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-1.5 font-sans">
                                                {perfume?.imageTags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-[#F3EDE3] text-[#6E6153] text-[11px] px-3 py-1 rounded-full font-light border border-[#E4DACD]"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 향수 서사 / 설명 */}
                                        <div className="text-center space-y-1 text-xs text-[#5C5043] font-light leading-relaxed my-5">
                                            {perfume?.description.map((line, idx) => (
                                                <p key={idx}>{line}</p>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main Notes */}
                                    {perfume?.mainNotes && (
                                        <div className="border-t border-[#ECE4DA] pt-4 text-center">
                                            <p className="text-[9px] font-sans tracking-[0.25em] text-[#A39585] uppercase">
                                                Main Notes
                                            </p>
                                            <p className="text-xs text-[#7A6A59] font-serif italic mt-1">
                                                {perfume.mainNotes.join(' · ')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Floating CTA */}
            <footer className="mt-12 text-center z-10">
                {Object.keys(zoneResults).length === 3 ? (
                    // <motion.button
                    //     onClick={() =>
                    //         router.push(`/trial/emotion/consulting?clientid=${encodeURIComponent(clientid)}`)
                    //     }
                    //     className="py-4 px-10 bg-[#3A322A] hover:bg-[#25201A] text-[#F7F4EE] font-sans text-xs tracking-[0.2em] uppercase rounded-full shadow-lg transition duration-300"
                    //     whileHover={{ scale: 1.02 }}
                    //     whileTap={{ scale: 0.98 }}
                    // >
                    //     Thank you for your scent — 상담 가이드 확인하기
                    // </motion.button>
                    <></>
                ) : (
                    <div className="font-sans text-xs text-[#8C7A6B] font-light tracking-wide bg-[#EFE8DC]/80 px-6 py-3 rounded-full border border-[#D8CFC4]">
                        세 가지 향을 모두 만날 때 완벽한 레시피가 완성됩니다 ({Object.keys(zoneResults).length} / 3)
                    </div>
                )}
            </footer>
        </div>
    );
}
