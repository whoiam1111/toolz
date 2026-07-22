// app/trial/emotion/[zone]/quiz/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { questions, Question } from '@/app/lib/data';

export default function QuizPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    // 💡 수정 1: URL 파라미터를 안전하게 소문자로 변환하고 검증
    const rawZone = typeof params?.zone === 'string' ? params.zone.toLowerCase() : '';
    const zone = (['heart', 'head', 'gut'].includes(rawZone) ? rawZone : 'heart') as 'heart' | 'head' | 'gut';

    const clientid = searchParams.get('clientid');

    const [zoneQuestions, setZoneQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
    const [current, setCurrent] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // 💡 수정 2: zone이 변경될 때 올바르게 필터링하고 상태 초기화
        const filtered = questions.filter((q) => q.zone === zone);
        setZoneQuestions(filtered);

        // 만약 사용자가 URL을 직접 바꿔서 이동할 경우를 대비해 진행 상태 초기화
        setCurrent(0);
        setAnswers({});
    }, [zone]);

    if (!zoneQuestions.length) return <div className="p-10 text-center">질문을 불러오는 중...</div>;

    const currentQ = zoneQuestions[current];

    const handleAnswer = (score: number) => {
        setAnswers((prev) => ({ ...prev, [currentQ.id]: score }));
        if (current < zoneQuestions.length - 1) {
            setCurrent(current + 1);
        }
    };

    const handleGoBack = () => {
        if (current > 0) {
            setAnswers((prev) => {
                const updated = { ...prev };
                delete updated[zoneQuestions[current].id];
                return updated;
            });
            setCurrent(current - 1);
        }
    };

    const handleSubmitResults = async () => {
        if (!clientid) return alert('이름 정보가 필요합니다.');
        setIsSaving(true);

        try {
            const response = await fetch('/api/saveAnswers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientid, answers }),
            });

            if (!response.ok) throw new Error('DB 저장 실패');

            const queryString = Object.entries(answers)
                .map(([id, score]) => `${id}-${score}`)
                .join(',');

            router.push(
                `/trial/emotion/${zone}/result?clientid=${encodeURIComponent(clientid)}&answers=${queryString}`
            );
        } catch (error) {
            console.error('저장 오류:', error);
            alert('결과를 저장하는 중 문제가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 py-10">
            <div className="relative bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl text-center">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${((current + 1) / zoneQuestions.length) * 100}%` }}
                    />
                </div>

                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    {zone.toUpperCase()} ZONE ({current + 1}/{zoneQuestions.length})
                </span>

                <h2 className="text-xl font-semibold mb-8 text-gray-800 leading-snug min-h-[56px] flex items-center justify-center">
                    {currentQ.question}
                </h2>

                <div className="grid grid-cols-5 gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((score) => (
                        <button
                            key={score}
                            onClick={() => handleAnswer(score)}
                            className={`py-3.5 rounded-lg font-bold text-sm transition ${
                                answers[currentQ.id] === score
                                    ? 'bg-emerald-500 text-white shadow-md'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                            }`}
                        >
                            {score}
                        </button>
                    ))}
                </div>

                {current > 0 && (
                    <button
                        onClick={handleGoBack}
                        className="mt-3 text-sm text-gray-400 underline hover:text-gray-600"
                    >
                        ← 이전 질문으로
                    </button>
                )}
            </div>

            {Object.keys(answers).length === zoneQuestions.length && (
                <button
                    onClick={handleSubmitResults}
                    disabled={isSaving}
                    className={`mt-6 py-3.5 px-8 rounded-xl font-bold shadow-lg transition ${
                        isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black text-white'
                    }`}
                >
                    {isSaving ? '데이터 저장 중...' : '결과 보기 🌿'}
                </button>
            )}
        </div>
    );
}
