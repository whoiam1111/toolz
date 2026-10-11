'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import LoadingSpinner from '@/app/about/components/LoadingSpinner';

// 화면 단 보호(UX용). 실제 접근 차단은 proxy.ts와 Supabase RLS가 담당한다.
export default function AuthGuard({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
    const { session, isAdmin } = useAuth();
    const router = useRouter();

    const checking = session === undefined || (admin && !!session && isAdmin === undefined);
    const allowed = !!session && (!admin || isAdmin === true);

    useEffect(() => {
        if (checking) return;
        if (!session) router.replace('/login');
        else if (admin && !isAdmin) router.replace('/unauthorized');
    }, [checking, session, admin, isAdmin, router]);

    if (checking || !allowed) return <LoadingSpinner />;
    return <>{children}</>;
}
