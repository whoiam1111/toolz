'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import { Building2, Globe, FileText, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CreateOrganizationPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [description, setDescription] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setLogoFile(null);
            setLogoPreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        let logoUrl: string | null = null;

        try {
            // 1. 로고 이미지 업로드 (업로드 파일 존재 시)
            if (logoFile) {
                const fileExt = logoFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('organization-logos')
                    .upload(fileName, logoFile, {
                        contentType: logoFile.type,
                        cacheControl: '3600',
                        upsert: true,
                    });

                if (uploadError || !uploadData) {
                    throw new Error(uploadError?.message || '로고 이미지 업로드에 실패했습니다.');
                }

                const { data: urlData } = supabase.storage
                    .from('organization-logos')
                    .getPublicUrl(uploadData.path);

                logoUrl = urlData.publicUrl;
            }

            // 2. 단체 DB 저장
            const { error: insertError } = await supabase.from('organization').insert([
                {
                    name,
                    website,
                    description,
                    logo_url: logoUrl,
                },
            ]);

            if (insertError) {
                throw insertError;
            }

            alert('단체가 성공적으로 생성되었습니다.');
            router.push('/admins/organization');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 md:p-10 space-y-6">
                {/* 헤더 타이틀 */}
                <div className="text-center border-b border-slate-100 pb-6">
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block mb-2">
                        Organization Management
                    </span>
                    <h1 className="text-2xl font-black text-[#0a1f44] tracking-tight">신규 단체 등록</h1>
                    <p className="text-xs text-slate-400 mt-1 font-normal">
                        새로운 단체/기관 프로필 및 기본 정보를 등록합니다.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 단체명 입력 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            단체명 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Building2 size={18} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="단체 또는 기관명을 입력하세요"
                                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a1f44] focus:ring-1 focus:ring-[#0a1f44] transition-all bg-slate-50/50"
                            />
                        </div>
                    </div>

                    {/* 웹사이트 입력 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            홈페이지 주소
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Globe size={18} />
                            </div>
                            <input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a1f44] focus:ring-1 focus:ring-[#0a1f44] transition-all bg-slate-50/50"
                            />
                        </div>
                    </div>

                    {/* 설명 입력 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            간단 설명
                        </label>
                        <div className="relative">
                            <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none text-slate-400">
                                <FileText size={18} />
                            </div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="단체의 역할이나 주요 활동을 작성하세요"
                                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a1f44] focus:ring-1 focus:ring-[#0a1f44] transition-all bg-slate-50/50 resize-none"
                            />
                        </div>
                    </div>

                    {/* 메인 로고 파일 업로드 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            메인 로고 이미지
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="logo-upload"
                        />
                        <label
                            htmlFor="logo-upload"
                            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer group"
                        >
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 mb-2 group-hover:scale-105 transition-transform">
                                <ImageIcon size={20} className="text-blue-600" />
                            </div>
                            <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
                                로고 이미지 선택
                            </span>
                            <span className="text-xs text-slate-400 mt-1">PNG, JPG, SVG 지원</span>
                        </label>

                        {/* 미리보기 영역 */}
                        {logoPreview && (
                            <div className="mt-4 relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center p-4">
                                <Image
                                    src={logoPreview}
                                    alt="Logo preview"
                                    width={200}
                                    height={120}
                                    unoptimized
                                    className="max-h-32 object-contain"
                                />
                                <div className="absolute top-3 right-3 bg-[#0a1f44]/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-medium">
                                    <CheckCircle2 size={14} className="text-blue-400" /> 미리보기
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-medium text-red-800">
                            <AlertCircle size={16} className="text-red-600 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#0a1f44] text-white py-4 rounded-xl font-bold text-base hover:bg-[#0d2857] active:scale-[0.99] transition-all shadow-md shadow-[#0a1f44]/10 disabled:opacity-50 mt-2"
                    >
                        {isSubmitting ? '생성 중...' : '단체 생성하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}