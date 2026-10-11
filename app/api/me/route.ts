import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/app/lib/supabase-server';
import { isAdminUser } from '@/app/lib/admin';

// 현재 로그인 사용자의 권한 정보 (관리자 메뉴 표시용 — 실제 접근 제어는 proxy.ts와 각 API에서 한다)
export async function GET() {
    const supabase = await getSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ isAdmin: false }, { status: 401 });

    return NextResponse.json({ isAdmin: await isAdminUser(supabase, user) });
}
