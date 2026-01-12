'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { getCoreEmotionTestResult } from '@/app/api/supabaseApi';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react';

export default function ParticipantPage() {
    const router = useRouter();
    const params = useParams();

    const [participantId, setParticipantId] = useState<string | null>(null);
    const [isPersonalityDone, setIsPersonalityDone] = useState(false);
    const [isSixTypeDone, setIsSixTypeDone] = useState(false);
    const [isFourTypeDone, setIsFourTypeDone] = useState(false);
    const [isLifeGraphDone, setIsLifeGraphDone] = useState(false);
    const [isCoreEmotionDone, setIsCoreEmotionDone] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params?.id) return;
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        setParticipantId(id);

        const fetchStatuses = async () => {
            try {
                const { data: personality } = await supabase.from('personality_tests').select('id').eq('participant_id', id).maybeSingle();
                setIsPersonalityDone(!!personality);

                const { data: sixType } = await supabase.from('sixtypes').select('id').eq('participant_id', id).maybeSingle();
                setIsSixTypeDone(!!sixType);

                const { data: fourType } = await supabase.from('fourtypes').select('id').eq('participant_id', id).maybeSingle();
                setIsFourTypeDone(!!fourType);

                const { data: lifeGraph } = await supabase.from('lifegraphs').select('id').eq('participant_id', id).maybeSingle();
                setIsLifeGraphDone(!!lifeGraph);

                const { data: coreEmotion } = await getCoreEmotionTestResult(id);
                setIsCoreEmotionDone(!!coreEmotion);
            } catch {
                // ✅ 'err'를 제거하여 'defined but never used' 에러 해결
                setError('상태를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchStatuses();
    }, [params]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-[#0f0f0f]">
            <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col justify-center items-center h-screen bg-[#0f0f0f] text-white">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-orange-500 underline">다시 시도</button>
        </div>
    );

    const tests = [
        { order: 1, name: '6도형 검사', done: isSixTypeDone, basePath: 'sixtypes', description: '심층 성향 파악' },
        { order: 2, name: '인생그래프', done: isLifeGraphDone, basePath: 'lifegraph', description: '삶의 궤적 시각화' },
        { order: 3, name: '성격유형 검사', done: isPersonalityDone, basePath: 'personality-test', description: '성격 유형 분석' },
        { order: 4, name: '4도형 검사', done: isFourTypeDone, basePath: 'fourtypes', description: '핵심 성격 이해' },
        { order: 5, name: '핵심감정 검사', done: isCoreEmotionDone, basePath: 'core-emotion-test', description: '내면 감정 파악' },
    ];

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white py-16 px-6 selection:bg-orange-500/30">
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <header className="mb-12">
                    <h2 className="text-3xl font-black tracking-tighter mb-2 italic">
                        TOOL : Z <span className="text-orange-500">Curriculum</span>
                    </h2>
                    <p className="text-gray-500 font-light">대상자의 변화를 위한 단계별 프로세스</p>
                </header>

                <div className="space-y-4">
                    {tests.map(({ order, name, done, basePath, description }) => (
                        <motion.div
                            key={basePath}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: order * 0.1 }}
                            className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${
                                done 
                                ? 'bg-[#1a1a1a] border-orange-500/30 shadow-lg shadow-orange-900/5' 
                                : 'bg-[#151515] border-white/5 opacity-80'
                            }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`text-xl font-black italic ${done ? 'text-orange-500' : 'text-gray-700'}`}>
                                    {String(order).padStart(2, '0')}
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${done ? 'text-white' : 'text-gray-400'}`}>{name}</h3>
                                    <p className="text-xs text-gray-600 font-light tracking-wide">{description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden sm:flex items-center gap-2">
                                    {done ? (
                                        <span className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1">
                                            <CheckCircle2 size={14} /> Completed
                                        </span>
                                    ) : (
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1">
                                            <Circle size={14} /> Pending
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => participantId && router.push(
                                        done ? `/dashboard/participant/${participantId}/${basePath}/results` 
                                             : `/dashboard/participant/${participantId}/${basePath}`
                                    )}
                                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                                        done 
                                        ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10' 
                                        : 'bg-orange-600 text-white hover:bg-orange-500 shadow-xl shadow-orange-900/20'
                                    }`}
                                >
                                    {done ? '결과 확인' : '검사 시작'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <p className="mt-12 text-center text-gray-600 text-sm font-light italic">
                    Authorized Coach Access Only.
                </p>
            </div>
        </div>
    );
}