import type { ReactNode } from 'react';
import AuthGuard from '@/app/components/AuthGuard';

export default function TrialDashboardLayout({ children }: { children: ReactNode }) {
    return <AuthGuard>{children}</AuthGuard>;
}
