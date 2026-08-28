'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';

const ZONE_INFO = {
    head: {
        title: 'Intellect & Clarity',
        englishTitle: 'TOP ZONE',
        subtitle: '이성과 분석, 명확한 사유를 통해 내면의 향기를 마주하는 첫 장',
        tag: '🌿 Logic & Insight',
        bookNote: '알베르 카뮈 · 프란츠 카프카 · 조지 오웰의 사유',
    },
    heart: {
        title: 'Emotion & Affection',
        englishTitle: 'MIDDLE ZONE',
        subtitle: '감성과 내면의 깊은 울림을 문학의 언어로 기록하는 여정',
        tag: '🌹 Emotion & Affection',
        bookNote: '생텍쥐페리 · 한강 · 무라카미 하루키의 감성',
    },
    gut: {
        title: 'Instinct & Grounding',
        englishTitle: 'BOTTOM ZONE',
        subtitle: '본능과 직관, 그리고 삶의 주체적인 의지를 찾아가는 순간',
        tag: '🌲 Instinct & Balance',
        bookNote: '헤밍웨이 · 니코스 카잔차키스 · 빅터 프랭클의 통찰',
    },
};

export default function ZonePage() {
    const params = useParams();
    const router = useRouter();
    const zone = (params.zone as 'head' | 'heart' | 'gut') || 'head';
    const info = ZONE_INFO[zone] || ZONE_INFO.heart;

    const [name, setName] = useState('');

    const handleStart = () => {
        if (!name.trim()) {
            alert('성함 혹은 닉네임을 입력해 주세요.');
            return;
        }
        router.push(`/trial/emotion/book/${zone}/quiz?clientid=${encodeURIComponent(name)}`);
    };

    return (
        <div className="min-h-screen bg-[#F7F4EE] text-[#4A4238] flex items-center justify-center p-4 font-serif relative overflow-hidden">
            {/* 햇살 및 고즈넉한 책방 감성의 배경 조명 효과 */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#EFE8DC] to-transparent rounded-full blur-[100px] pointer-events-none opacity-80" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-[#FCFAF7] border border-[#E6DDD0] shadow-lg shadow-[#D8CFCE]/20 rounded-2xl p-8 md:p-12 w-full max-w-md text-center z-10"
            >
                {/* 상단 책방 브랜드 타이틀 */}
                <span className="text-[10px] font-sans tracking-[0.3em] text-[#8C7A6B] uppercase font-light flex items-center justify-center gap-1.5 mb-2">
                    <span>📖</span> ATELIER DE L'ESPRIT
                </span>

                {/* 존 타이틀 */}
                <h1 className="text-2xl md:text-3xl font-normal tracking-wide text-[#383129] mt-3 font-serif italic">
                    {info.title}
                </h1>
                <p className="text-[11px] font-sans text-[#A39585] tracking-widest uppercase mt-1 mb-4">
                    {info.englishTitle}
                </p>

                {/* 시그니처 태그 */}
                <div className="inline-block bg-[#F3EDE3] text-[#6E6153] text-[11px] font-sans px-3.5 py-1 rounded-full border border-[#E4DACD] font-light mb-5">
                    {info.tag}
                </div>

                <p className="text-xs text-[#6B5E51] font-sans leading-relaxed font-light mb-3">{info.subtitle}</p>
                <p className="text-[11px] font-serif italic text-[#8C7A6B] mb-8">"{info.bookNote}"</p>

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
                        className="w-full px-4 py-3 bg-[#F7F4EE] border border-[#D8CEBF] rounded-xl text-xs text-[#383129] font-light placeholder-[#A89C8E] focus:outline-none focus:border-[#8C7A6B] transition text-center font-serif"
                    />
                </div>

                {/* 시작 버튼 */}
                <motion.button
                    onClick={handleStart}
                    className="w-full py-3.5 bg-[#3A322A] hover:bg-[#25201A] text-[#F7F4EE] font-sans text-xs tracking-[0.2em] uppercase rounded-xl transition duration-300 font-light shadow-sm"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Open the Book & Scent ✦
                </motion.button>

                {/* 감성 슬로건 */}
                <p className="text-[10px] font-serif italic text-[#A39585] mt-6 tracking-wide">
                    — 문장과 향기가 스며드는 시간
                </p>
            </motion.div>
        </div>
    );
}
