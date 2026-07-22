// app/api/saveAnswers/route.ts
import { NextResponse } from 'next/server';
import { insertAnswers } from '@/app/db'; // 👈 실제 insertAnswers가 있는 경로로 수정하세요!

export async function POST(req: Request) {
    try {
        const { clientid, answers } = await req.json();

        if (!clientid || !answers) {
            return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
        }

        // 수정한 병합(Merge) 로직 실행
        await insertAnswers(clientid, answers);

        return NextResponse.json({ message: '저장 성공' }, { status: 200 });
    } catch (error) {
        console.error('서버 저장 오류:', error);
        return NextResponse.json({ error: '데이터 저장 중 오류 발생' }, { status: 500 });
    }
}
