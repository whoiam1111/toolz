'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import Link from 'next/link';
import { PERFUME_DATA_BOOK } from '@/app/lib/data';
import { scoreTrialAnswers } from '@/app/lib/scoring';
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const types: Record<string, { name: string; englishName: string; number: number }> = {
    A: { name: '개혁가', englishName: 'Reformer', number: 1 },
    B: { name: '조력자', englishName: 'Helper', number: 2 },
    C: { name: '성취자', englishName: 'Achiever', number: 3 },
    D: { name: '예술가', englishName: 'Individualist', number: 4 },
    E: { name: '탐구자', englishName: 'Investigator', number: 5 },
    F: { name: '충실한 유형', englishName: 'Loyalist', number: 6 },
    G: { name: '열정가', englishName: 'Enthusiast', number: 7 },
    H: { name: '지도자', englishName: 'Challenger', number: 8 },
    I: { name: '평화주의자', englishName: 'Peacemaker', number: 9 },
};
function ResultContent() {
    const searchParams = useSearchParams();
    const clientid = searchParams.get('clientid');
    const [result, setResult] = useState<{ type: string; score: number } | null>(null);
    const [chartLabels, setChartLabels] = useState<string[]>([]);
    const [chartScores, setChartScores] = useState<number[]>([]);
    const [loading, setLoading] = useState(!!clientid);
    // useSearchParams 때문에 이 컴포넌트는 브라우저에서만 렌더링되므로 초기값으로 날짜를 계산해도 된다
    const [testDate] = useState(() => new Date().toLocaleDateString());

    useEffect(() => {
        if (!clientid) return;

        const fetchAnswers = async () => {
            try {
                const response = await fetch(`/api/getIdAnswers?clientid=${encodeURIComponent(clientid)}`);
                const data = await response.json();
                if (response.ok && data.answers) {
                    const resultItem = Array.isArray(data.answers) ? data.answers[0] : data.answers;
                    const userAnswers = resultItem?.answers;

                    if (userAnswers && typeof userAnswers === 'object' && !Array.isArray(userAnswers)) {
                        const { maxType, scores } = scoreTrialAnswers(userAnswers);
                        setResult(maxType);

                        const labels = Object.keys(types).map((key) => types[key].name);
                        const values = Object.keys(types).map((key) => scores[key] || 0);

                        setChartLabels(labels);
                        setChartScores(values);
                    } else {
                        console.error('유효하지 않은 answers 데이터 형식:', userAnswers);
                    }
                }
            } catch (error) {
                console.error('Error fetching answers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnswers();
    }, [clientid]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center text-[#8C7A6B]">
                <p className="font-serif italic text-sm tracking-widest animate-pulse">
                    Analyzing Olfactory Profile...
                </p>
            </div>
        );
    }

    if (!result || !result.type) {
        return (
            <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center text-[#8C7A6B]">
                <p className="font-sans text-xs tracking-wider">검사 결과를 불러올 수 없습니다.</p>
            </div>
        );
    }

    const currentTypeMeta = types[result.type];
    const typeNumber = currentTypeMeta?.number || 1;
    const quoteData = PERFUME_DATA_BOOK[typeNumber]?.enneagramQuotes;

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: '성향 매칭 스펙트럼',
                data: chartScores,
                backgroundColor: 'rgba(140, 122, 107, 0.15)',
                borderColor: 'rgba(107, 94, 81, 0.85)',
                borderWidth: 1.5,
                pointBackgroundColor: 'rgba(58, 50, 42, 1)',
                pointBorderColor: '#FCFAF7',
                pointHoverBackgroundColor: '#FCFAF7',
                pointHoverBorderColor: 'rgba(58, 50, 42, 1)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            r: {
                beginAtZero: true,
                max: 15,
                ticks: {
                    stepSize: 3,
                    backdropColor: 'transparent',
                    color: '#A39585',
                    font: {
                        size: 10,
                        family: 'serif',
                    },
                },
                grid: {
                    color: 'rgba(216, 207, 196, 0.5)',
                },
                angleLines: {
                    color: 'rgba(216, 207, 196, 0.5)',
                },
                pointLabels: {
                    color: '#4A4238',
                    font: {
                        size: 11,
                        family: 'sans-serif',
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#3A322A',
                titleColor: '#F7F4EE',
                bodyColor: '#E4DACD',
                padding: 10,
                cornerRadius: 8,
            },
        },
    };

    return (
        <div className="min-h-screen bg-[#F7F4EE] text-[#4A4238] font-serif px-4 py-12 flex flex-col items-center">
            <header className="text-center mb-8">
                <span className="text-[10px] font-sans tracking-[0.3em] text-[#8C7A6B] uppercase border-b border-[#D8CFC4] pb-1">
                    ATELIER DE PARFUM · REPORT
                </span>
                <h1 className="text-2xl md:text-3xl font-normal tracking-wide text-[#383129] mt-3 italic">
                    Personality Spectrum Analysis
                </h1>
                <p className="text-xs font-sans text-[#8C7A6B] font-light mt-1">당신의 성향 측정 결과 리포트입니다.</p>
            </header>

            <div className="w-full max-w-3xl bg-[#FCFAF7] border border-[#E6DDD0] shadow-md shadow-[#D8CFCE]/20 rounded-2xl p-6 md:p-10">
                <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-sans text-[#9C8F80] border-b border-[#ECE4DA] pb-4 mb-6 gap-1">
                    <span>
                        CLIENT ID: <strong className="text-[#5C5043] font-mono">{clientid}</strong>
                    </span>
                    <span>
                        DATE: <strong className="text-[#5C5043] font-mono">{testDate}</strong>
                    </span>
                </div>

                <div className="text-center my-6">
                    <p className="text-[10px] font-sans tracking-[0.25em] text-[#A39585] uppercase mb-1">
                        PRIMARY SCENT CHARACTER
                    </p>
                    <h2 className="text-2xl md:text-3xl font-serif text-[#383129] font-normal tracking-wide">
                        {currentTypeMeta?.name}{' '}
                        <span className="text-base text-[#8C7A6B] font-light italic">
                            ({currentTypeMeta?.englishName})
                        </span>
                    </h2>
                </div>

                <div className="w-full max-w-md mx-auto my-8 p-4 bg-[#F7F4EE]/50 rounded-2xl border border-[#ECE4DA]">
                    <Radar
                        data={chartData}
                        options={chartOptions}
                    />
                </div>

                {quoteData && (
                    <div className="my-8 p-6 bg-[#F7F4EE]/60 rounded-2xl border border-[#E2D8CC]">
                        <h3 className="text-xs font-sans tracking-[0.2em] text-[#8C7A6B] uppercase mb-4 text-center">
                            ✦ Literary Inspiration & Growth ✦
                        </h3>
                        <div className="space-y-4 mb-6">
                            {quoteData.quotes.map((q, idx) => (
                                <div
                                    key={idx}
                                    className="border-l-2 border-[#B3A492] pl-4 py-1"
                                >
                                    <p className="text-xs md:text-sm text-[#383129] italic mb-1">&quot;{q.text}&quot;</p>
                                    <p className="text-[11px] font-sans text-[#8C7A6B]">— {q.book}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-[#E2D8CC]">
                            <p className="text-[10px] font-sans tracking-widest text-[#9C8F80] uppercase mb-1">
                                Growth Point
                            </p>
                            <p className="text-xs md:text-sm font-sans text-[#5C5043] font-light leading-relaxed">
                                {quoteData.growthPoint}
                            </p>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto my-8 font-sans">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#D8CEBF] text-[#8C7A6B] text-[10px] uppercase tracking-wider">
                                <th className="py-2.5 px-3">CODE</th>
                                <th className="py-2.5 px-3">CHARACTER TYPE</th>
                                <th className="py-2.5 px-3 text-right">SCORE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ECE4DA]">
                            {Object.keys(types).map((typeKey, idx) => {
                                const isSelected = result.type === typeKey;
                                return (
                                    <tr
                                        key={typeKey}
                                        className={`transition-colors ${
                                            isSelected ? 'bg-[#F3EDE3] font-medium text-[#383129]' : 'text-[#6E6153]'
                                        }`}
                                    >
                                        <td className="py-2.5 px-3 font-mono text-[11px]">{typeKey}</td>
                                        <td className="py-2.5 px-3 font-serif flex items-center gap-2">
                                            <span>{types[typeKey].name}</span>
                                            {isSelected && (
                                                <span className="text-[9px] font-sans bg-[#3A322A] text-[#F7F4EE] px-1.5 py-0.5 rounded">
                                                    PRIMARY
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-mono text-[11px]">
                                            {chartScores[idx] ?? 0} pt
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="text-center pt-4 border-t border-[#ECE4DA]">
                    <Link
                        href={`/trial/dashboard/adminResult/detail${
                            clientid ? `?clientid=${encodeURIComponent(clientid)}` : ''
                        }`}
                        className="inline-block py-3 px-8 bg-[#3A322A] hover:bg-[#25201A] text-[#F7F4EE] font-sans text-xs tracking-[0.2em] uppercase rounded-xl transition duration-300 font-light shadow-sm"
                    >
                        View Detailed Recipe ✦
                    </Link>
                </div>
            </div>

            <p className="text-[10px] italic text-[#A39585] mt-8 tracking-wide font-serif">
                — Invisible, Unforgettable.
            </p>
        </div>
    );
}

// Next.js useSearchParams()를 안전하게 감싸는 메인 Export 컴포넌트
export default function ResultPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center text-[#8C7A6B]">
                    <p className="font-serif italic text-sm tracking-widest animate-pulse">
                        Loading Olfactory Profile...
                    </p>
                </div>
            }
        >
            <ResultContent />
        </Suspense>
    );
}
