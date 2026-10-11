import { NextResponse } from 'next/server';
import { requireUser } from '@/app/lib/supabase-server';
import { getAnswers } from '@/app/db';

export async function GET() {
    const auth = await requireUser();
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

    try {
        const answers = await getAnswers(auth.supabase);
        return NextResponse.json({ answers });
    } catch (error) {
        console.error('데이터 로드 오류:', error);
        return NextResponse.json({ error: '데이터 로드 오류' }, { status: 500 });
    }
}
