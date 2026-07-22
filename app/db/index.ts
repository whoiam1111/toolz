import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

interface AnswerData {
    clientid: string;
    answers: Record<string, number>;
    created_at: string;
}

interface StampData {
    clientid: string;
    firststamp: boolean;
    secondstamp: boolean;
    thirdstamp: boolean;
    laststamp: boolean;
}

// 💡 헬퍼 함수: Next.js 15 비동기 cookies() 기반 Supabase Server Client 생성기
export async function getSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
                try {
                    cookieStore.set({ name, value, ...options });
                } catch (error) {
                    // Server Component 등 읽기 전용 환경에서 발생하는 에러 무시
                }
            },
            remove(name: string, options: any) {
                try {
                    cookieStore.set({ name, value: '', ...options });
                } catch (error) {
                    // Server Component 등 읽기 전용 환경에서 발생하는 에러 무시
                }
            },
        },
    });
}

// 1. 답변 저장
// export const insertAnswers = async (clientid: string, answers: Record<string, number>) => {
//     const supabase = await getSupabaseServerClient();

//     const { error } = await supabase.from('responses').insert([{ clientid, answers }]);

//     if (error) {
//         console.error('Error inserting data:', error.message);
//         throw new Error('답변 저장 오류');
//     }
// };
export const insertAnswers = async (clientid: string, newAnswers: Record<string, number>) => {
    const supabase = await getSupabaseServerClient();

    // 1️⃣ 기존에 저장된 유저의 답변이 있는지 확인
    const { data: existingData, error: fetchError } = await supabase
        .from('responses')
        .select('answers')
        .eq('clientid', clientid)
        .maybeSingle(); // 에러 없이 0건이거나 1건의 데이터를 반환

    if (fetchError) {
        console.error('기존 데이터 조회 오류:', fetchError.message);
        throw new Error('기존 데이터 조회 오류');
    }

    // 2️⃣ 기존 답변이 있으면 새로운 답변과 병합 (덮어쓰기 X, 합치기 O)
    // 예: { a1: 5 } (기존) + { b1: 4 } (신규) = { a1: 5, b1: 4 } (병합)
    const mergedAnswers =
        existingData && existingData.answers ? { ...existingData.answers, ...newAnswers } : newAnswers;

    // 3️⃣ 병합된 데이터로 DB 업데이트 또는 삽입
    if (existingData) {
        // 이미 존재하는 유저면 업데이트 (Update)
        const { error: updateError } = await supabase
            .from('responses')
            .update({ answers: mergedAnswers })
            .eq('clientid', clientid);

        if (updateError) {
            console.error('답변 업데이트 오류:', updateError.message);
            throw new Error('답변 업데이트 오류');
        }
    } else {
        // 처음 하는 유저면 삽입 (Insert)
        const { error: insertError } = await supabase.from('responses').insert([{ clientid, answers: mergedAnswers }]);

        if (insertError) {
            console.error('답변 삽입 오류:', insertError.message);
            throw new Error('답변 삽입 오류');
        }
    }
};
// 2. 전체 답변 조회
export const getAnswers = async (): Promise<AnswerData[] | null> => {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase.from('responses').select('clientid, answers, created_at');

    if (error) {
        console.error('데이터 조회 오류:', error.message);
        throw new Error('데이터 조회 오류');
    }

    return data ?? null;
};

// 3. 특정 ID 답변 조회
export const getIdAnswers = async (clientid: string) => {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from('responses')
        .select('clientid, answers, created_at')
        .eq('clientid', clientid);

    if (error) {
        console.error('데이터 조회 오류:', error.message);
        throw new Error('데이터 조회 오류');
    }

    return data ?? null;
};

// 4. 사용자 삭제
export const deleteUser = async (clientid: string): Promise<void> => {
    const supabase = await getSupabaseServerClient();

    const { error } = await supabase.from('responses').delete().eq('clientid', clientid);

    if (error) {
        console.error('사용자 삭제 오류:', error.message);
        throw new Error('사용자 삭제 중 오류');
    }
};

// 5. 도장(stamp) 업데이트
export const updateStamp = async (
    clientid: string,
    stampType: 'firststamp' | 'secondstamp' | 'thirdstamp' | 'laststamp'
): Promise<void> => {
    const supabase = await getSupabaseServerClient();

    const { error } = await supabase
        .from('responses')
        .update({ [stampType]: true })
        .eq('clientid', clientid);

    if (error) {
        console.error('도장 업데이트 오류:', error.message);
        throw new Error('도장 업데이트 오류');
    }
};

// 6. 도장 상태 조회
export const getIdStamp = async (clientid: string): Promise<StampData | null> => {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from('responses')
        .select('clientid, firststamp, secondstamp, thirdstamp, laststamp')
        .eq('clientid', clientid)
        .single();

    if (error) {
        console.error('도장 조회 오류:', error.message);
        return null;
    }

    return data;
};
