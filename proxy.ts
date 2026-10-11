import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminUser } from '@/app/lib/admin';

// 로그인이 필요한 경로와 관리자 전용 경로를 서버에서 막는다 (Next 16: middleware → proxy)
const ADMIN_PATHS = ['/admins'];

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                },
            },
        }
    );

    // getSession()과 달리 getUser()는 Supabase 서버에서 토큰을 검증한다
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const { pathname } = request.nextUrl;
    if (ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
        if (!(await isAdminUser(supabase, user))) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/admins/:path*', '/trial/dashboard/:path*'],
};
