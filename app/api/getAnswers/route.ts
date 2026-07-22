import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
    // 🚨 Next.js 15 필수: cookies() 앞에 반드시 await를 붙여야 합니다.
    const cookieStore = await cookies();

    // 2. @supabase/ssr 방식을 사용하여 서버 클라이언트 생성
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // API 라우트 환경에서 쿠키 세팅 중 발생하는 오류 무시
                    }
                },
            },
        }
    );

    // 3. 서버가 쿠키에 있는 세션을 정상적으로 읽어옵니다.
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error('유저 정보 오류:', userError);
        return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    try {
        // 4. 유저 인증이 확인되었으니, 데이터베이스에서 필요한 데이터를 가져옵니다.
        const { data, error } = await supabase.from('responses').select('clientid, answers, created_at');

        if (error) throw error;

        return NextResponse.json({ answers: data });
    } catch (error) {
        console.error('데이터 로드 오류:', error);
        return NextResponse.json({ error: '데이터 로드 오류' }, { status: 500 });
    }
}
