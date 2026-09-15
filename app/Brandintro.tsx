'use client';

import Image from 'next/image';
import React from 'react';
import { motion, Variants } from 'framer-motion';

const Brandintro = () => {
    const containerVariants: Variants = {
        initial: {},
        whileInView: {
            transition: { staggerChildren: 0.2 }
        }
    };

    const sideSlideVariants = (direction: 'left' | 'right'): Variants => ({
        initial: { 
            opacity: 0, 
            x: direction === 'left' ? -50 : 50 
        },
        whileInView: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    });

    const fadeInUp: Variants = {
        initial: { opacity: 0, y: 20 },
        whileInView: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        /* 전체 배경: 오프화이트 톤 (#f8fafc) */
        <section id="about" className="py-24 md:py-32 bg-[#f8fafc] text-slate-800 overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div 
                    variants={containerVariants}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24"
                >
                    
                    {/* 이미지 영역 */}
                    <motion.div 
                        variants={sideSlideVariants('left')}
                        className="w-full lg:w-1/2 relative flex justify-center"
                    >
                        {/* 은은한 딥 블루 배경 블러 광원 */}
                        <div className="absolute -inset-10 bg-blue-600/5 blur-[100px] rounded-full" />
                        <div className="relative group w-full max-w-[500px]">
                            <Image
                                src="/shapes.jpg"
                                alt="TOOL:Z Coaching Visual"
                                width={550}
                                height={450}
                                className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(10,31,68,0.12)] transform group-hover:scale-105 transition-transform duration-700 rounded-3xl"
                            />
                        </div>
                    </motion.div>

                    {/* 텍스트 영역 */}
                    <motion.div 
                        variants={sideSlideVariants('right')}
                        className="w-full lg:w-1/2 space-y-8 md:space-y-10 relative z-10 text-left"
                    >
                        <div className="space-y-4 md:space-y-6">
                            <motion.span 
                                variants={fadeInUp}
                                className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs md:text-sm block"
                            >
                                Our Philosophy
                            </motion.span>
                            
                            <motion.h2 
                                variants={fadeInUp}
                                className="text-2xl md:text-4xl lg:text-5xl font-black leading-[1.3] text-[#0a1f44]"
                            >
                                “The tool is not just an object, <br className="hidden sm:block" />
                                but a new way <br className="hidden sm:block" />
                                to see <span className="text-[#0a1f44] border-b-2 border-blue-600">your world.</span>”
                            </motion.h2>

                            <motion.p 
                                variants={fadeInUp}
                                className="text-lg md:text-xl lg:text-2xl text-slate-500 font-normal leading-relaxed"
                            >
                                단순한 도구를 넘어, <br />
                                세상을 바라보는 <span className="text-blue-600 font-semibold">새로운 관점의 시작 TOOL:Z</span>
                            </motion.p>
                        </div>

                        {/* 포인트 바 애니메이션 (딥 블루 그라데이션) */}
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "6rem" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-px bg-gradient-to-r from-[#0a1f44] to-transparent" 
                        />

                        <div className="space-y-6 text-slate-600 text-base md:text-lg leading-relaxed">
                            <motion.p variants={fadeInUp} className="break-keep">
                                <strong className="text-[#0a1f44] font-bold italic tracking-tighter text-xl">TOOL : Z</strong>는 
                                삶의 무수한 질문들에 대한 해답을 스스로 찾아갈 수 있도록 돕습니다. 
                                내면의 잠재력을 깨우는 <span className="text-slate-800 font-semibold">실질적인 솔루션(Tool)</span>을 통해 
                                고착된 생각의 틀을 깨고 <span className="text-slate-800 font-semibold">삶의 본질(Z)</span>에 다가갑니다.
                            </motion.p>

                            {/* 강조 박스: 흰색 카드로 변경 및 딥 로열 블루 좌측 테두리 */}
                            <motion.div 
                                variants={fadeInUp}
                                className="relative p-5 md:p-6 rounded-2xl bg-white border-l-4 border-[#0a1f44] border-y border-r border-slate-200/80 shadow-sm"
                            >
                                <p className="text-slate-700 font-medium italic break-keep text-sm md:text-base">
                                    변화는 생각만으로 이루어지지 않습니다. <br className="sm:hidden" /> 
                                    올바른 도구를 손에 쥐는 순간 시작됩니다.
                                </p>
                            </motion.div>

                            <motion.p variants={fadeInUp} className="break-keep">
                                우리는 단순한 코칭을 넘어, 당신의 성장을 완결짓는 
                                <span className="text-blue-600 font-semibold"> 프리미엄 라이프 디자인 툴</span>을 제안합니다. 
                                A부터 Z까지, 당신이 그리는 미래의 좌표를 
                                <span className="text-[#0a1f44] font-bold tracking-tight px-1">TOOL : Z</span>가 함께 설계합니다.
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Brandintro;