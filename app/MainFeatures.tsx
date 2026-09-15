'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Content = {
    id: number;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
    is_featured: boolean;
    is_recommended: boolean;
};

const MainFeatures = () => {
    const [recommended, setRecommended] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecommended();
    }, []);

    const fetchRecommended = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contents')
            .select('*')
            .eq('is_recommended', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('추천 컨텐츠 가져오기 실패:', error.message);
        } else {
            setRecommended(data);
        }

        setLoading(false);
    };

    return (
        /* 전체 배경: 오프화이트 톤 (#f8fafc) */
        <section className="bg-[#f8fafc] py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* 섹션 헤더: 딥 로열 블루 톤앤매너 */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-[#0a1f44] tracking-tight mb-3">
                        추천 컨텐츠
                    </h2>
                    <p className="text-slate-500 font-medium text-base md:text-lg">
                        TOOL:Z가 엄선한 최신 성장을 위한 큐레이션입니다.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <p className="text-slate-400 font-medium animate-pulse">컨텐츠를 불러오는 중입니다...</p>
                    </div>
                ) : recommended.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80">
                        <p className="text-slate-400 font-medium">추천된 컨텐츠가 없습니다.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {recommended.map((content) => (
                            <motion.div
                                key={content.id}
                                className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#0a1f44]/30 transition-all duration-300 overflow-hidden flex flex-col"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {content.image_url && (
                                    <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                                        <Image
                                            src={content.image_url}
                                            alt={content.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                )}
                                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-[#0a1f44] group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {content.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                            {content.description}
                                        </p>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-400 pt-2 border-t border-slate-100">
                                        {new Date(content.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default MainFeatures;