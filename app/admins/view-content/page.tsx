'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import { Star, ThumbsUp, Trash2, RefreshCw, LayoutGrid, AlertCircle, Image as ImageIcon } from 'lucide-react';

type Content = {
    id: number;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
    is_featured: boolean;
    is_recommended: boolean;
};

export default function ViewContent() {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        setLoading(true);
        setStatusMessage(null);
        const { data, error } = await supabase.from('contents').select('*').order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching contents:', error.message);
            setStatusMessage('컨텐츠를 불러오는 중 오류가 발생했습니다.');
        } else {
            setContents(data ?? []);
        }
        setLoading(false);
    };

    const toggleFeatured = async (id: number) => {
        const featuredCount = contents.filter((c) => c.is_featured).length;
        const target = contents.find((c) => c.id === id);
        if (!target) return;

        const willBeFeatured = !target.is_featured;

        if (willBeFeatured && featuredCount >= 5) {
            alert('대표 컨텐츠는 최대 5개까지 설정할 수 있습니다.');
            return;
        }

        setUpdatingId(id);

        const { error } = await supabase.from('contents').update({ is_featured: willBeFeatured }).eq('id', id);

        if (error) {
            alert('대표 설정 실패: ' + error.message);
        } else {
            setContents((prev) => prev.map((c) => (c.id === id ? { ...c, is_featured: willBeFeatured } : c)));
        }

        setUpdatingId(null);
    };

    const toggleRecommended = async (id: number) => {
        const recommendedCount = contents.filter((c) => c.is_recommended).length;
        const target = contents.find((c) => c.id === id);
        if (!target) return;

        const willBeRecommended = !target.is_recommended;

        if (willBeRecommended && recommendedCount >= 3) {
            alert('추천 컨텐츠는 최대 3개까지 설정할 수 있습니다.');
            return;
        }

        setUpdatingId(id);

        const { error } = await supabase.from('contents').update({ is_recommended: willBeRecommended }).eq('id', id);

        if (error) {
            alert('추천 설정 실패: ' + error.message);
        } else {
            setContents((prev) => prev.map((c) => (c.id === id ? { ...c, is_recommended: willBeRecommended } : c)));
        }

        setUpdatingId(null);
    };

    const deleteContent = async (id: number) => {
        const confirmed = confirm('정말 이 컨텐츠를 삭제하시겠습니까?');
        if (!confirmed) return;

        setUpdatingId(id);

        const { error } = await supabase.from('contents').delete().eq('id', id);

        if (error) {
            alert('삭제 실패: ' + error.message);
        } else {
            setContents((prev) => prev.filter((c) => c.id !== id));
        }

        setUpdatingId(null);
    };

    return (
        <div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 md:p-10 space-y-8">
                {/* 헤더 타이틀 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-4">
                    <div>
                        <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block mb-1">
                            Content Repository
                        </span>
                        <h1 className="text-2xl font-black text-[#0a1f44] tracking-tight">저장된 컨텐츠</h1>
                        <p className="text-xs text-slate-400 mt-1">
                            등록된 컨텐츠를 조회하고 대표 및 추천 상단 노출 상태를 관리합니다.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchContents}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            새로고침
                        </button>
                    </div>
                </div>

                {/* 에러 메시지 */}
                {statusMessage && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs font-medium text-amber-800">
                        <AlertCircle size={16} className="text-amber-600 shrink-0" />
                        <span>{statusMessage}</span>
                    </div>
                )}

                {/* 목록 영역 */}
                {loading ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400 gap-3">
                        <RefreshCw size={24} className="animate-spin text-blue-600" />
                        <span className="text-xs font-medium">컨텐츠 목록을 불러오는 중입니다...</span>
                    </div>
                ) : contents.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <LayoutGrid size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-600 font-semibold text-sm">등록된 컨텐츠가 없습니다.</p>
                        <p className="text-slate-400 text-xs mt-1">새로운 아티클이나 자료를 등록해 보세요.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {contents.map((content) => {
                            const isProcessing = updatingId === content.id;

                            return (
                                <div
                                    key={content.id}
                                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                                        content.is_featured
                                            ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-md'
                                            : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                                    }`}
                                >
                                    <div>
                                        {/* 이미지 영역 & 뱃지 오버레이 */}
                                        <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                                            {content.image_url ? (
                                                <Image
                                                    src={content.image_url}
                                                    alt={content.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1">
                                                    <ImageIcon size={32} />
                                                    <span className="text-xs">이미지 없음</span>
                                                </div>
                                            )}

                                            {/* 태그 뱃지 */}
                                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                                                {content.is_featured && (
                                                    <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md">
                                                        <Star size={11} className="fill-current" />
                                                        대표 (최대 5)
                                                    </span>
                                                )}
                                                {content.is_recommended && (
                                                    <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md">
                                                        <ThumbsUp size={11} className="fill-current" />
                                                        추천 (최대 3)
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* 컨텐츠 텍스트 */}
                                        <div className="p-5 space-y-2">
                                            <h2 className="text-base font-bold text-[#0a1f44] line-clamp-1">
                                                {content.title}
                                            </h2>
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                {content.description || '설명이 없습니다.'}
                                            </p>
                                            <p className="text-[11px] font-medium text-slate-400 pt-1">
                                                {new Date(content.created_at).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 하단 관리 액션 패널 */}
                                    <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                            {/* 대표 설정 버튼 */}
                                            <button
                                                onClick={() => toggleFeatured(content.id)}
                                                disabled={isProcessing}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                                    content.is_featured
                                                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                <Star
                                                    size={13}
                                                    className={content.is_featured ? 'fill-amber-600 text-amber-600' : ''}
                                                />
                                                <span>{content.is_featured ? '대표 해제' : '대표'}</span>
                                            </button>

                                            {/* 추천 설정 버튼 */}
                                            <button
                                                onClick={() => toggleRecommended(content.id)}
                                                disabled={isProcessing}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                                    content.is_recommended
                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                <ThumbsUp
                                                    size={13}
                                                    className={content.is_recommended ? 'fill-emerald-600 text-emerald-600' : ''}
                                                />
                                                <span>{content.is_recommended ? '추천 해제' : '추천'}</span>
                                            </button>
                                        </div>

                                        {/* 삭제 버튼 */}
                                        <button
                                            onClick={() => deleteContent(content.id)}
                                            disabled={isProcessing}
                                            title="삭제"
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}