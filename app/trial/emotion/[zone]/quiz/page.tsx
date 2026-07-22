'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { questions, Question } from '@/app/lib/data';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    // URL 파라미터를 안전하게 소문자로 변환하고 검증
    const rawZone = typeof params?.zone === 'string' ? params.zone.toLowerCase() : '';
    const zone = (['heart', 'head', 'gut'].includes(rawZone) ? rawZone : 'heart') as 'heart' | 'head' | 'gut';

    const clientid = searchParams.get('clientid');

    const [zoneQuestions, setZoneQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
    const [current, setCurrent] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const filtered = questions.filter((q) => q.zone === zone);
        setZoneQuestions(filtered);

        setCurrent(0);
        setAnswers({});
    }, [zone]);

    if (!zoneQuestions.length)
        return (
            <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center font-serif text-[#8C7A6B]">
                Loading...
            </div>
        );

    const currentQ = zoneQuestions[current];

    const handleAnswer = (score: number) => {
        setAnswers((prev) => ({ ...prev, [currentQ.id]: score }));
        // 잠시 딜레이를 주어 사용자가 누른 점수를 확인할 수 있게 함
        setTimeout(() => {
            if (current < zoneQuestions.length - 1) {
                setCurrent(current + 1);
            }
        }, 300);
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F4EE] px-4 py-10 font-serif relative overflow-hidden">
            {/* 햇살 감성의 배경 조명 효과 */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#EFE8DC] to-transparent rounded-full blur-[100px] pointer-events-none opacity-80" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#EFE8DC] to-transparent rounded-full blur-[100px] pointer-events-none opacity-60" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative bg-[#FCFAF7] border border-[#E6DDD0] shadow-md shadow-[#D8CFCE]/20 rounded-2xl p-8 md:p-12 w-full max-w-xl text-center z-10"
            >
                {/* 상단 서브 타이틀 및 진행도 */}
                <div className="flex justify-between items-center mb-8">
                    <span className="text-[10px] font-sans tracking-[0.3em] text-[#8C7A6B] uppercase font-light">
                        {zone} ZONE
                    </span>
                    <span className="text-[10px] font-sans tracking-widest text-[#A39585]">
                        {current + 1} / {zoneQuestions.length}
                    </span>
                </div>

                {/* 프로그레스 바 */}
                <div className="w-full h-[2px] bg-[#E6DDD0] overflow-hidden mb-10">
                    <div
                        className="h-full bg-[#8C7A6B] transition-all duration-500 ease-out"
                        style={{ width: `${((current + 1) / zoneQuestions.length) * 100}%` }}
                    />
                </div>

                {/* 질문 영역 (애니메이션 적용) */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-[120px] flex flex-col justify-center"
                    >
                        <h2 className="text-xl md:text-2xl font-normal text-[#383129] leading-relaxed italic break-keep">
                            {currentQ.question}
                        </h2>
                    </motion.div>
                </AnimatePresence>

                {/* 1~5점 점수 선택 */}
                <div className="grid grid-cols-5 gap-2 md:gap-3 mb-8">
                    {[1, 2, 3, 4, 5].map((score) => {
                        const isSelected = answers[currentQ.id] === score;
                        return (
                            <button
                                key={score}
                                onClick={() => handleAnswer(score)}
                                className={`py-4 rounded-xl font-sans text-sm transition-all duration-300 border ${
                                    isSelected
                                        ? 'bg-[#3A322A] text-[#F7F4EE] border-[#3A322A] shadow-md scale-[1.02]'
                                        : 'bg-[#F7F4EE] text-[#6B5E51] border-[#D8CEBF] hover:bg-[#EFE8DC]'
                                }`}
                            >
                                {score}
                            </button>
                        );
                    })}
                </div>

                {/* 하단 컨트롤 (이전 버튼 / 결과 보기) */}
                <div className="h-12 flex items-center justify-center mt-4">
                    {Object.keys(answers).length === zoneQuestions.length ? (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={handleSubmitResults}
                            disabled={isSaving}
                            className={`w-full py-3.5 px-8 rounded-xl font-sans text-xs tracking-[0.2em] uppercase transition duration-300 font-light shadow-sm ${
                                isSaving
                                    ? 'bg-[#D8CEBF] text-[#8C7A6B] cursor-not-allowed'
                                    : 'bg-[#3A322A] hover:bg-[#25201A] text-[#F7F4EE]'
                            }`}
                        >
                            {isSaving ? 'Processing...' : 'View Results ✦'}
                        </motion.button>
                    ) : (
                        current > 0 && (
                            <button
                                onClick={handleGoBack}
                                className="text-[10px] font-sans tracking-widest text-[#A39585] uppercase hover:text-[#6B5E51] transition"
                            >
                                ← Previous
                            </button>
                        )
                    )}
                </div>
            </motion.div>
        </div>
    );
}
