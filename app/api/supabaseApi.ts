import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export const getSession = async () => {
    try {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error) {
            console.warn('세션 읽기 실패 (만료된 토큰):', error.message);
            localStorage.removeItem('login_time');
            return null;
        }

        if (session && session.expires_at) {
            const isExpired = session.expires_at * 1000 < Date.now();
            if (isExpired) {
                console.warn('토큰 유효기간 만료됨');
                await supabase.auth.signOut();
                localStorage.removeItem('login_time');
                return null;
            }
        }

        return session;
    } catch (e) {
        console.error('Session error:', e);
        return null;
    }
};

export const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
    return await supabase.auth.signOut();
};

export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
};

export const saveCoreEmotionTest = async (participantId: string, answers: Record<number, string[]>) => {
    return await supabase.from('core_emotion_tests').insert([
        {
            participant_id: participantId,
            answers,
            created_at: new Date().toISOString(),
        },
    ]);
};

export const savePersonalityTest = async (participantId: string, answers: Record<string, number>) => {
    return await supabase.from('personality_tests').insert([
        {
            participant_id: participantId,
            answers,
        },
    ]);
};

export const savePersonalityTest2 = async (participantId: string, answers: Record<string, number>) => {
    return await supabase.from('personality_tests2').insert([
        {
            participant_id: participantId,
            answers,
        },
    ]);
};

export const saveAttachmentTest = async (participantId: string, answers: Record<string, number>) => {
    return await supabase.from('attachment_tests').insert([
        {
            participant_id: participantId,
            answers,
        },
    ]);
};

export const getParticipants = async () => {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error('유저 정보 오류:', userError);
        return { data: [], error: userError };
    }

    const { data, error } = await supabase
        .from('participant')
        .select('*')
        .eq('counselors', user.id)
        .order('created_at', { ascending: false });

    return { data, error };
};

// 🔹 [추가됨] ID 기반 단일 참여자 상세 조회
export const getParticipantById = async (id: string) => {
    const { data, error } = await supabase
        .from('participant')
        .select('*')
        .eq('id', id)
        .single();

    return { data, error };
};

export const addNewParticipant = async (participant: {
    name: string;
    birth_date: string;
    stress: string;
    religion: string;
    signatureurl: string;
    counselorId: string;
}) => {
    const { counselorId, ...rest } = participant;

    const { data, error } = await supabase
        .from('participant')
        .insert([{ ...rest, counselors: counselorId }])
        .select();

    return { data, error };
};

// 🔹 [추가됨] 참여자 정보 수정
export const updateParticipant = async (
    id: string,
    updateData: Partial<{
        name: string;
        birth_date: string;
        stress: string;
        religion: string;
    }>
) => {
    const { data, error } = await supabase
        .from('participant')
        .update(updateData)
        .eq('id', id)
        .select();

    return { data, error };
};

export async function getCoreEmotionTestResult(participantId: string) {
    const { data, error } = await supabase
        .from('core_emotion_tests')
        .select('*')
        .eq('participant_id', participantId)
        .limit(1)
        .single();
    if (error && error.code === 'PGRST116') {
        return { data: null, error: null };
    }
    return { data, error };
}

export const createCounselorAccount = async (email: string, password: string, name: string, region: string) => {
    const res = await fetch('/api/create-counselor', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, region }),
    });

    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || '상담사 생성 실패');
    }
    return result;
};

export const uploadSignature = async (dataUrl: string, fileName: string) => {
    const blob = await (await fetch(dataUrl)).blob();

    const filePath = `signatures/${fileName}`;
    const { error } = await supabase.storage.from('signatures').upload(filePath, blob, {
        contentType: 'image/png',
    });

    if (error) {
        return { url: null, error };
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from('signatures').getPublicUrl(filePath);

    return { url: publicUrl, error: null };
};

export async function deleteParticipant(id: string) {
    return await supabase.from('participant').delete().eq('id', id);
}