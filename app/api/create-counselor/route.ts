import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireUser } from '@/app/lib/supabase-server';

export async function POST(req: Request) {
    const auth = await requireUser('admin');
    if (!auth.ok) return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });

    const { email, password, name, region } = await req.json();

    if (!email || !password || !name || !region) {
        return NextResponse.json({ success: false, message: '모든 필드를 입력하세요.' }, { status: 400 });
    }

    // 가입은 요청마다 새 클라이언트로: 관리자 쿠키 세션이 새 계정 세션으로 바뀌지 않고, 요청 간 인증 상태도 공유되지 않는다
    const signUpClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data, error: signUpError } = await signUpClient.auth.signUp({ email, password });

    if (signUpError || !data?.user) {
        return NextResponse.json({ success: false, message: signUpError?.message || '회원가입 실패' }, { status: 400 });
    }

    // counselors 행은 로그인한 관리자 권한으로 추가 (마이그레이션 RLS: 관리자만 insert 가능).
    // 마이그레이션 적용 전 정책과의 호환을 위해 실패하면 기존 방식(가입 클라이언트)으로 한 번 더 시도한다.
    const row = { user_id: data.user.id, name, email, region };
    let { error: insertError } = await auth.supabase.from('counselors').insert([row]);
    if (insertError) {
        ({ error: insertError } = await signUpClient.from('counselors').insert([row]));
    }

    if (insertError) {
        return NextResponse.json({ success: false, message: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: '코치 계정 생성 완료' });
}
