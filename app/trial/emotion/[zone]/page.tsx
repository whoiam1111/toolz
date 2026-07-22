'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';

const ZONE_INFO = {
    heart: {
        title: 'Emotion & Affection',
        englishTitle: 'TOP ZONE',
        subtitle: '감정과 관계, 내면의 끌림을 알아보는 조향 스피릿',
        tag: '🌹 Emotion & Affection',
    },
    head: {
        title: 'Intellect & Clarity',
        englishTitle: 'MIDDLE ZONE',
        subtitle: '이성과 분석, 신중한 생각을 알아채는 조향 스피릿',
        tag: '🌿 Logic & Insight',
    },
    gut: {
        title: 'Instinct & Grounding',
        englishTitle: 'BOTTOM ZONE',
        subtitle: '본능과 직관, 중심의 에너지를 확인하는 조향 스피릿',
        tag: '🌲 Instinct & Balance',
    },
};

export default function ZonePage() {
    const params = useParams();
    const router = useRouter();
    const zone = (params.zone as 'heart' | 'head' | 'gut') || 'heart';
    const info = ZONE_INFO[zone] || ZONE_INFO.heart;

    const [name, setName] = useState('');

    const handleStart = () => {
        if (!name.trim()) {
            alert('성함 혹은 닉네임을 입력해 주세요.');
            return;
        }
        router.push(`/trial/emotion/${zone}/quiz?clientid=${encodeURIComponent(name)}`);
    };

    return (
        <div className="min-h-screen bg-[#F7F4EE] text-[#4A4238] flex items-center justify-center p-4 font-serif relative overflow-hidden">
            {/* 햇살 감성의 배경 조명 효과 */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#EFE8DC] to-transparent rounded-full blur-[100px] pointer-events-none opacity-80" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-[#FCFAF7] border border-[#E6DDD0] shadow-md shadow-[#D8CFCE]/20 rounded-2xl p-8 md:p-10 w-full max-w-md text-center z-10"
            >
                {/* 상단 서브 브랜드 타이틀 */}
                <span className="text-[10px] font-sans tracking-[0.3em] text-[#8C7A6B] uppercase font-light">
                    ATELIER DE PARFUM
                </span>

                {/* 존 타이틀 */}
                <h1 className="text-2xl md:text-3xl font-normal tracking-wide text-[#383129] mt-3 font-serif italic">
                    {info.title}
                </h1>
                <p className="text-[11px] font-sans text-[#A39585] tracking-widest uppercase mt-1 mb-4">
                    {info.englishTitle}
                </p>

                {/* 시그니처 태그 */}
                <div className="inline-block bg-[#F3EDE3] text-[#6E6153] text-[11px] font-sans px-3.5 py-1 rounded-full border border-[#E4DACD] font-light mb-6">
                    {info.tag}
                </div>

                <p className="text-xs text-[#6B5E51] font-sans leading-relaxed font-light mb-8">{info.subtitle}</p>

                {/* 이름 입력 창 */}
                <div className="mb-6 text-left font-sans">
                    <label className="block text-[10px] tracking-widest text-[#8C7A6B] uppercase mb-2">
                        YOUR NAME / NICKNAME
                    </label>
                    <input
                        type="text"
                        placeholder="성함 혹은 닉네임을 입력해 주세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                        className="w-full px-4 py-3 bg-[#F7F4EE] border border-[#D8CEBF] rounded-xl text-xs text-[#383129] font-light placeholder-[#A89C8E] focus:outline-none focus:border-[#8C7A6B] transition text-center"
                    />
                </div>

                {/* 시작 버튼 */}
                <motion.button
                    onClick={handleStart}
                    className="w-full py-3.5 bg-[#3A322A] hover:bg-[#25201A] text-[#F7F4EE] font-sans text-xs tracking-[0.2em] uppercase rounded-xl transition duration-300 font-light shadow-sm"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Begin Scent Journey ✦
                </motion.button>

                {/* 감성 슬로건 */}
                <p className="text-[10px] font-serif italic text-[#A39585] mt-6 tracking-wide">
                    — Invisible, Unforgettable.
                </p>
            </motion.div>
        </div>
    );
}
