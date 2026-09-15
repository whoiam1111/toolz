'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';

type Counselor = {
    id: string;
    name: string;
    email: string;
    user_id: string;
};

export default function CounselorsPage() {
    const [counselors, setCounselors] = useState<Counselor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCounselors = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from('counselors').select('id, name, email, user_id');

                if (error) throw error;

                setCounselors(data);
            } catch (err) {
                console.error('코치 목록 불러오기 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCounselors();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-[#f8fafc] min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-[#0a1f44]/20 border-t-[#0a1f44] rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium text-base">코치 목록을 불러오는 중입니다...</p>
            </div>
        );
    }

    if (counselors.length === 0) {
        return (
            <div className="max-w-4xl mx-auto my-20 p-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm text-center">
                <p className="text-slate-400 font-medium text-lg">등록된 코치 정보가 없습니다.</p>
            </div>
        );
    }

    return (
        /* 전체 컨테이너: 오프화이트 배경 모듈 */
        <div className="max-w-4xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
            <div className="border-b border-slate-100 pb-6">
                <h1 className="text-3xl font-black text-[#0a1f44] tracking-tight text-center">코치 목록</h1>
                <p className="text-center text-slate-500 text-sm mt-2 font-normal">
                    TOOL:Z 등록 코치진의 주요 정보 및 상세 프로필을 관리합니다.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        {/* 헤더: 딥 로열 블루 (#0a1f44) */}
                        <tr className="bg-[#0a1f44] text-white text-sm font-bold">
                            <th className="py-4 px-6 text-left">이름</th>
                            <th className="py-4 px-6 text-left">이메일</th>
                            <th className="py-4 px-6 text-center">상세보기</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {counselors.map((counselor) => (
                            <tr key={counselor.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-4 px-6 font-bold text-[#0a1f44]">{counselor.name}</td>
                                <td className="py-4 px-6 text-slate-600 font-normal">{counselor.email}</td>
                                <td className="py-4 px-6 text-center">
                                    <Link href={`/admins/counselors/${counselor.user_id}`}>
                                        <button className="px-4 py-1.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                            상세보기
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}