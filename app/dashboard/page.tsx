'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { getParticipantById, updateParticipant, deleteParticipant } from '@/app/api/supabaseApi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    Calendar, 
    Zap, 
    MapPin, 
    FileSignature, 
    ArrowLeft, 
    Edit3, 
    Trash2, 
    Save, 
    X, 
    Loader2, 
    ShieldCheck, 
    ExternalLink 
} from 'lucide-react';

type Participant = {
    id: string;
    name: string;
    birth_date: string;
    stress: string;
    religion: string;
    signatureurl?: string;
    created_at?: string;
};

export default function ParticipantDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [participant, setParticipant] = useState<Participant | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageError, setImageError] = useState(false);

    const [form, setForm] = useState({
        name: '',
        birth_date: '',
        stress: '',
        religion: '',
    });

    useEffect(() => {
        if (id) {
            fetchParticipantDetail(id);
        }
    }, [id]);

    const fetchParticipantDetail = async (targetId: string) => {
        setLoading(true);
        const { data, error } = await getParticipantById(targetId);
        if (error) {
            console.error('대상자 정보 불러오기 오류:', error);
            alert('대상자 정보를 불러오는 데 실패했습니다.');
        } else if (data) {
            setParticipant(data);
            setForm({
                name: data.name || '',
                birth_date: data.birth_date || '',
                stress: data.stress || '',
                religion: data.religion || '',
            });
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!id) return;
        setSaving(true);
        const { error } = await updateParticipant(id, form);
        setSaving(false);

        if (error) {
            console.error('수정 오류:', error);
            alert('수정에 실패했습니다.');
        } else {
            alert('정보가 수정되었습니다.');
            setParticipant((prev) => (prev ? { ...prev, ...form } : null));
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !window.confirm('정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.')) return;

        const { error } = await deleteParticipant(id);
        if (error) {
            console.error('삭제 오류:', error);
            alert('삭제에 실패했습니다.');
        } else {
            alert('삭제되었습니다.');
            router.push('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#061229] flex flex-col items-center justify-center text-slate-300">
                <Loader2 className="animate-spin text-indigo-400 mb-4" size={40} />
                <p className="text-sm font-medium tracking-wide">대상자 데이터를 불러오는 중...</p>
            </div>
        );
    }

    if (!participant) {
        return (
            <div className="min-h-screen bg-[#061229] flex flex-col items-center justify-center text-slate-300">
                <p className="text-lg font-bold mb-4">존재하지 않거나 삭제된 대상자입니다.</p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
                >
                    <ArrowLeft size={18} /> 대시보드로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#061229] text-slate-100 py-16 px-6 relative overflow-hidden selection:bg-indigo-500/30">
            {/* 상단 은은한 앰비언트 글로우 방사 효과 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />

            <div className="max-w-3xl mx-auto relative z-10">
                
                {/* 상단 내비게이션 및 헤더 */}
                <div className="mb-8 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        목록으로 돌아가기
                    </button>

                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all"
                                >
                                    <X size={14} /> 취소
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                    저장하기
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-indigo-600 hover:border-indigo-600 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
                                >
                                    <Edit3 size={14} /> 정보 수정
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-rose-600/20 hover:border-rose-500/30 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 transition-all shadow-sm"
                                >
                                    <Trash2 size={14} /> 삭제
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 메인 프로필 카드 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#0a1f44] rounded-3xl border border-white/10 shadow-2xl p-8 md:p-10 backdrop-blur-md space-y-8"
                >
                    {/* 타이틀 및 브랜드 헤더 */}
                    <div className="border-b border-white/10 pb-6 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-xl font-black tracking-tighter text-white uppercase italic">TOOL</span>
                                <span className="text-xl font-black text-indigo-400">:</span>
                                <span className="text-xl font-black tracking-tighter text-white uppercase mr-2">Z</span>
                                <span className="text-sm font-semibold text-indigo-400 tracking-wide uppercase">Participant Profile</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                {isEditing ? '대상자 정보 수정' : `${participant.name} 님의 상세 정보`}
                            </h1>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-indigo-400">
                            <ShieldCheck size={28} />
                        </div>
                    </div>

                    {/* 정보 그리드 */}
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                key="edit"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid gap-6 md:grid-cols-2"
                            >
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-slate-300 ml-1 tracking-wider uppercase">
                                        성함
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full bg-[#061229] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm font-medium shadow-inner"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-slate-300 ml-1 tracking-wider uppercase">
                                        생년월일
                                    </label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        value={form.birth_date}
                                        onChange={handleChange}
                                        className="w-full bg-[#061229] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm font-medium shadow-inner"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-slate-300 ml-1 tracking-wider uppercase">
                                        주요 스트레스 요인
                                    </label>
                                    <input
                                        type="text"
                                        name="stress"
                                        value={form.stress}
                                        onChange={handleChange}
                                        className="w-full bg-[#061229] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm font-medium shadow-inner"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-slate-300 ml-1 tracking-wider uppercase">
                                        거주지 (동 단위)
                                    </label>
                                    <input
                                        type="text"
                                        name="religion"
                                        value={form.religion}
                                        onChange={handleChange}
                                        className="w-full bg-[#061229] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm font-medium shadow-inner"
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid gap-4 md:grid-cols-2"
                            >
                                <div className="bg-[#061229]/60 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">성함</p>
                                        <p className="text-base font-bold text-white">{participant.name}</p>
                                    </div>
                                </div>

                                <div className="bg-[#061229]/60 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">생년월일</p>
                                        <p className="text-base font-bold text-white">{participant.birth_date || '-'}</p>
                                    </div>
                                </div>

                                <div className="bg-[#061229]/60 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">주요 스트레스 요인</p>
                                        <p className="text-base font-bold text-white">{participant.stress || '-'}</p>
                                    </div>
                                </div>

                                <div className="bg-[#061229]/60 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">거주지 (동 단위)</p>
                                        <p className="text-base font-bold text-white">{participant.religion || '-'}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 서약서 및 서명 확인 섹션 */}
                    <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                <FileSignature size={16} className="text-indigo-400" />
                                보안 서약서 및 서명 기록
                            </h3>
                            {participant.signatureurl && (
                                <a
                                    href={participant.signatureurl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                                >
                                    원본 보기 <ExternalLink size={12} />
                                </a>
                            )}
                        </div>

                        {participant.signatureurl && !imageError ? (
                            <div className="relative w-full h-80 bg-white border border-white/10 rounded-2xl p-3 overflow-hidden shadow-2xl group">
                                <Image
                                    src={participant.signatureurl}
                                    alt="비밀유지 서약서 서명"
                                    fill
                                    unoptimized // 필요에 따라 이미지 도메인 우회를 원할 경우 유지
                                    className="object-contain p-2 rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                                    onError={() => {
                                        console.error('서명 이미지 로드 실패:', participant.signatureurl);
                                        setImageError(true);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="bg-[#061229]/40 border border-dashed border-white/10 rounded-2xl p-8 text-center text-slate-500 text-xs">
                                {imageError ? '서약서 이미지를 불러올 수 없습니다.' : '등록된 서약서 이미지가 없습니다.'}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}