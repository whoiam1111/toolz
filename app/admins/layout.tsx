import type { ReactNode } from 'react';
import AuthGuard from '@/app/components/AuthGuard';

export default function AdminsLayout({ children }: { children: ReactNode }) {
    return <AuthGuard admin>{children}</AuthGuard>;
}
