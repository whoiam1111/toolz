'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { User, Mail, Users, ChevronRight } from 'lucide-react';

type Counselor = {
    id: string;
    name: string;
    email: string;
    user_id: string;
};

type Participant = {
    id: string;
    name: string;
    counselors: string;
    birth_date: string;
};

export default function CounselorDetailPage() {
    const params = useParams();
    const user_id = String(params?.id);

    const [counselor, setCounselor] = useState<Counselor | null>(null);
    const [participant, setParticipant] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user_id) return;

            try {
                const { data: counselorData, error: counselorError } = await supabase
                    .from('counselors')
                    .select('id, name, email, user_id')
                    .eq('user_id', user_id)
                    .single();

                if (counselorError) throw counselorError;
                setCounselor(counselorData);

                const { data: participantData, error: participantError } = await supabase
                    .from('participant')
                    .select('id, name, counselors, birth_date')
                    .eq('counselors', user_id);

                if (participantError) throw participantError;

                setParticipant(participantData);
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user_id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-[#f8fafc] min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-[#0a1f44]/20 border-t-[#0a1f44] rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium text-base">코치 상세 정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (!counselor) {
        return (
            <div className="max-w-2xl mx-auto my-20 p-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm text-center">
                <p className="text-slate-400 font-medium text-lg">코치 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        /* 전체 컨테이너: 오프화이트 배경 상의 깔끔한 카드 모듈 */
        <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
            {/* 상단 타이틀 */}
            <div className="border-b border-slate-100 pb-6 text-center">
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block mb-2">
                    Coach Profile
                </span>
                <h1 className="text-3xl font-black text-[#0a1f44] tracking-tight">코치 상세 정보</h1>
            </div>

            {/* 코치 기본 정보 섹션 */}
            <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/60 space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[#0a1f44] shadow-sm">
                        <User size={18} />
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-slate-400 block">이름</span>
                        <span className="text-base font-bold text-[#0a1f44]">{counselor.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[#0a1f44] shadow-sm">
                        <Mail size={18} />
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-slate-400 block">이메일</span>
                        <span className="text-base font-medium text-slate-600">{counselor.email}</span>
                    </div>
                </div>
            </div>

            {/* 담당 참여자 목록 섹션 */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users size={20} className="text-blue-600" />
                        <h2 className="text-xl font-bold text-[#0a1f44]">담당 참여자 목록</h2>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                        {participant.length}명
                    </span>
                </div>

                {participant.length > 0 ? (
                    <div className="grid gap-3">
                        {participant.map((item) => (
                            <Link
                                key={item.id}
                                href={`/dashboard/participant/${item.id}`}
                                className="group flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-[#0a1f44]/30 transition-all duration-200 shadow-sm"
                            >
                                <div className="space-y-1">
                                    <p className="font-bold text-[#0a1f44] group-hover:text-blue-600 transition-colors">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-slate-400 font-normal">
                                        생년월일: {item.birth_date || '미입력'}
                                    </p>
                                </div>
                                <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                                    <ChevronRight size={18} />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                        <p className="text-slate-400 font-medium text-sm">등록된 담당 참여자가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}