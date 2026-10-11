import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseServerClient } from '@/app/lib/supabase-server';

// 체험 검사(responses 테이블) 서버 측 데이터 함수

interface AnswerData {
    clientid: string;
    answers: Record<string, number>;
    created_at: string;
}

// 1. 답변 저장: 같은 clientid의 기존 답변이 있으면 병합 (덮어쓰기 X, 합치기 O)
// 예: { a1: 5 } (기존) + { b1: 4 } (신규) = { a1: 5, b1: 4 }
export const insertAnswers = async (clientid: string, newAnswers: Record<string, number>) => {
    const supabase = await getSupabaseServerClient();

    // 마이그레이션(supabase/migrations)의 save_trial_answers 함수가 있으면 DB 안에서 한 번에 병합한다.
    // → 동시 저장 시 덮어쓰기 방지 + 비로그인 사용자에게 responses 조회/수정 권한을 줄 필요가 없음
    const { error: rpcError } = await supabase.rpc('save_trial_answers', {
        p_clientid: clientid,
        p_answers: newAnswers,
    });
    if (!rpcError) return;
    if (rpcError.code !== 'PGRST202') {
        console.error('답변 저장 오류:', rpcError.message);
        throw new Error('답변 저장 오류');
    }

    // 함수가 아직 없을 때(PGRST202)의 기존 방식: 조회 후 병합 저장
    const { data: existingData, error: fetchError } = await supabase
        .from('responses')
        .select('answers')
        .eq('clientid', clientid)
        .maybeSingle();

    if (fetchError) {
        console.error('기존 데이터 조회 오류:', fetchError.message);
        throw new Error('기존 데이터 조회 오류');
    }

    const mergedAnswers = existingData?.answers ? { ...existingData.answers, ...newAnswers } : newAnswers;

    const { error } = existingData
        ? await supabase.from('responses').update({ answers: mergedAnswers }).eq('clientid', clientid)
        : await supabase.from('responses').insert([{ clientid, answers: mergedAnswers }]);

    if (error) {
        console.error('답변 저장 오류:', error.message);
        throw new Error('답변 저장 오류');
    }
};

// 2. 전체 답변 조회 (로그인한 사용자의 클라이언트로 호출)
export const getAnswers = async (supabase: SupabaseClient): Promise<AnswerData[]> => {
    const { data, error } = await supabase.from('responses').select('clientid, answers, created_at');

    if (error) {
        console.error('데이터 조회 오류:', error.message);
        throw new Error('데이터 조회 오류');
    }

    return data ?? [];
};

// 3. 특정 ID 답변 조회
export const getIdAnswers = async (supabase: SupabaseClient, clientid: string): Promise<AnswerData[]> => {
    const { data, error } = await supabase
        .from('responses')
        .select('clientid, answers, created_at')
        .eq('clientid', clientid);

    if (error) {
        console.error('데이터 조회 오류:', error.message);
        throw new Error('데이터 조회 오류');
    }

    return data ?? [];
};

// 4. 사용자 삭제
export const deleteUser = async (supabase: SupabaseClient, clientid: string): Promise<void> => {
    const { error } = await supabase.from('responses').delete().eq('clientid', clientid);

    if (error) {
        console.error('사용자 삭제 오류:', error.message);
        throw new Error('사용자 삭제 중 오류');
    }
};
