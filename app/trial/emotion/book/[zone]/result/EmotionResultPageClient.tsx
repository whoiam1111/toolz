'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { questions, PERFUME_DATA_BOOK, PerfumeInfoBook } from '@/app/lib/data';
import { motion } from 'framer-motion';

type ZoneType = 'head' | 'heart' | 'gut';

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
        key: 'head',
        name: '머리형',
        englishName: 'TOP ZONE',
        subTitle: '이성과 명확한 분석',
        badgeBg: 'bg-[#E8DED1] text-[#4A4238]',
    },
    {
        key: 'heart',
        name: '가슴형',
        englishName: 'MIDDLE ZONE',
        subTitle: '감성과 내면의 끌림',
        badgeBg: 'bg-[#E8DED1] text-[#4A4238]',
    },
    {
        key: 'gut',
        name: '장형',
        englishName: 'BOTTOM ZONE',
        subTitle: '본능과 직관의 에너지를 담은',
        badgeBg: 'bg-[#E8DED1] text-[#4A4238]',
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
            <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center text-[#4A4238] gap-3">
                <p className="font-sans text-sm tracking-widest">결과를 분석하고 있습니다...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F4EE] text-[#2C2620] px-4 py-12 flex flex-col items-center justify-center font-sans relative overflow-hidden">
            {/* 햇살 배경 효과 */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#EFE8DC] to-transparent rounded-full blur-[100px] pointer-events-none opacity-70" />

            {/* Header */}
            <header className="text-center mb-10 z-10">
                <span className="text-xs tracking-[0.2em] text-[#6B5E51] uppercase font-medium border-b border-[#D8CFC4] pb-1">
                    PERFUME PROFILE · {clientid}
                </span>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-normal text-[#2C2620] mt-3">
                    나만의 향기와 나에게 필요한 문장
                </h1>
                <p className="text-xs text-[#6B5E51] mt-2 font-normal">
                    세 가지 내면 영역에서 피어난 향과 문장의 기록입니다.
                </p>
            </header>

            {/* 3-Zone Perfume Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl z-10">
                {ZONES.map((z) => {
                    const perfumeId = zoneResults[z.key];
                    const perfume: PerfumeInfoBook | null = perfumeId ? PERFUME_DATA_BOOK[perfumeId] : null;
                    const isCompleted = Boolean(perfume);

                    return (
                        <motion.div
                            key={z.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: ZONES.indexOf(z) * 0.15 }}
                            className={`relative w-full rounded-2xl p-7 flex flex-col justify-between transition-all duration-500 shadow-sm ${
                                isCompleted
                                    ? 'bg-[#FCFAF7] border border-[#E6DDD0] shadow-md'
                                    : 'bg-[#F0EADF]/50 border border-dashed border-[#D8CEBF]'
                            }`}
                        >
                            {/* 미완료(SEALED) 상태 */}
                            {!isCompleted ? (
                                <div className="h-[400px] flex flex-col items-center justify-center text-center p-4">
                                    <span className="text-xs tracking-[0.2em] text-[#7A6A59] uppercase font-medium mb-1">
                                        {z.englishName}
                                    </span>
                                    <h3 className="text-lg text-[#2C2620] font-semibold mb-2">{z.name}</h3>
                                    <p className="text-xs text-[#7A6A59] font-normal leading-relaxed mb-6">
                                        {z.subTitle}
                                    </p>

                                    <div className="w-12 h-12 rounded-full border border-[#D1C5B4] flex items-center justify-center text-xs text-[#7A6A59]">
                                        ✦
                                    </div>
                                    <p className="text-xs text-[#7A6A59] mt-4 font-normal">
                                        부스 QR을 찍으면 향수가 채워집니다.
                                    </p>
                                </div>
                            ) : (
                                /* 완료(REVEALED) 상태 */
                                <div className="min-h-[400px] flex flex-col justify-between">
                                    <div>
                                        {/* Zone Badge */}
                                        <div className="flex items-center justify-between border-b border-[#ECE4DA] pb-3 mb-5">
                                            <span
                                                className={`text-[11px] tracking-wider uppercase font-medium px-2.5 py-1 rounded ${z.badgeBg}`}
                                            >
                                                {z.englishName}
                                            </span>
                                            <span className="text-xs text-[#6B5E51] font-medium tracking-wider">
                                                No. 0{perfume?.id}
                                            </span>
                                        </div>

                                        {/* Perfume Title */}
                                        <div className="text-center my-4">
                                            <p className="text-[10px] tracking-[0.25em] text-[#7A6A59] uppercase font-medium mb-1">
                                                EAU DE PARFUM
                                            </p>
                                            <h2 className="text-2xl text-[#2C2620] font-bold tracking-normal">
                                                {perfume?.title}
                                            </h2>
                                        </div>

                                        {/* 추천 이미지 태그 */}
                                        <div className="my-5 pt-3 border-t border-[#ECE4DA] text-center">
                                            <p className="text-[10px] text-[#7A6A59] tracking-wider uppercase font-medium mb-2">
                                                ✦ 추천 이미지
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-1.5">
                                                {perfume?.imageTags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-[#F3EDE3] text-[#4A4238] text-xs px-3 py-1 rounded-full font-normal border border-[#E4DACD]"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 향수 설명 */}
                                        <div className="text-center space-y-1 text-xs text-[#4A4238] font-normal leading-relaxed my-5">
                                            {perfume?.description.map((line, idx) => (
                                                <p key={idx}>{line}</p>
                                            ))}
                                        </div>

                                        {/* 문학 & 에니어그램 성장포인트 섹션 */}
                                        {perfume?.enneagramQuotes && (
                                            <div className="border-t border-[#ECE4DA] pt-4 mt-4 space-y-3 text-left">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] tracking-wider text-[#7A6A59] uppercase font-medium">
                                                        LITERATURE & GROWTH
                                                    </span>
                                                    <span className="text-[10px] bg-[#EBE2D5] text-[#4A4238] px-2 py-0.5 rounded font-medium">
                                                        Type {perfume.enneagramQuotes.typeNumber} ·{' '}
                                                        {perfume.enneagramQuotes.typeName}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    {perfume.enneagramQuotes.quotes.map((q, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-[#F3EDE3]/70 p-3 rounded-lg border border-[#E4DACD]"
                                                        >
                                                            <p className="text-xs text-[#2C2620] font-medium mb-1">
                                                                "{q.text}"
                                                            </p>
                                                            <p className="text-[10px] text-[#6B5E51] text-right font-medium">
                                                                — {q.book}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="bg-[#EBE2D5]/70 p-3 rounded-lg border border-[#DCD0C0]">
                                                    <p className="text-[10px] tracking-wide text-[#2C2620] font-semibold mb-1">
                                                        ✦ 자기개발 포인트
                                                    </p>
                                                    <p className="text-xs text-[#4A4238] font-normal leading-relaxed">
                                                        {perfume.enneagramQuotes.growthPoint}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Main Notes */}
                                    {perfume?.mainNotes && (
                                        <div className="border-t border-[#ECE4DA] pt-4 mt-4 text-center">
                                            <p className="text-[10px] tracking-[0.2em] text-[#7A6A59] uppercase font-medium">
                                                Main Notes
                                            </p>
                                            <p className="text-xs text-[#4A4238] font-semibold mt-1">
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
                    <></>
                ) : (
                    <div className="text-xs text-[#6B5E51] font-medium tracking-wide bg-[#EFE8DC] px-6 py-3 rounded-full border border-[#D8CFC4]">
                        세 가지 향을 모두 만날 때 완벽한 레시피가 완성됩니다 ({Object.keys(zoneResults).length} / 3)
                    </div>
                )}
            </footer>
        </div>
    );
}
