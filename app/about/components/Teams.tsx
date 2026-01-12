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
        <section className="py-12 bg-[#0f0f0f]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter">
                        Partners of <span className="text-orange-500">TOOL:Z</span>
                    </h3>
                    <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed font-light break-keep">
                        TOOL:Z는 검증된 심리 전문 기관 및 코칭 단체와 긴밀하게 협력합니다. <br />
                        더욱 정교하고 전문적인 프레임워크를 통해 신뢰할 수 있는 성장을 지원합니다.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Partners Loading...</p>
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
                                className="group relative bg-[#151515] rounded-[2rem] p-8 flex flex-col items-center text-center border border-white/5 hover:border-orange-500/40 transition-all duration-500"
                            >
                                {/* 카드 배경 빛 효과 */}
                                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />

                                {org.logo_url ? (
                                    <div className="relative h-28 w-28 mb-6 rounded-3xl overflow-hidden bg-white/10 p-4 transition-transform duration-500 group-hover:scale-110">
                                        <Image
                                            src={org.logo_url}
                                            alt={`${org.name} 로고`}
                                            fill
                                            className="object-contain p-2"
                                            sizes="112px"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-28 w-28 flex items-center justify-center bg-white/5 text-gray-500 rounded-3xl mb-6 font-semibold text-xs border border-white/10">
                                        NO LOGO
                                    </div>
                                )}

                                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                                    {org.name}
                                </h4>
                                
                                <p className="text-sm text-gray-400 leading-relaxed mb-8 font-light line-clamp-3">
                                    {org.description || '전문적인 파트너십을 통해 더 나은 관점을 제공합니다.'}
                                </p>

                                {org.website ? (
                                    <a
                                        href={org.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto inline-flex items-center gap-2 text-white font-bold text-sm border-b border-orange-500 pb-1 hover:text-orange-500 transition-all"
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