import { NextResponse } from 'next/server';

// 할인/파트너 코드 검증. 코드는 서버 전용 환경변수 PROMO_CODES(쉼표 구분)에만 둔다 (클라이언트 번들 노출 방지)
export async function POST(req: Request) {
    const { code } = await req.json().catch(() => ({ code: '' }));

    const validCodes = (process.env.PROMO_CODES ?? '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

    const valid = typeof code === 'string' && validCodes.includes(code.trim());
    return NextResponse.json({ valid });
}
