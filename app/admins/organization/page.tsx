'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabase';
import { Building2, Globe, Plus, Trash2, Edit3, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

type Organization = {
    id: number;
    name: string;
    website: string | null;
    description: string | null;
    logo_url: string | null;
};

export default function OrganizationListPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    async function fetchOrganizations() {
        setLoading(true);
        setMessage(null);
        const { data, error } = await supabase.from('organization').select('*').order('id', { ascending: true });

        if (error) {
            setMessage(`불러오기 오류: ${error.message}`);
        } else {
            setOrganizations(data ?? []);
        }

        setLoading(false);
    }

    async function handleDelete(id: number) {
        if (!confirm('정말 이 단체를 삭제하시겠습니까?')) return;

        const { error } = await supabase.from('organization').delete().eq('id', id);

        if (error) {
            setMessage(`삭제 실패: ${error.message}`);
        } else {
            setMessage('성공적으로 삭제되었습니다.');
            fetchOrganizations();
        }
    }

    return (
        <div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 md:p-10 space-y-6">
                {/* 헤더 타이틀 및 상단 액션 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-4">
                    <div>
                        <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block mb-1">
                            Organization Management
                        </span>
                        <h1 className="text-2xl font-black text-[#0a1f44] tracking-tight">단체 목록</h1>
                        <p className="text-xs text-slate-400 mt-1">
                            등록된 모든 기관 및 단체 정보를 확인하고 관리합니다.
                        </p>
                    </div>

                    <Link
                        href="/admins/organization/create"
                        className="inline-flex items-center justify-center gap-2 bg-[#0a1f44] hover:bg-[#0d2857] text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-[#0a1f44]/10 active:scale-[0.98]"
                    >
                        <Plus size={18} />
                        신규 단체 생성
                    </Link>
                </div>

                {/* 피드백 메시지 */}
                {message && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs font-medium text-amber-800">
                        <AlertCircle size={16} className="text-amber-600 shrink-0" />
                        <span>{message}</span>
                    </div>
                )}

                {/* 리스트 영역 */}
                {loading ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400 gap-3">
                        <RefreshCw size={24} className="animate-spin text-blue-600" />
                        <span className="text-sm font-medium">데이터를 불러오는 중입니다...</span>
                    </div>
                ) : organizations.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-600 font-semibold text-sm">등록된 단체가 없습니다.</p>
                        <p className="text-slate-400 text-xs mt-1">새로운 단체를 생성해 보세요.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="p-4 w-20 text-center">로고</th>
                                    <th className="p-4">단체명</th>
                                    <th className="p-4">홈페이지</th>
                                    <th className="p-4">설명</th>
                                    <th className="p-4 w-28 text-center">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {organizations.map((org) => (
                                    <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* 로고 */}
                                        <td className="p-4 text-center">
                                            {org.logo_url ? (
                                                <div className="w-12 h-12 relative mx-auto rounded-xl border border-slate-200 overflow-hidden bg-white p-1">
                                                    <Image
                                                        src={org.logo_url}
                                                        alt={`${org.name} 로고`}
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 mx-auto rounded-xl border border-slate-100 bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Building2 size={20} />
                                                </div>
                                            )}
                                        </td>

                                        {/* 단체명 */}
                                        <td className="p-4 font-bold text-[#0a1f44]">{org.name}</td>

                                        {/* 홈페이지 */}
                                        <td className="p-4">
                                            {org.website ? (
                                                <a
                                                    href={org.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium text-xs bg-blue-50/60 px-2.5 py-1 rounded-md border border-blue-100"
                                                >
                                                    <Globe size={13} />
                                                    {org.website.replace(/^https?:\/\//, '')}
                                                    <ExternalLink size={11} className="opacity-70" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 text-xs">-</span>
                                            )}
                                        </td>

                                        {/* 설명 */}
                                        <td className="p-4 text-slate-600 text-xs max-w-xs truncate">
                                            {org.description || <span className="text-slate-300">-</span>}
                                        </td>

                                        {/* 액션 버튼 */}
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => alert('수정 기능 준비 중입니다.')}
                                                    title="수정"
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(org.id)}
                                                    title="삭제"
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}