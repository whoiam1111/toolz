import { NextResponse } from 'next/server';
import { deleteUser } from '@/app/db';

export async function DELETE(request: Request) {
    try {
        // 1. 클라이언트(프론트엔드)에서 보낸 JSON 바디 파싱
        const body = await request.json();
        const { clientid } = body;

        // 2. clientid가 정상적으로 넘어왔는지 검증
        if (!clientid) {
            return NextResponse.json({ error: '삭제할 대상의 clientid가 없습니다.' }, { status: 400 });
        }

        // 3. supabaseApi.ts에 정의해둔 deleteUser 함수 호출 (내부적으로 쿠키 및 세션 확인)
        await deleteUser(clientid);

        // 4. 성공 응답 반환 (이 응답을 받아야 프론트에서 response.ok가 true가 됨)
        return NextResponse.json({ message: '정상적으로 삭제되었습니다.' }, { status: 200 });
    } catch (error) {
        console.error('서버 삭제 API 오류:', error);
        return NextResponse.json({ error: '서버 내부 오류로 인해 삭제에 실패했습니다.' }, { status: 500 });
    }
}
