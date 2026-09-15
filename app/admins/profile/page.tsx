'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import { Camera, User, Mail, Save, Loader2, UserCheck, AlertCircle } from 'lucide-react';

export default function CounselorProfilePage() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        photoUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async () => {
            setInitialLoading(true);
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error('사용자 인증 실패', authError);
                setStatusMessage({ type: 'error', text: '사용자 인증에 실패했습니다.' });
                setInitialLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('counselors')
                .select('name, email, photo_url')
                .eq('user_id', user.id)
                .single();

            if (error) {
                console.error('프로필 로드 실패', error);
                setStatusMessage({ type: 'error', text: '프로필 정보를 불러오지 못했습니다.' });
            } else if (data) {
                setProfile({
                    name: data.name,
                    email: data.email,
                    photoUrl: data.photo_url ?? '',
                });
            }
            setInitialLoading(false);
        })();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreviewUrl(URL.createObjectURL(file));
        setStatusMessage(null);
    };

    const sanitizeFileName = (fileName: string): string => {
        const extension = fileName.split('.').pop();
        const baseName = fileName
            .replace(/\.[^/.]+$/, '') // 확장자 제거
            .replace(/[^a-zA-Z0-9_-]/g, ''); // 안전하지 않은 문자 제거
        const timestamp = Date.now();
        return `${baseName}_${timestamp}.${extension}`;
    };

    const handleSave = async () => {
        setLoading(true);
        setStatusMessage(null);

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            setStatusMessage({ type: 'error', text: '사용자 인증에 실패했습니다.' });
            setLoading(false);
            return;
        }

        let updatedPhotoUrl = profile.photoUrl;
        const file = fileInputRef.current?.files?.[0];

        if (file) {
            const safeFileName = sanitizeFileName(file.name);
            const { error: uploadError } = await supabase.storage.from('counselor-photos').upload(safeFileName, file);

            if (uploadError) {
                console.error('Storage 업로드 실패:', uploadError.message);
                setStatusMessage({ type: 'error', text: `사진 업로드 실패: ${uploadError.message}` });
                setLoading(false);
                return;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from('counselor-photos').getPublicUrl(safeFileName);

            updatedPhotoUrl = publicUrl;
        }

        const { error: dbError } = await supabase
            .from('counselors')
            .update({
                name: profile.name,
                email: profile.email,
                photo_url: updatedPhotoUrl,
            })
            .eq('user_id', user.id);

        setLoading(false);

        if (dbError) {
            console.error('DB 업데이트 실패:', dbError.message);
            setStatusMessage({ type: 'error', text: '프로필 수정에 실패했습니다.' });
        } else {
            setStatusMessage({ type: 'success', text: '프로필 정보가 업데이트되었습니다.' });
            setPreviewUrl(null);
            setProfile((prev) => ({ ...prev, photoUrl: updatedPhotoUrl }));
        }
    };

    return (
        <div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 md:p-10 space-y-8">
                {/* 헤더 섹션 */}
                <div className="border-b border-slate-100 pb-6">
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block mb-1">
                        Coach Settings
                    </span>
                    <h1 className="text-2xl font-black text-[#0a1f44] tracking-tight">코치 프로필 수정</h1>
                    <p className="text-xs text-slate-400 mt-1">
                        상담 고객에게 표시될 정보와 프로필 이미지를 설정합니다.
                    </p>
                </div>

                {/* 상태 알림 메시지 */}
                {statusMessage && (
                    <div
                        className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
                            statusMessage.type === 'success'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                                : 'bg-rose-50 text-rose-800 border border-rose-200/60'
                        }`}
                    >
                        {statusMessage.type === 'success' ? (
                            <UserCheck size={18} className="text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle size={18} className="text-rose-600 shrink-0" />
                        )}
                        <span>{statusMessage.text}</span>
                    </div>
                )}

                {initialLoading ? (
                    <div className="py-16 text-center flex flex-col items-center justify-center text-slate-400 gap-3">
                        <Loader2 size={28} className="animate-spin text-blue-600" />
                        <span className="text-xs font-medium">프로필 정보를 불러오는 중...</span>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* 프로필 이미지 업로드 영역 */}
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-slate-200/80 shadow-inner relative bg-slate-100 flex items-center justify-center">
                                    {previewUrl || profile.photoUrl ? (
                                        <Image
                                            src={previewUrl || profile.photoUrl}
                                            alt="프로필 사진"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User size={48} className="text-slate-300" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-[#0a1f44]/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium gap-1">
                                    <Camera size={20} />
                                    <span>사진 변경</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-4"
                            >
                                이미지 업로드
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="hidden"
                            />
                        </div>

                        {/* 입력 폼 */}
                        <div className="space-y-5">
                            {/* 이름 */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700">이름</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                                        placeholder="이름을 입력하세요"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/10 focus:border-[#0a1f44] transition-all"
                                    />
                                </div>
                            </div>

                            {/* 이메일 */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700">이메일</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                                        placeholder="example@email.com"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a1f44]/10 focus:border-[#0a1f44] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 저장 버튼 */}
                        <div className="pt-2">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-[#0a1f44] hover:bg-[#0d2857] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md shadow-[#0a1f44]/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>저장 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>변경사항 저장하기</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}