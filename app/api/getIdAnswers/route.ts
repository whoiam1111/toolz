import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/app/lib/supabase-server';
import { getIdAnswers } from '@/app/db';

export async function GET(req: NextRequest) {
    const auth = await requireUser();
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

    const clientid = req.nextUrl.searchParams.get('clientid');
    if (!clientid) {
        return NextResponse.json({ error: 'Missing clientid parameter' }, { status: 400 });
    }

    try {
        const answers = await getIdAnswers(auth.supabase, clientid);
        if (answers.length === 0) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }
        return NextResponse.json({ answers });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
