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
            <section className="py-32 bg-[#f8fafc] text-center">
                <div className="animate-pulse text-blue-600 font-medium tracking-widest uppercase text-sm">
                    Loading Content...
                </div>
            </section>
        );
    }

    if (slides.length === 0) {
        return (
            <section className="py-32 bg-[#f8fafc] text-center text-slate-400 italic">
                현재 설정된 대표 컨텐츠가 없습니다.
            </section>
        );
    }

    return (
        /* 전체 배경: 오프화이트 톤 (#f8fafc) */
        <section className="py-32 bg-[#f8fafc] relative overflow-hidden">
            {/* 은은한 딥 블루 배경 광원 */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="container mx-auto px-6 relative z-10">
                {/* 헤더 섹션 */}
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="text-left">
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3 block">
                            Pick of the month
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#0a1f44] tracking-tighter">
                            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a1f44] to-blue-600 italic">Content</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 text-lg max-w-md font-normal">
                        TOOL:Z가 엄선한 이번 달 주요 프로그램을 확인하고 당신의 관점을 리프레임해보세요.
                    </p>
                </div>

                {/* 그리드 레이아웃 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {slides.map((card) => (
                        <div
                            key={card.id}
                            className="group relative h-full bg-white rounded-[2rem] overflow-hidden border border-slate-200/80 shadow-sm transition-all duration-500 hover:border-[#0a1f44]/30 hover:shadow-xl hover:-translate-y-3 cursor-pointer"
                        >
                            {/* 이미지 영역 */}
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                                <Image
                                    src={card.image_url}
                                    alt={card.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* 이미지 하단 자연스러운 흰색 그라데이션 오버레이 */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
                                
                                {/* 우측 상단 아이콘 (딥 로열 블루 톤 적용) */}
                                <div className="absolute top-5 right-5 p-3 rounded-full bg-[#0a1f44]/80 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-md">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>

                            {/* 콘텐츠 영역 */}
                            <div className="p-8 flex flex-col h-[140px] justify-between bg-white">
                                <h3 className="text-xl font-bold text-[#0a1f44] group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                                    {card.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mt-4">
                                    <span className="w-8 h-[1px] bg-blue-600/40" />
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