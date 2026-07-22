// app/trial/emotion/[zone]/quiz/page.tsx (또는 QuizPage 위치)
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { questions, Question } from '@/app/lib/data';

export default function QuizPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const zone = (params.zone as 'heart' | 'head' | 'gut') || 'heart';
    const clientid = searchParams.get('clientid');

    const [zoneQuestions, setZoneQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
    const [current, setCurrent] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false); // 💡 저장 중 버튼 연타 방지용 상태 추가

    useEffect(() => {
        setZoneQuestions(questions.filter((q) => q.zone === zone));
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

    // 🔥 여기서 진짜 DB 저장을 처리합니다!
    const handleSubmitResults = async () => {
        if (!clientid) return alert('이름 정보가 필요합니다.');

        setIsSaving(true); // 저장 시작

        try {
            // 1. API를 호출하여 DB에 답변 병합 저장
            const response = await fetch('/api/saveAnswers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientid, answers }),
            });

            if (!response.ok) throw new Error('DB 저장 실패');

            // 2. DB 저장이 완료되면 결과 페이지로 이동 (기존 로직 유지)
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
                {/* 프로그레스 바 */}
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

                {/* 1~5점 점수 선택 */}
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
