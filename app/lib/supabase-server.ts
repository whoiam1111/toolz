import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { isAdminUser } from './admin';

// 요청 쿠키의 로그인 세션을 그대로 사용하는 서버용 Supabase 클라이언트 (API 라우트, 서버 컴포넌트 전용)
export async function getSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                } catch {
                    // Server Component 등 읽기 전용 환경에서는 쿠키를 쓸 수 없으므로 무시
                }
            },
        },
    });
}

type AuthResult =
    | { ok: true; supabase: SupabaseClient; user: User }
    | { ok: false; status: 401 | 403; message: string };

// API 라우트용 인증 확인. level이 'admin'이면 관리자만 통과
export async function requireUser(level: 'user' | 'admin' = 'user'): Promise<AuthResult> {
    const supabase = await getSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { ok: false, status: 401, message: '로그인이 필요합니다.' };
    if (level === 'admin' && !(await isAdminUser(supabase, user))) {
        return { ok: false, status: 403, message: '관리자 권한이 필요합니다.' };
    }
    return { ok: true, supabase, user };
}
