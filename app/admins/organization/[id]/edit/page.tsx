'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import OrganizationForm, { type Organization } from '../../OrganizationForm';

export default function EditOrganizationPage() {
    const id = useParams()?.id as string;
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        supabase
            .from('organization')
            .select('*')
            .eq('id', id)
            .maybeSingle()
            .then(({ data, error }) => {
                if (error) setError(`불러오기 오류: ${error.message}`);
                else if (!data) setError('단체를 찾을 수 없습니다.');
                else setOrganization(data);
            });
    }, [id]);

    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!organization) return <p className="text-center mt-10 text-gray-600">불러오는 중...</p>;

    return <OrganizationForm initial={organization} />;
}
