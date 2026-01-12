'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface SlideItem {
    id: number;
    title: string;
    image_url: string;
}

const MainClassSlider = () => {
    const [slides, setSlides] = useState<SlideItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedContents = async () => {
            const { data, error } = await supabase
                .from('contents')
                .select('id, title, image_url')
                .eq('is_featured', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('대표 컨텐츠 로딩 실패:', error.message);
            } else {
                setSlides(data ?? []);
            }

            setLoading(false);
        };

        fetchFeaturedContents();
    }, []);

    if (loading) {
        return (
            <section className="py-32 bg-[#0f0f0f] text-center">
                <div className="animate-pulse text-orange-500 font-medium tracking-widest uppercase text-sm">Loading Content...</div>
            </section>
        );
    }

    if (slides.length === 0) {
        return (
            <section className="py-32 bg-[#0f0f0f] text-center text-neutral-500 italic">
                현재 설정된 대표 컨텐츠가 없습니다.
            </section>
        );
    }

    return (
        <section className="py-32 bg-[#0f0f0f] relative overflow-hidden">
            {/* 배경 장식 광원 */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="container mx-auto px-6 relative z-10">
                {/* 헤더 섹션 */}
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="text-left">
                        <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-3 block">Pick of the month</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-serif italic">Content</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 text-lg max-w-md font-light">
                        TOOL:Z가 엄선한 이번 달 주요 프로그램을 확인하고 당신의 관점을 리프레임해보세요.
                    </p>
                </div>

                {/* 그리드 레이아웃 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {slides.map((card) => (
                        <div
                            key={card.id}
                            className="group relative h-full bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 hover:border-orange-500/40 hover:-translate-y-3 cursor-pointer"
                        >
                            {/* 이미지 영역 */}
                            <div className="relative w-full aspect-[4/3] overflow-hidden">
                                <Image
                                    src={card.image_url}
                                    alt={card.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* 이미지 위 그라데이션 오버레이 */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-80" />
                                
                                {/* 우측 상단 아이콘 */}
                                <div className="absolute top-5 right-5 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>

                            {/* 콘텐츠 영역 */}
                            <div className="p-8 flex flex-col h-[140px] justify-between">
                                <h3 className="text-xl font-bold text-gray-100 group-hover:text-orange-400 transition-colors leading-tight line-clamp-2">
                                    {card.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-xs font-bold text-orange-500/80 uppercase tracking-widest mt-4">
                                    <span className="w-8 h-[1px] bg-orange-500/40" />
                                    Explore Program
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MainClassSlider;