import { NextResponse } from 'next/server';
import { requireUser } from '@/app/lib/supabase-server';
import { deleteUser } from '@/app/db';

export async function DELETE(request: Request) {
    const auth = await requireUser();
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

    try {
        const { clientid } = await request.json();
        if (!clientid) {
            return NextResponse.json({ error: '삭제할 대상의 clientid가 없습니다.' }, { status: 400 });
        }

        await deleteUser(auth.supabase, clientid);
        return NextResponse.json({ message: '정상적으로 삭제되었습니다.' }, { status: 200 });
    } catch (error) {
        console.error('서버 삭제 API 오류:', error);
        return NextResponse.json({ error: '서버 내부 오류로 인해 삭제에 실패했습니다.' }, { status: 500 });
    }
}
