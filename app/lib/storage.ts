'use client';

import { supabase } from './supabase';

// 개인정보가 담긴 이미지(서약서, 검사 그림) 업로드/조회 헬퍼.
// - 파일 경로는 추측할 수 없도록 UUID를 쓴다.
// - DB에는 기존 데이터와의 호환을 위해 public URL 형식을 저장하지만,
//   화면에 보여줄 때는 signed URL(1시간 유효)로 바꿔서 쓴다 → 버킷을 비공개로 전환해도 그대로 동작한다.

const SIGNED_URL_TTL_SECONDS = 60 * 60;

export async function uploadImage(bucket: string, folder: string, blob: Blob) {
    const path = `${folder}/${crypto.randomUUID()}.png`;
    const { error } = await supabase.storage.from(bucket).upload(path, blob, { contentType: 'image/png' });
    if (error) return { url: null, error };

    const {
        data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: publicUrl, error: null };
}

// 저장된 public URL(또는 경로)을 signed URL로 변환. 실패하면 원래 값을 그대로 돌려준다.
export async function resolveImageUrl(bucket: string, stored: string): Promise<string> {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = stored.indexOf(marker);
    const path = index >= 0 ? decodeURIComponent(stored.slice(index + marker.length)) : stored;
    if (/^https?:\/\//.test(path)) return stored;

    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
    return error || !data ? stored : data.signedUrl;
}
