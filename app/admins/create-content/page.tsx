'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import { CheckCircle2, Image as ImageIcon } from 'lucide-react';

export default function CreateContentPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isRecommended, setIsRecommended] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('제목을 입력하세요');
            return;
        }

        setLoading(true);

        let imageUrl = '';

        const file = fileInputRef.current?.files?.[0];
        if (file) {
            // 1. 안전한 파일명 생성
            const fileExt = file.name.split('.').pop();
            const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

            // 2. Supabase Storage 업로드
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('contents')
                .upload(cleanFileName, file, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: true,
                });

            if (uploadError || !uploadData) {
                console.error('Storage Upload Error:', uploadError);
                alert(`이미지 업로드 실패: ${uploadError?.message || '업로드 데이터를 받지 못했습니다.'}\n(Storage의 'contents' 버킷 존재 여부 및 RLS 권한을 확인하세요)`);
                setLoading(false);
                return;
            }

            // 3. uploadData.path를 활용하여 안전하게 Public URL 추출
            const { data: urlData } = supabase.storage.from('contents').getPublicUrl(uploadData.path);
            imageUrl = urlData.publicUrl;
        }

        // 4. DB Insert
        const { error: insertError } = await supabase.from('contents').insert([
            {
                title,
                description,
                image_url: imageUrl,
                is_featured: isFeatured,
                is_recommended: isRecommended,
            },
        ]);

        setLoading(false);

        if (insertError) {
            console.error('DB Insert Error:', insertError);
            alert(`컨텐츠 저장 실패: ${insertError.message}`);
        } else {
            alert('컨텐츠가 성공적으로 저장되었습니다!');
            setTitle('');
            setDescription('');
            setIsFeatured(false);
            setIsRecommended(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setImagePreview(null);
        }
    };

    const handleFileChange = () => {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 md:p-10 space-y-8">
                {/* 헤더 타이틀 */}
                <div className="text-center border-b border-slate-100 pb-6">
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block mb-2">
                        Content Management
                    </span>
                    <h1 className="text-3xl font-black text-[#0a1f44] tracking-tight">컨텐츠 추가</h1>
                </div>

                <div className="space-y-6">
                    {/* 제목 입력 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            제목
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a1f44] focus:ring-1 focus:ring-[#0a1f44] transition-all bg-slate-50/50"
                            placeholder="컨텐츠 제목을 입력하세요"
                        />
                    </div>

                    {/* 설명 입력 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            설명
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 placeholder-slate-400 h-32 resize-none focus:outline-none focus:border-[#0a1f44] focus:ring-1 focus:ring-[#0a1f44] transition-all bg-slate-50/50"
                            placeholder="간단한 설명을 작성하세요"
                        />
                    </div>

                    {/* 옵션 체크박스 */}
                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 accent-[#0a1f44]"
                            />
                            <span className="text-sm font-semibold text-slate-700">대표 컨텐츠</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isRecommended}
                                onChange={(e) => setIsRecommended(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 accent-[#0a1f44]"
                            />
                            <span className="text-sm font-semibold text-slate-700">추천 컨텐츠</span>
                        </label>
                    </div>

                    {/* 파일 업로드 영역 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            대표 이미지
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            accept="image/*"
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer group"
                        >
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 mb-2 group-hover:scale-105 transition-transform">
                                <ImageIcon size={20} className="text-blue-600" />
                            </div>
                            <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
                                클릭하여 이미지를 선택하세요
                            </span>
                            <span className="text-xs text-slate-400 mt-1">PNG, JPG, GIF 지원</span>
                        </label>

                        {/* 미리보기 영역 */}
                        {imagePreview && (
                            <div className="mt-4 relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                                <Image
                                    src={imagePreview}
                                    alt="Image preview"
                                    width={500}
                                    height={300}
                                    unoptimized
                                    className="w-full max-h-64 object-cover"
                                />
                                <div className="absolute top-3 right-3 bg-[#0a1f44]/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-medium">
                                    <CheckCircle2 size={14} className="text-blue-400" /> 미리보기
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-[#0a1f44] text-white py-4 rounded-xl font-bold text-base hover:bg-[#0d2857] active:scale-[0.99] transition-all shadow-md shadow-[#0a1f44]/10 disabled:opacity-50"
                    >
                        {loading ? '저장 중...' : '컨텐츠 저장하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}