import type { SupabaseClient, User } from '@supabase/supabase-js';

// 관리자 판별: 서버 전용 환경변수 ADMIN_EMAILS(쉼표 구분) 또는 admins 테이블(마이그레이션 적용 시)에 등록된 사용자
// 이메일을 클라이언트 번들에 하드코딩하지 않기 위해 서버(proxy, API 라우트)에서만 호출한다.
export async function isAdminUser(supabase: SupabaseClient, user: User): Promise<boolean> {
    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

    if (user.email && adminEmails.includes(user.email.toLowerCase())) return true;

    // admins 테이블이 아직 없으면 error가 반환되므로 false로 처리
    const { data, error } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
    return !error && !!data;
}
