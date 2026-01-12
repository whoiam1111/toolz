'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronRight, Target, Users, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type ConsultingContent = {
    id: number;
    title: string;
    description: string;
    image_url?: string;
    created_at: string;
};

const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    whileInView: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6 }
    }
};

// -------------------------------
// 그룹 컨설팅 (Mind Point)
// -------------------------------
function MindPointPage() {
    const faqs = [
        { question: '프로그램 참여 대상은 어떻게 되나요?', answer: '20대에서 30대 초반 청년층을 대상으로 합니다. 자신을 탐구하고 성장하고 싶은 모든 분들을 환영합니다.' },
        { question: '프로그램은 언제 진행되나요?', answer: '총 3주 동안 주 2회, 총 6회 진행됩니다. 구체적인 요일과 시간은 신청 페이지에서 확인해주세요.' },
        { question: '준비물이나 사전 지식이 필요한가요?', answer: '아니요, 특별한 준비물이나 사전 지식은 필요하지 않습니다. 편안한 마음으로 참여하시면 됩니다.' },
        { question: '온라인으로 진행되나요?', answer: '모든 과정은 오프라인, 대면으로 진행 됩니다.' },
        { question: '프로그램은 어떤 방식으로 진행되나요?', answer: '소규모 그룹으로 진행되며, 각 회차별 주제에 맞춰 개인적인 성찰과 그룹 내 공유를 통해 함께 성장하는 방식입니다.' },
    ];

    const expectations = [
        '정체성 혼란 극복 → {"\"나는 누구인가?\""}에 대한 답을 찾아갑니다.',
        '가치 명료화 → 나만의 핵심 가치와 삶의 우선순위를 세웁니다.',
        '삶의 의미와 소명 발견 → {"‘내가 존재하는 이유’"}를 성찰합니다.',
        '나만의 서사 구축 → 나의 이야기를 서사로 정리하고 미래를 설계합니다.',
        '지속 가능한 성장을 위한 발판 마련 → 이후에도 스스로 성장할 수 있는 토대를 마련합니다.',
    ];

    const recommend = [
        '{"\"나는 누구인가?\""}라는 질문을 하고 계신 분',
        '진로, 가치, 인간관계 속에서 방향성을 잃었다고 느끼는 분',
        '미래에 대한 불안감과 내면의 혼란을 느끼는 분',
        '일시적 동기부여가 아닌 지속 가능한 성장 기반을 찾고 싶은 분',
        '자기 성찰을 넘어 진정한 자기 실현을 꿈꾸는 분',
    ];

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="text-white">
            {/* Hero Section */}
            <section className="py-12 md:py-20 bg-[#151515] rounded-[3rem] border border-white/5 overflow-hidden relative mb-12">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="flex justify-center md:justify-end">
                        {/* ✅ 포스터 사이즈 축소: max-w-[280px] 로 조정 */}
                        <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                            <Image 
                                src="/poster.jpg" 
                                alt="MIND POINT" 
                                fill
                                sizes="280px"
                                className="object-contain"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="text-center md:text-left space-y-5">
                        <span className="inline-block px-4 py-1 bg-orange-500/10 text-orange-500 text-xs font-bold rounded-full tracking-widest uppercase">2025 Youth Program</span>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">MIND <span className="text-orange-500">POINT</span></h1>
                        <p className="text-gray-400 text-lg font-light break-keep italic">{"\"당신의 마음이 머무는 지점, 삶의 의미가 시작되는 좌표.\""}</p>
                        <div className="pt-2">
                            <Link href="https://www.latpeed.com/products/DOKgG" className="inline-flex items-center px-10 py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-500 transition-all">신청하기 <ChevronRight size={20} className="ml-2" /></Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 나머지 섹션 생략 (디자인 동일) */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-12 justify-center font-black text-4xl">
                        <Target className="text-orange-500" size={32} />
                        <h2>기대 효과</h2>
                    </div>
                    <ul className="grid gap-4">
                        {expectations.map((item, i) => (
                            <motion.li key={i} variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 text-gray-300 font-light italic">{item}</motion.li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="py-20 bg-[#0a0a0a] -mx-4 px-4 rounded-[4rem] mb-12">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-12 justify-center font-black text-4xl">
                        <Users className="text-orange-500" size={32} />
                        <h2>추천 대상</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommend.map((r, i) => (
                            <motion.div key={i} variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#151515] border border-white/5 rounded-3xl p-8 text-gray-400 font-light leading-relaxed">{r}</motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 pb-32">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="flex items-center gap-4 mb-12 justify-center font-black text-4xl">
                        <HelpCircle className="text-orange-500" size={32} />
                        <h2>자주 묻는 질문</h2>
                    </div>
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-b border-white/10 mb-2">
                            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center py-6 text-left group">
                                <span className={`font-bold transition-colors ${openFaq === i ? 'text-orange-500' : 'text-gray-300 group-hover:text-white'}`}>{faq.question}</span>
                                <ChevronRight className={`transition-transform text-orange-600 ${openFaq === i ? 'rotate-90' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pb-6 text-gray-400 text-left font-light leading-relaxed">{faq.answer}</motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// -------------------------------
// 개별 컨설팅 (Contents)
// -------------------------------
function Contents() {
    const [contents, setContents] = useState<ConsultingContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState<number | null>(null);

    useEffect(() => {
        const fetchContents = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('contents').select('*').order('created_at', { ascending: false });
            if (!error && data) setContents(data as ConsultingContent[]);
            setLoading(false);
        };
        fetchContents();
    }, []);

    return (
        <div className="max-w-4xl mx-auto pb-32">
            <motion.h2 variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="text-5xl font-black text-center text-white mb-4 tracking-tighter">Individual <span className="text-orange-500">Consulting</span></motion.h2>
            <p className="text-center text-gray-500 font-light mb-16">당신에게 최적화된 맞춤형 프레임워크를 설계합니다.</p>

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" /></div>
            ) : (
                <div className="space-y-6">
                    {contents.map((content) => (
                        <div key={content.id} className="bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden hover:border-orange-500/30 transition-all shadow-2xl">
                            <button onClick={() => setOpenId(openId === content.id ? null : content.id)} className="w-full flex justify-between items-center p-8 text-left group">
                                <h4 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">{content.title}</h4>
                                <ChevronRight className={`transition-transform text-orange-600 ${openId === content.id ? 'rotate-90' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openId === content.id && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-8 pt-0 border-t border-white/5 bg-black/20">
                                        {content.image_url && (
                                            /* ✅ 개별 컨설팅 이미지 사이즈 축소: max-w-[500px] 및 mx-auto 적용 */
                                            <div className="relative w-full max-w-[500px] mx-auto aspect-video rounded-2xl overflow-hidden mb-6 mt-4 shadow-lg border border-white/10">
                                                <Image 
                                                    src={content.image_url} 
                                                    alt={content.title} 
                                                    fill 
                                                    sizes="(max-width: 500px) 100vw, 500px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="max-w-2xl mx-auto text-center md:text-left">
                                            <p className="text-gray-400 leading-relaxed font-light whitespace-pre-wrap py-2">{content.description}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// 상단 ConsultingTabs 컴포넌트는 이전과 동일
export default function ConsultingTabs() {
    const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');

    return (
        <div className="min-h-screen bg-[#0f0f0f] py-32 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-center gap-3 mb-24">
                    <button onClick={() => setActiveTab('personal')} className={`px-10 py-4 rounded-2xl font-bold transition-all duration-300 text-sm tracking-widest ${activeTab === 'personal' ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 scale-105' : 'bg-[#1a1a1a] text-gray-500 border border-white/5'}`}>개별 컨설팅</button>
                    <button onClick={() => setActiveTab('group')} className={`px-10 py-4 rounded-2xl font-bold transition-all duration-300 text-sm tracking-widest ${activeTab === 'group' ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 scale-105' : 'bg-[#1a1a1a] text-gray-500 border border-white/5'}`}>그룹 컨설팅</button>
                </div>
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                        {activeTab === 'personal' ? <Contents /> : <MindPointPage />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}