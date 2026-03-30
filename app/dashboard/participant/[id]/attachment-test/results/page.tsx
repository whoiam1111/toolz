'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { attachmentQuestions } from '@/app/lib/question';
import AnswerDetails from './AnswerDetails'; // 기존 컴포넌트 재사용 가정

ChartJS.register(LinearScale, PointElement, Title, Tooltip, Legend);

type ResultsState = {
    anxietyScore: number;
    avoidanceScore: number;
    allAnswers: Record<string, number>;
};
// app/lib/attachmentContext.ts
export const attachmentTypeData = [
    {
        type: '안정형',
        name: '안정형 (Secure)',
        core_traits: {
            description:
                '자신과 타인에 대해 긍정적인 인식을 가지고 있습니다. 친밀감을 편안하게 느끼며, 관계에서 버림받을까 봐 크게 두려워하지 않습니다.',
            motivation: '상호 존중과 신뢰를 바탕으로 한 친밀한 관계 형성',
        },
        strengths: [
            '타인에게 마음을 잘 열고 의지할 수 있음',
            '갈등 상황에서 대화로 문제를 해결하려는 태도',
            '독립성과 친밀감 사이의 건강한 균형 유지',
        ],
        weaknesses: ['지나치게 회피적이거나 불안한 파트너를 만났을 때 감정적 소모를 겪을 수 있음'],
        advice: '지금처럼 건강한 관계 패턴을 유지하면서, 나와 다른 애착 유형을 가진 사람들의 방어기제를 이해하려 노력해 보세요.',
    },
    {
        type: '불안형',
        name: '불안형 (Preoccupied)',
        core_traits: {
            description:
                '자신에 대해서는 부정적이지만 타인에 대해서는 긍정적인 인식을 갖는 경향이 있습니다. 친밀감을 강하게 원하지만, 상대방이 나를 떠날까 봐 늘 불안해합니다.',
            motivation: '관계에서의 확신과 사랑받고 있다는 끊임없는 확인',
        },
        strengths: [
            '타인의 감정과 관계의 미세한 변화에 매우 섬세함',
            '사랑하는 사람에게 깊이 헌신하고 배려함',
            '관계 개선을 위해 적극적으로 노력함',
        ],
        weaknesses: [
            '거절이나 이별에 대한 과도한 두려움',
            '상대방의 사소한 행동에도 과민하게 반응하고 의미를 부여함',
            '자신의 가치를 타인의 평가나 애정에 의존함',
        ],
        advice: '상대방의 행동이 반드시 나에 대한 애정 부족을 의미하는 것은 아님을 기억하세요. 내면의 불안을 달래고 스스로를 사랑하는 연습이 필요합니다.',
    },
    {
        type: '회피형',
        name: '회피형 (Dismissing-Avoidant)',
        core_traits: {
            description:
                '자신에 대해서는 긍정적이나 타인에 대해서는 부정적인 인식을 가집니다. 독립심이 강하며, 타인에게 의지하거나 타인이 나에게 의지하는 것을 불편해합니다.',
            motivation: '상처받지 않기 위한 감정적 거리두기와 독립성 유지',
        },
        strengths: [
            '매우 자립적이고 독립적인 성향',
            '감정에 휩쓸리지 않고 이성적이고 침착함',
            '개인의 영역과 바운더리를 명확히 지킴',
        ],
        weaknesses: [
            '상대방과 정서적으로 깊이 연결되는 것을 무의식적으로 방어함',
            '갈등 상황에서 회피하거나 감정을 닫아버림',
            '상대방이 친밀감을 요구할 때 숨막혀 하거나 밀어냄',
        ],
        advice: '감정을 나누는 것은 약해지는 것이 아니라 관계를 풍요롭게 만드는 과정입니다. 조금씩 자신의 솔직한 감정을 표현하는 연습을 해보세요.',
    },
    {
        type: '공포회피형',
        name: '공포회피형 (Fearful-Avoidant)',
        core_traits: {
            description:
                '자신과 타인 모두에게 부정적인 인식을 가집니다. 친밀감을 원하면서도, 동시에 상처받는 것이 두려워 가까워지면 밀어내는 양가감정을 느낍니다.',
            motivation: '관계에 대한 갈망과 상처에 대한 두려움 사이에서의 방어',
        },
        strengths: [
            '사람의 심리와 이면에 대한 깊은 통찰력',
            '상처의 경험을 바탕으로 한 깊은 공감 능력 (신뢰가 쌓였을 때)',
        ],
        weaknesses: [
            '친해지고 싶으면서도 막상 다가오면 밀어내는 일관성 없는 행동',
            '타인을 믿지 못하고 늘 의심하며 관계를 시험함',
            '내면의 극심한 감정 기복과 혼란',
        ],
        advice: '관계에서의 두려움은 과거의 상처에서 비롯된 경우가 많습니다. 안전함을 느낄 수 있는 작은 관계부터 천천히 신뢰를 쌓아가는 것이 중요합니다.',
    },
];
// 역채점 문항 (점수를 반대로 뒤집어야 하는 문항: 5점 척도 기준 6 - 점수)
const REVERSE_ITEMS = [3, 15, 19, 22, 25, 27, 29, 33];

