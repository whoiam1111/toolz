'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export type Organization = {
    id: number;
    name: string;
    website: string | null;
    description: string | null;
    logo_url: string | null;
};

// 단체 생성/수정 공용 폼. initial이 있으면 수정 모드
export default function OrganizationForm({ initial }: { initial?: Organization }) {
    const router = useRouter();

    const [name, setName] = useState(initial?.name ?? '');
    const [website, setWebsite] = useState(initial?.website ?? '');
    const [description, setDescription] = useState(initial?.description ?? '');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // 새 로고를 선택하지 않으면 기존 로고 유지
            let logoUrl = initial?.logo_url ?? null;

            if (logoFile) {
                const fileExt = logoFile.name.split('.').pop();
                const filePath = `organization-logos/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage.from('organization-logos').upload(filePath, logoFile);
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('organization-logos').getPublicUrl(filePath);
                logoUrl = data?.publicUrl || null;
            }

            const values = { name, website, description, logo_url: logoUrl };
            const { error: saveError } = initial
                ? await supabase.from('organization').update(values).eq('id', initial.id)
                : await supabase.from('organization').insert(values);

            if (saveError) throw saveError;

            router.push('/admins/organization');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <h1 className="text-2xl font-bold mb-6">{initial ? '단체 수정' : '단체 생성'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">단체명</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">홈페이지 주소</label>
                    <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">간단 설명</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        메인 로고{initial?.logo_url && ' (선택하지 않으면 기존 로고 유지)'}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                        className="w-full"
                    />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-neutral-800 text-white py-2 px-4 rounded hover:bg-neutral-700 transition"
                >
                    {isSubmitting ? '저장 중...' : initial ? '저장' : '생성'}
                </button>
            </form>
        </div>
    );
}
