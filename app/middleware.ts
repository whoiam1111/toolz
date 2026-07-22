import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request: { headers: request.headers } });

    // 1. 수문장이 쿠키 세션 확인
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set({ name, value, ...options });
                        response = NextResponse.next({ request: { headers: request.headers } });
                        response.cookies.set({ name, value, ...options });
                    });
                },
            },
        }
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // 2. 로그인 안 하고 /trial/dashboard 들어오려고 하면? 바로 로그인 페이지로 쫓아냄!
    if (!session && request.nextUrl.pathname.startsWith('/trial/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
}

// 3. /trial/dashboard 경로 및 하위 경로에만 이 수문장을 배치
export const config = {
    matcher: ['/trial/dashboard/:path*'],
};
