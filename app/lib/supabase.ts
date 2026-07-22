'use client';

import { createBrowserClient } from '@supabase/ssr';

// 수정된 코드: auth-helpers 대신 ssr 패키지의 브라우저 클라이언트 사용
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
