'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronRight, Target, Users, HelpCircle, Sparkles, User, Users2 } from 'lucide-react';
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
        transition: { duration: 0.5 }
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
        '정체성 혼란 극복 → "나는 누구인가?"에 대한 답을 찾아갑니다.',
        '가치 명료화 → 나만의 핵심 가치와 삶의 우선순위를 세웁니다.',
        '삶의 의미와 소명 발견 → ‘내가 존재하는 이유’를 성찰합니다.',
        '나만의 서사 구축 → 나의 이야기를 서사로 정리하고 미래를 설계합니다.',
        '지속 가능한 성장을 위한 발판 마련 → 이후에도 스스로 성장할 수 있는 토대를 마련합니다.',
    ];

    const recommend = [
        '"나는 누구인가?"라는 질문을 하고 계신 분',
        '진로, 가치, 인간관계 속에서 방향성을 잃었다고 느끼는 분',
        '미래에 대한 불안감과 내면의 혼란을 느끼는 분',
        '일시적 동기부여가 아닌 지속 가능한 성장 기반을 찾고 싶은 분',
        '자기 성찰을 넘어 진정한 자기 실현을 꿈꾸는 분',
    ];

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#0a1f44] to-[#16356d] text-white rounded-3xl p-8 md:p-12 border border-slate-200/20 shadow-xl overflow-hidden relative">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center relative z-10">
                    <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="flex justify-center md:justify-end">
                        <div className="relative w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900">
                            <Image 
                                src="/poster.jpg" 
                                alt="MIND POINT" 
                                fill
                                sizes="260px"
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="text-center md:text-left space-y-5">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold rounded-full tracking-widest uppercase">
                            <Sparkles size={13} /> 2025 Youth Program
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                            MIND <span className="text-blue-400">POINT</span>
                        </h1>
                        <p className="text-slate-200 text-base font-medium break-keep italic opacity-90">
                            {'"당신의 마음이 머무는 지점, 삶의 의미가 시작되는 좌표."'}
                        </p>
                        <div className="pt-2">
                            <Link 
                                href="https://www.latpeed.com/products/DOKgG" 
                                className="inline-flex items-center px-8 py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/30 active:scale-95"
                            >
                                신청하기 <ChevronRight size={18} className="ml-1.5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 기대 효과 */}
            <section className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-2.5 justify-center text-[#0a1f44]">
                    <Target className="text-blue-600" size={26} />
                    <h2 className="text-2xl font-black tracking-tight">기대 효과</h2>
                </div>
                <ul className="grid gap-3.5 max-w-3xl mx-auto">
                    {expectations.map((item, i) => (
                        <motion.li 
                            key={i} 
                            variants={fadeInUp} 
                            initial="initial" 
                            whileInView="whileInView" 
                            viewport={{ once: true }} 
                            transition={{ delay: i * 0.05 }} 
                            className="bg-slate-50/80 border border-slate-200/70 p-4 md:p-5 rounded-2xl text-slate-700 font-semibold text-sm leading-relaxed flex items-start gap-3"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                            <span>{item}</span>
                        </motion.li>
                    ))}
                </ul>
            </section>

            {/* 추천 대상 */}
            <section className="bg-slate-50/70 rounded-3xl border border-slate-200/80 p-8 md:p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-2.5 justify-center text-[#0a1f44]">
                    <Users className="text-blue-600" size={26} />
                    <h2 className="text-2xl font-black tracking-tight">추천 대상</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {recommend.map((r, i) => (
                        <motion.div 
                            key={i} 
                            variants={fadeInUp} 
                            initial="initial" 
                            whileInView="whileInView" 
                            viewport={{ once: true }} 
                            transition={{ delay: i * 0.05 }} 
                            className="bg-white border border-slate-200/80 rounded-2xl p-6 text-slate-700 text-xs font-semibold leading-relaxed shadow-sm hover:border-blue-300 transition-colors flex items-center"
                        >
                            {r}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 자주 묻는 질문 */}
            <section className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-2.5 justify-center text-[#0a1f44]">
                    <HelpCircle className="text-blue-600" size={26} />
                    <h2 className="text-2xl font-black tracking-tight">자주 묻는 질문</h2>
                </div>
                <div className="max-w-3xl mx-auto space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all bg-white">
                            <button 
                                onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                                className="w-full flex justify-between items-center p-5 text-left font-bold text-sm text-[#0a1f44] hover:bg-slate-50 transition-colors"
                            >
                                <span>{faq.question}</span>
                                <ChevronRight className={`transition-transform text-slate-400 shrink-0 ${openFaq === i ? 'rotate-90 text-blue-600' : ''}`} size={18} />
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        exit={{ opacity: 0, height: 0 }} 
                                        className="px-5 pb-5 text-slate-500 text-xs font-medium leading-relaxed border-t border-slate-100 bg-slate-50/50 pt-3"
                                    >
                                        {faq.answer}
                                    </motion.div>
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
        <div className="space-y-6">
            <div className="text-center space-y-2 pb-2">
                <h2 className="text-3xl font-black text-[#0a1f44] tracking-tight">
                    Individual <span className="text-blue-600">Consulting</span>
                </h2>
                <p className="text-xs font-medium text-slate-400">
                    개인의 목표와 상황에 최적화된 맞춤형 성장 프레임워크를 설계합니다.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : contents.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 text-xs font-medium">
                    등록된 개별 컨설팅 정보가 없습니다.
                </div>
            ) : (
                <div className="space-y-4">
                    {contents.map((content) => (
                        <div 
                            key={content.id} 
                            className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all"
                        >
                            <button 
                                onClick={() => setOpenId(openId === content.id ? null : content.id)} 
                                className="w-full flex justify-between items-center p-6 text-left group"
                            >
                                <h3 className="text-base font-bold text-[#0a1f44] group-hover:text-blue-600 transition-colors">
                                    {content.title}
                                </h3>
                                <ChevronRight className={`transition-transform text-slate-400 shrink-0 group-hover:text-blue-600 ${openId === content.id ? 'rotate-90 text-blue-600' : ''}`} size={18} />
                            </button>
                            <AnimatePresence>
                                {openId === content.id && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        exit={{ opacity: 0, height: 0 }} 
                                        className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50"
                                    >
                                        {content.image_url && (
                                            <div className="relative w-full max-w-[460px] mx-auto aspect-video rounded-xl overflow-hidden my-4 shadow-sm border border-slate-200">
                                                <Image 
                                                    src={content.image_url} 
                                                    alt={content.title} 
                                                    fill 
                                                    sizes="(max-width: 460px) 100vw, 460px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="max-w-2xl mx-auto">
                                            <p className="text-slate-600 leading-relaxed font-medium text-xs whitespace-pre-wrap py-2">
                                                {content.description}
                                            </p>
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

export default function ConsultingTabs() {
    const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');

    return (
        <div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-10 space-y-8">
                {/* 메인 탭 스위처 */}
                <div className="flex justify-center">
                    <div className="bg-slate-100/80 p-1.5 rounded-2xl inline-flex gap-1 border border-slate-200/60">
                        <button 
                            onClick={() => setActiveTab('personal')} 
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                                activeTab === 'personal' 
                                    ? 'bg-[#0a1f44] text-white shadow-md shadow-[#0a1f44]/10' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <User size={15} />
                            <span>개별 컨설팅</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('group')} 
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                                activeTab === 'group' 
                                    ? 'bg-[#0a1f44] text-white shadow-md shadow-[#0a1f44]/10' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Users2 size={15} />
                            <span>그룹 컨설팅</span>
                        </button>
                    </div>
                </div>

                {/* 탭 콘텐츠 영역 */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeTab} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }} 
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'personal' ? <Contents /> : <MindPointPage />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}