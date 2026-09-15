'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase';

type Organization = {
    id: string;
    name: string;
    website: string;
    description: string;
    logo_url: string;
};

export default function TeamMembers() {
    const [teamData, setTeamData] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const { data, error } = await supabase
                    .from('organization')
                    .select('id, name, website, description, logo_url');

                if (error) throw error;
                setTeamData(data);
            } catch (err) {
                console.error('협력 단체 목록 불러오기 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    return (
        /* 전체 배경: 오프화이트 톤 (#f8fafc) */
        <section className="py-16 bg-[#f8fafc]">
            <div className="container mx-auto px-4">
                {/* 헤더 영역 */}
                <div className="text-center mb-16">
                    <h3 className="text-3xl md:text-4xl font-black text-[#0a1f44] mb-6 tracking-tight">
                        Partners of <span className="text-blue-600">TOOL:Z</span>
                    </h3>
                    <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal break-keep text-base md:text-lg">
                        TOOL:Z는 검증된 심리 전문 기관 및 코칭 단체와 긴밀하게 협력합니다. <br />
                        더욱 정교하고 전문적인 프레임워크를 통해 신뢰할 수 있는 성장을 지원합니다.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#0a1f44]/20 border-t-[#0a1f44] rounded-full animate-spin mb-4" />
                        <p className="text-slate-400 font-medium">Partners Loading...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamData.map((org, index) => (
                            <motion.div
                                key={org.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative bg-white rounded-[2rem] p-8 flex flex-col items-center text-center border border-slate-200/80 hover:border-[#0a1f44]/30 hover:shadow-xl transition-all duration-500"
                            >
                                {/* 카드 배경 호버 효과 */}
                                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />

                                {org.logo_url ? (
                                    <div className="relative h-28 w-28 mb-6 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 p-4 transition-transform duration-500 group-hover:scale-105 shadow-inner">
                                        <Image
                                            src={org.logo_url}
                                            alt={`${org.name} 로고`}
                                            fill
                                            className="object-contain p-2"
                                            sizes="112px"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-28 w-28 flex items-center justify-center bg-slate-100 text-slate-400 rounded-3xl mb-6 font-semibold text-xs border border-slate-200">
                                        NO LOGO
                                    </div>
                                )}

                                <h4 className="text-xl font-bold text-[#0a1f44] mb-3 group-hover:text-blue-600 transition-colors">
                                    {org.name}
                                </h4>
                                
                                <p className="text-sm text-slate-500 leading-relaxed mb-8 font-normal line-clamp-3">
                                    {org.description || '전문적인 파트너십을 통해 더 나은 관점을 제공합니다.'}
                                </p>

                                {org.website ? (
                                    <a
                                        href={org.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto inline-flex items-center gap-2 text-[#0a1f44] font-bold text-sm border-b-2 border-blue-600 pb-1 hover:text-blue-600 transition-all"
                                    >
                                        Visit Website <span className="text-lg">→</span>
                                    </a>
                                ) : (
                                    <div className="mt-auto h-6" /> // 균형을 위한 빈 공간
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}