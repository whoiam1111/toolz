'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../about/components/LoadingSpinner';
import Link from 'next/link';
import { Users, UserPlus, Building2, FilePlus, LayoutGrid, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminPage() {
    const { session } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!session) {
            router.replace('/login');
            return;
        }
        if (session.user.email !== 'seouljdb@jdb.com') {
            router.replace('/unauthorized');
            return;
        }

        setIsLoading(false);
    }, [session, router]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 md:p-12 space-y-10">
                {/* 헤더 섹션 */}
                <div className="text-center space-y-2 border-b border-slate-100 pb-8">
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        <ShieldCheck size={14} />
                        Admin Workspace
                    </div>
                    <h1 className="text-3xl font-black text-[#0a1f44] tracking-tight">관리자 페이지</h1>
                    <p className="text-sm text-slate-400">
                        원하시는 관리 작업 메뉴를 선택해 진행해 주세요.
                    </p>
                </div>

                {/* 대시보드 메뉴 그리드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AdminCard
                        href="/admins/counselors"
                        title="코치 명단 확인"
                        description="등록된 코치 정보 및 권한 조회"
                        icon={<Users size={22} className="text-blue-600" />}
                    />
                    <AdminCard
                        href="/admins/create-counselor"
                        title="계정 생성"
                        description="신규 코치 계정 및 프로필 등록"
                        icon={<UserPlus size={22} className="text-blue-600" />}
                    />
                    <AdminCard
                        href="/admins/organization"
                        title="단체 관리"
                        description="소속 단체 및 기관 목록 관리"
                        icon={<Building2 size={22} className="text-blue-600" />}
                    />
                    <AdminCard
                        href="/admins/create-content"
                        title="컨텐츠 추가"
                        description="신규 아티클 및 파일 업로드"
                        icon={<FilePlus size={22} className="text-blue-600" />}
                    />
                    <AdminCard
                        href="/admins/view-content"
                        title="컨텐츠 보기"
                        description="저장된 컨텐츠 수정 및 노출 설정"
                        icon={<LayoutGrid size={22} className="text-blue-600" />}
                    />
                </div>
            </div>
        </div>
    );
}

{/* 모듈형 메뉴 카드 컴포넌트 */}
function AdminCard({
    href,
    title,
    description,
    icon,
}: {
    href: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <Link href={href} className="group block">
            <div className="h-full p-6 bg-slate-50/60 hover:bg-white border border-slate-200/80 hover:border-[#0a1f44]/30 rounded-2xl transition-all duration-200 hover:shadow-md hover:shadow-[#0a1f44]/5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-[#0a1f44] group-hover:text-blue-600 transition-colors">
                            {title}
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center text-xs font-bold text-[#0a1f44] group-hover:translate-x-1 transition-transform">
                    <span>이동하기</span>
                    <ArrowRight size={14} className="ml-1 text-blue-600" />
                </div>
            </div>
        </Link>
    );
}