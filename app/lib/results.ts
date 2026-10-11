'use client';

import { supabase } from './supabase';

// 검사 결과 테이블은 같은 참여자가 여러 번 제출하면 행이 여러 개가 된다.
// .maybeSingle()만 쓰면 2건 이상일 때 오류가 나서 "미완료/결과 없음"으로 보이므로,
// 항상 가장 최근(id 내림차순) 1건만 가져온다.
export async function fetchLatestResult<T>(table: string, columns: string, participantId: string) {
    const { data, error } = await supabase
        .from(table)
        .select(columns)
        .eq('participant_id', participantId)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

    return { data: data as T | null, error };
}

export async function hasResult(table: string, participantId: string): Promise<boolean> {
    const { data } = await fetchLatestResult<{ id: unknown }>(table, 'id', participantId);
    return !!data;
}
