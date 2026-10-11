'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchLatestResult } from '@/app/lib/results';
import { resolveImageUrl } from '@/app/lib/storage';

type Props = {
    table: string; // 결과 테이블 (participant_id, image_url)
    bucket: string; // 이미지가 저장된 Storage 버킷
    title: string;
    aspectClass: string; // 예: 'aspect-[1/1.414]'
};

// 그림형 검사(6도형, 4도형, 인생그래프) 결과 보기
export default function DrawingResult({ table, bucket, title, aspectClass }: Props) {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const id = params?.id as string;
        if (!id) return;

        const fetchResult = async () => {
            try {
                const { data, error } = await fetchLatestResult<{ image_url: string | null }>(table, 'image_url', id);
                if (error) throw error;
                if (!data) {
                    setError('검사 결과가 없습니다.');
                    return;
                }
                setImageUrl(data.image_url ? await resolveImageUrl(bucket, data.image_url) : null);
            } catch (err) {
                console.error(err);
                setError('결과를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [params, table, bucket]);

    if (loading) return <p className="text-center mt-10 text-gray-600">⏳ 결과 불러오는 중...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-10 bg-white rounded-3xl shadow-lg space-y-10">
            <h1 className="text-4xl font-extrabold text-center text-indigo-700">{title}</h1>

            {imageUrl ? (
                <div className="w-full flex justify-center">
                    <div
                        className={`relative w-full ${aspectClass} max-w-5xl bg-gray-50 rounded-2xl border border-indigo-200 shadow-xl overflow-hidden`}
                    >
                        <Image src={imageUrl} alt={title} fill className="object-contain" priority />
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-400 italic">이미지 결과가 없습니다.</p>
            )}

            <div className="text-center">
                <button
                    onClick={() => router.back()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition duration-300"
                >
                    돌아가기
                </button>
            </div>
        </div>
    );
}
