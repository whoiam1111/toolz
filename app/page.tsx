'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Library, Users, Target, ArrowRight, X, LucideIcon } from 'lucide-react';

import { useRouter } from 'next/navigation';
// 기존 컴포넌트 임포트
import MainClassSlider from './MainClassSlider';
import Brandintro from './Brandintro';
import MainStatistics from './MainStatistics';

// --- 애니메이션 설정 ---
const fadeInUp: Variants = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
    initial: {},
    whileInView: {
        transition: { staggerChildren: 0.2 },
    },
};

interface FeatureItem {
    icon: LucideIcon;
    title: string;
    desc: string;
}

const whyNrpItems: FeatureItem[] = [
    { icon: Library, title: '고품질 콘텐츠', desc: '분야별 최고 전문가들이 설계한 체계적인 커리큘럼을 제공합니다.' },
    { icon: Users, title: '성장 커뮤니티', desc: '서로의 관점을 공유하며 함께 성장하는 동료들을 만날 수 있습니다.' },
    { icon: Target, title: '개인별 로드맵', desc: '데이터 진단을 통해 당신에게 꼭 필요한 성장 단계를 제시합니다.' },
];

export default function Home() {
    const [isMindpointPopupVisible, setIsMindpointPopupVisible] = useState(false);
    const [isSurveyPopupVisible, setIsSurveyPopupVisible] = useState(false);
    const [isAnimatingMindpoint, setIsAnimatingMindpoint] = useState(false);
    const [isAnimatingSurvey, setIsAnimatingSurvey] = useState(false);

    useEffect(() => {
        const now = new Date().getTime();
        const mpExpire = localStorage.getItem('dontShowMindpointUntil');
        if (!mpExpire || now > parseInt(mpExpire, 10)) {
            setTimeout(() => {
                setIsMindpointPopupVisible(true);
                requestAnimationFrame(() => setIsAnimatingMindpoint(true));
            }, 500);
        }
        const surveyExpire = localStorage.getItem('dontShowSurveyUntil');
        if (!surveyExpire || now > parseInt(surveyExpire, 10)) {
            setTimeout(() => {
                setIsSurveyPopupVisible(true);
                requestAnimationFrame(() => setIsAnimatingSurvey(true));
            }, 800);
        }
    }, []);

    const closeMindpointPopup = () => {
        setIsAnimatingMindpoint(false);
        setTimeout(() => setIsMindpointPopupVisible(false), 300);
    };

    const closeSurveyPopup = () => {
        setIsAnimatingSurvey(false);
        setTimeout(() => setIsSurveyPopupVisible(false), 300);
    };

    const dontShowMindpointToday = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        localStorage.setItem('dontShowMindpointUntil', tomorrow.getTime().toString());
        closeMindpointPopup();
    };

    const dontShowSurveyToday = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        localStorage.setItem('dontShowSurveyUntil', tomorrow.getTime().toString());
        closeSurveyPopup();
    };
    const router = useRouter();
    return (
        <div className="bg-[#0f0f0f] text-white selection:bg-orange-500 selection:text-white overflow-x-hidden antialiased font-sans">
            {/* --- 팝업 섹션 --- */}
            {/* {isMindpointPopupVisible && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className={`relative w-full max-sm:max-w-xs max-w-sm bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ${isAnimatingMindpoint ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="relative aspect-[4/5] w-full">
                            <Image src="/MINDPOINT.jpg" alt="마인드포인트" fill className="object-cover" sizes="400px" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
                        </div>
                        <button onClick={closeMindpointPopup} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-white/10 rounded-full text-white"><X size={20}/></button>
                        <div className="p-8 text-center">
                            <Link href="/content" className="w-full block bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-500 transition">마인드포인트 알아보기</Link>
                            <button onClick={dontShowMindpointToday} className="text-gray-500 text-xs mt-4 hover:text-gray-300 underline">오늘 하루 보지 않기</button>
                        </div>
                    </div>
                </div>
            )}

            {isSurveyPopupVisible && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className={`relative w-full max-sm:max-w-xs max-w-sm bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ${isAnimatingSurvey ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="relative aspect-video w-full">
                            <Image src="/stress.jpg" alt="설문조사" fill className="object-cover" sizes="400px" />
                        </div>
                        <button onClick={closeSurveyPopup} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-white/10 rounded-full text-white"><X size={20}/></button>
                        <div className="p-8 text-center">
                            <h3 className="text-xl font-bold mb-2">스트레스 서베이 참여</h3>
                            <p className="text-gray-400 text-sm mb-6 font-light">당신의 이야기가 더 나은 내일을 만듭니다.</p>
                            <a href="https://smore.im/form/rbUBfNZ71d" target="_blank" rel="noopener noreferrer" className="w-full block bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition">설문 참여하기</a>
                            <button onClick={dontShowSurveyToday} className="text-gray-500 text-xs mt-4 hover:text-gray-300 underline">오늘 하루 보지 않기</button>
                        </div>
                    </div>
                </div>
            )} */}

            {/* --- Hero Section --- */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-60" />
                <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="space-y-8"
                    >
                        {/* 문구 수정: font-serif를 지우고 일반 볼드 고딕으로 변경 */}
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]">
                            관점을 바꾸는 <br />
                            <span className="text-orange-500">한 줄기 빛</span>
                        </h1>
                        <p className="text-xl text-gray-400 font-normal leading-relaxed break-keep max-w-lg">
                            단순한 교육을 넘어 당신의 삶을 바라보는 <br className="hidden md:block" /> 도구를
                            제공합니다. 지금 TOOL:Z와 시작하세요.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-orange-600 hover:bg-orange-500 rounded-2xl font-bold transition-all shadow-xl shadow-orange-600/20 group text-lg"
                            >
                                시작하기{' '}
                                <ArrowRight
                                    size={22}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative group flex justify-center lg:justify-end"
                    >
                        <div className="relative w-full max-w-[480px] bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                            <Image
                                src="/orangeB.jpg"
                                alt="Main Visual"
                                width={500}
                                height={700}
                                className="w-full h-auto object-cover opacity-90"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <Brandintro />
            <MainStatistics />
            <section className="py-24 bg-[#0f0f0f]">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">당신을 먼저 알아보세요</h2>
                    <p className="text-gray-400 mb-16 text-lg">단 1분, 당신의 상태를 빠르게 진단해드립니다</p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* 1. 도파민 중독 스캔 */}
                        <div
                            onClick={() => router.push('/minitest/DopamineTest')}
                            className="cursor-pointer rounded-[2.5rem] bg-[#151515] border border-white/5 hover:border-pink-500/50 transition-all duration-500 group overflow-hidden shadow-2xl hover:shadow-pink-500/20"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src="/dopamine-thumb.jpg"
                                    alt="Dopamine Scan"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent" />
                                {/* 네온 포인트 라인 */}
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
                            </div>
                            <div className="p-8">
                                <h3 className="font-bold text-xl mb-2 text-white group-hover:text-pink-500 transition-colors">
                                    도파민 중독 스캔
                                </h3>
                                <p className="text-sm text-gray-500">뇌의 자극 의존도 정밀 체크</p>
                            </div>
                        </div>

                        {/* 2. 페르소나 지수 */}
                        <div
                            onClick={() => router.push('/minitest/PersonaTest')}
                            className="cursor-pointer rounded-[2.5rem] bg-[#151515] border border-white/5 hover:border-blue-400/50 transition-all duration-500 group overflow-hidden shadow-2xl hover:shadow-blue-400/20"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src="/persona-thumb.jpg"
                                    alt="Persona Test"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent" />
                                {/* 네온 포인트 라인 */}
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
                            </div>
                            <div className="p-8">
                                <h3 className="font-bold text-xl mb-2 text-white group-hover:text-blue-400 transition-colors">
                                    유행 민감도 테스트
                                </h3>
                                <p className="text-sm text-gray-500">나는 얼마나 유행을 따라갈까</p>
                            </div>
                        </div>

                        {/* 3. 전체 테스트 보기 */}
                        <div
                            onClick={() => router.push('/minitest')}
                            className="cursor-pointer rounded-[2.5rem] bg-orange-600 transition-all duration-500 group overflow-hidden shadow-2xl hover:shadow-orange-600/40 hover:-translate-y-2"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src="/all.png"
                                    alt="View All"
                                    className="w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-8 text-white">
                                <h3 className="font-bold text-xl mb-2">전체 테스트 보기</h3>
                                <p className="text-sm opacity-80">나를 찾는 모든 여정 탐색</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="py-20">
                <MainClassSlider />
            </div>

            {/* --- Why NRP Section --- */}
            <section className="py-32 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6"
                    >
                        <div className="text-left">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">WHY TOOL:Z?</h2>
                            <p className="text-gray-500 font-medium text-lg">
                                성장을 위한 가장 완벽한 생태계를 제공합니다.
                            </p>
                        </div>
                        <div className="h-px flex-1 bg-white/10 mx-8 hidden md:block mb-6"></div>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {whyNrpItems.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    transition={{ duration: 0.6 }}
                                    className="p-10 bg-[#151515] border border-white/5 rounded-[2rem] group hover:border-orange-500/30 transition-all shadow-lg"
                                >
                                    <div className="mb-8 p-4 bg-orange-500/10 inline-block rounded-2xl group-hover:bg-orange-500 transition-all">
                                        <Icon
                                            size={32}
                                            className="text-orange-500 group-hover:text-white transition-colors"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 tracking-tight">{item.title}</h3>
                                    <p className="text-gray-400 font-normal leading-relaxed break-keep">{item.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* --- Final CTA Section --- */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative py-40 overflow-hidden bg-orange-600 text-center"
            >
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="/back.jpg"
                        alt="Background"
                        fill
                        className="object-cover"
                        sizes="100vw"
                    />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white">
                        망설일 이유가 없습니다.
                    </h2>
                    <p className="text-orange-50 text-xl mb-12 font-medium">
                        지금 바로 시작하고 당신의 잠재력을 깨워보세요.
                    </p>
                    <Link
                        href="/subscribe"
                        className="inline-flex items-center gap-3 bg-black text-white px-12 py-6 rounded-2xl text-xl font-bold hover:bg-zinc-900 transition-all shadow-2xl"
                    >
                        내게 맞는 플랜 찾기 <ArrowRight />
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