export default function AttachmentResultsPage() {
    const params = useParams();
    const participantId = params?.id as string;

    const [results, setResults] = useState<ResultsState | null>(null);
    const [loading, setLoading] = useState(true);
    const [attachmentType, setAttachmentType] = useState('');
    const [showAnswerDetails, setShowAnswerDetails] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!participantId) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('attachment_tests')
                .select('answers')
                .eq('participant_id', participantId)
                .maybeSingle();

            if (error || !data?.answers) {
                console.error('결과 데이터를 불러오지 못했습니다.', error);
                setLoading(false);
                return;
            }

            const answers = data.answers as Record<string, number>;

            let anxietyTotal = 0; // 짝수 문항 (불안)
            let avoidanceTotal = 0; // 홀수 문항 (회피)

            attachmentQuestions.forEach((q) => {
                const answerValue = answers[q.id];
                if (!answerValue) return;

                // 역채점 로직 (5점 척도: 1->5, 2->4, 3->3, 4->2, 5->1)
                const score = REVERSE_ITEMS.includes(q.num) ? 6 - answerValue : answerValue;

                if (q.num % 2 === 0) {
                    anxietyTotal += score; // 짝수: 불안
                } else {
                    avoidanceTotal += score; // 홀수: 회피
                }
            });

            setResults({
                anxietyScore: anxietyTotal,
                avoidanceScore: avoidanceTotal,
                allAnswers: answers,
            });

            // 유형 분류 (컷오프 기준점: 중간값인 54점 (18문항 * 3점))
            // 점수가 54점 이상이면 높음(High), 미만이면 낮음(Low)
            const isHighAnxiety = anxietyTotal >= 54;
            const isHighAvoidance = avoidanceTotal >= 54;

            if (!isHighAnxiety && !isHighAvoidance) setAttachmentType('안정형');
            else if (isHighAnxiety && !isHighAvoidance) setAttachmentType('불안형');
            else if (!isHighAnxiety && isHighAvoidance) setAttachmentType('거부회피형');
            else if (isHighAnxiety && isHighAvoidance) setAttachmentType('공포회피형');

            setLoading(false);
        };

        fetchResults();
    }, [participantId]);

    if (loading) return <p className="text-center text-gray-600 mt-20">로딩 중...</p>;
    if (!results) return <p className="text-center text-red-500 mt-20">결과를 불러오는 데 실패했습니다.</p>;

    // Chart.js 산점도(Scatter) 데이터 설정
    const chartData = {
        datasets: [
            {
                label: '나의 애착 위치',
                data: [{ x: results.avoidanceScore, y: results.anxietyScore }],
                backgroundColor: 'rgba(79, 70, 229, 1)', // Indigo 600
                pointRadius: 8,
                pointHoverRadius: 10,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => `회피: ${context.raw.x}점, 불안: ${context.raw.y}점`,
                },
            },
        },
        scales: {
            x: {
                title: { display: true, text: '회피 (Avoidance) ➡️', font: { weight: 'bold' as const } },
                min: 18,
                max: 90,
                grid: {
                    color: (ctx: any) => (ctx.tick.value === 54 ? 'rgba(255, 99, 132, 0.8)' : 'rgba(0,0,0,0.1)'),
                    lineWidth: (ctx: any) => (ctx.tick.value === 54 ? 2 : 1),
                },
            },
            y: {
                title: { display: true, text: '불안 (Anxiety) ➡️', font: { weight: 'bold' as const } },
                min: 18,
                max: 90,
                grid: {
                    color: (ctx: any) => (ctx.tick.value === 54 ? 'rgba(255, 99, 132, 0.8)' : 'rgba(0,0,0,0.1)'),
                    lineWidth: (ctx: any) => (ctx.tick.value === 54 ? 2 : 1),
                },
            },
        },
    };

    const typeInfo = attachmentTypeData.find((data) => data.type === attachmentType);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
            <header className="text-center border-b pb-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-800">성인애착유형검사 결과</h1>
                <p className="text-sm text-gray-500 mt-2">ID: {participantId}</p>
            </header>

            {/* 점수 요약 및 차트 */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10">
                <div className="w-full md:w-1/2">
                    <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">애착 차원 산점도</h2>
                    <div className="relative">
                        <Scatter
                            data={chartData}
                            options={chartOptions}
                        />
                        {/* 4분면 라벨링 (선택사항) */}
                        <span className="absolute top-2 left-2 text-xs text-gray-400 font-bold">안정형</span>
                        <span className="absolute top-2 right-2 text-xs text-gray-400 font-bold">불안형</span>
                        <span className="absolute bottom-2 left-2 text-xs text-gray-400 font-bold">거부회피형</span>
                        <span className="absolute bottom-2 right-2 text-xs text-gray-400 font-bold">공포회피형</span>
                    </div>
                </div>

                <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">나의 점수</h3>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">회피 (Avoidance)</span>
                        <span className="font-bold text-blue-600 text-lg">{results.avoidanceScore}점</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-600">불안 (Anxiety)</span>
                        <span className="font-bold text-red-500 text-lg">{results.anxietyScore}점</span>
                    </div>
                    <div className="pt-4 border-t border-gray-300">
                        <span className="text-sm text-gray-500">당신의 애착 유형은</span>
                        <p className="text-2xl font-extrabold text-indigo-600 mt-1">{attachmentType}</p>
                    </div>
                </div>
            </div>

            {/* 유형 상세 설명 */}
            {typeInfo && (
                <div className="mt-8 space-y-8">
                    <section className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold text-indigo-800 mb-3">{typeInfo.name}</h2>
                        <p className="text-gray-700 leading-relaxed text-lg">{typeInfo.core_traits.description}</p>
                        <p className="text-gray-700 mt-3 bg-white inline-block px-3 py-1 rounded-md text-sm border border-indigo-100">
                            <span className="font-semibold text-indigo-600">관계에서의 핵심 동기:</span>{' '}
                            {typeInfo.core_traits.motivation}
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="bg-white border border-green-200 shadow-sm rounded-lg p-5">
                            <h3 className="text-lg font-bold text-green-600 mb-3 flex items-center">
                                <span className="mr-2">✨</span> 관계에서의 강점
                            </h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                {typeInfo.strengths.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>
                        <section className="bg-white border border-red-200 shadow-sm rounded-lg p-5">
                            <h3 className="text-lg font-bold text-red-500 mb-3 flex items-center">
                                <span className="mr-2">⚠️</span> 주의할 점 (취약점)
                            </h3>
                            <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                {typeInfo.weaknesses.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <section className="bg-gray-800 text-white rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-bold text-yellow-400 mb-2">💡 성장을 위한 조언</h3>
                        <p className="leading-relaxed text-gray-200">{typeInfo.advice}</p>
                    </section>
                </div>
            )}

            {/* 답변 상세 보기 토글 */}
            <div className="text-center mt-12">
                <button
                    onClick={() => setShowAnswerDetails(!showAnswerDetails)}
                    className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                >
                    {showAnswerDetails ? '내 답변 숨기기' : '내가 선택한 답변 자세히 보기'}
                </button>
            </div>

            {/* AnswerDetails 컴포넌트에 넘길 때, questions를 애착유형 문항으로 교체해서 넘겨주세요 */}
            {showAnswerDetails && results.allAnswers && (
                <div className="mt-6">
                    <AnswerDetails
                        allAnswers={results.allAnswers}
                        questions={attachmentQuestions}
                    />
                </div>
            )}
        </div>
    );
}
