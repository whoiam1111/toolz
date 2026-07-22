'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PremiumPromoPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F7F4EE] text-[#4A4238] font-serif px-4 py-16 flex flex-col items-center relative overflow-hidden">
            {/* 배경 조명 효과 */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#EFE8DC] to-transparent rounded-full blur-[100px] pointer-events-none opacity-80" />

            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12 z-10"
            >
                <span className="text-[10px] font-sans tracking-[0.3em] text-[#8C7A6B] uppercase border-b border-[#D8CFC4] pb-1">
                    ATELIER DE PARFUM · EXCLUSIVE
                </span>
                <h1 className="text-3xl md:text-4xl font-normal tracking-wide text-[#383129] mt-6 italic">
                    The Complete Olfactory Profile
                </h1>
                <p className="text-sm font-sans text-[#8C7A6B] font-light mt-4 max-w-lg mx-auto leading-relaxed">
                    방금 체험하신 테스트는 향기의 세계로 들어가는 작은 문에 불과합니다.
                    <br />
                    정식 리포트에서는 <strong>총 9개의 스피릿, 81개의 심층 문항</strong>을 통해
                    <br />
                    당신만의 완벽한 향기 처방전(Detailed Recipe)을 완성합니다.
                </p>
            </motion.header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-4xl bg-[#FCFAF7] border border-[#E6DDD0] shadow-xl shadow-[#D8CFCE]/30 rounded-2xl p-8 md:p-12 relative z-10"
            >
                {/* 데이터 프리뷰 헤더 */}
                <div className="flex justify-between items-end border-b border-[#ECE4DA] pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-serif text-[#383129]">Detailed Analytics Preview</h2>
                        <p className="text-[10px] font-sans text-[#A39585] tracking-widest uppercase mt-1">
                            프리미엄 결과지 예시
                        </p>
                    </div>
                    <div className="hidden sm:block text-[10px] font-mono text-[#8C7A6B]">UNLOCK FULL 81 QUESTIONS</div>
                </div>

                {/* 테이블 랩퍼 - 하단 페이드아웃 효과 적용 */}
                <div className="relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-sans">
                            <thead>
                                <tr className="border-b-2 border-[#D8CEBF] text-[#8C7A6B] text-[10px] uppercase tracking-wider">
                                    <th className="py-3 px-4 w-16 text-center">NO.</th>
                                    <th className="py-3 px-4">QUESTION (문항)</th>
                                    <th className="py-3 px-4 text-center w-32">MY CHOICE</th>
                                    <th className="py-3 px-4 text-right w-24">SCORE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ECE4DA]">
                                {/* 💡 가상의 9문항 데이터 예시 */}
                                {[
                                    {
                                        id: 1,
                                        q: '나는 종종 완벽함을 추구하며, 세부적인 디테일에 집착하는 경향이 있다.',
                                        ans: '매우 그렇다',
                                        score: 4,
                                    },
                                    {
                                        id: 2,
                                        q: '타인의 감정 변화를 빠르고 섬세하게 알아차리며 도움을 주고 싶다.',
                                        ans: '그렇다',
                                        score: 3,
                                    },
                                    {
                                        id: 3,
                                        q: '목표를 달성했을 때의 성취감이 내 삶의 가장 큰 원동력이다.',
                                        ans: '매우 그렇다',
                                        score: 4,
                                    },
                                    {
                                        id: 4,
                                        q: '남들과 다른 나만의 고유한 스타일과 분위기를 유지하는 것이 중요하다.',
                                        ans: '전혀 아니다',
                                        score: 1,
                                    },
                                    {
                                        id: 5,
                                        q: '결정을 내리기 전, 가능한 모든 정보와 데이터를 수집해야 마음이 편하다.',
                                        ans: '그렇다',
                                        score: 3,
                                    },
                                ].map((item, index) => (
                                    <tr
                                        key={index}
                                        className="text-xs text-[#5C5043]"
                                    >
                                        <td className="py-3 px-4 text-center font-mono text-[#8C7A6B]">{item.id}</td>
                                        <td className="py-3 px-4 font-light text-[#4A4238]">{item.q}</td>
                                        <td className="py-3 px-4 text-center font-medium">
                                            {item.ans === '매우 그렇다' && (
                                                <span className="text-[#6B5E51] font-bold">{item.ans}</span>
                                            )}
                                            {item.ans === '그렇다' && (
                                                <span className="text-[#8C7A6B]">{item.ans}</span>
                                            )}
                                            {item.ans === '전혀 아니다' && (
                                                <span className="text-[#A39585]">{item.ans}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono text-[11px] text-[#A39585]">
                                            +{item.score} pt
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 🔥 그라데이션 페이드아웃 (블라인드 처리) */}
                    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#FCFAF7] via-[#FCFAF7]/90 to-transparent flex flex-col justify-end items-center pb-6">
                        <div className="bg-[#FCFAF7] border border-[#E6DDD0] shadow-sm px-6 py-3 rounded-full flex items-center gap-3">
                            <span className="text-lg">🔒</span>
                            <span className="text-xs font-sans tracking-wide text-[#6E6153]">
                                숨겨진 76개의 정밀 문항과 심층 분석이 대기 중입니다.
                            </span>
                        </div>
                    </div>
                </div>

                {/* 하단 요약 및 유도 버튼 */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-[#ECE4DA] pt-8 gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-bold text-[#383129] font-sans">Full Spectrum Discovery</h3>
                        <p className="text-[11px] font-sans text-[#8C7A6B] mt-2 leading-relaxed">
                            ✔️ 9가지 성향 완벽 분석
                            <br />
                            ✔️ 81문항 기반의 데이터 테이블 제공
                            <br />
                            ✔️ 시그니처 향료 추천 및 블렌딩 레시피
                        </p>
                    </div>
                </div>
            </motion.div>

            <p className="text-[10px] font-serif italic text-[#A39585] mt-12 tracking-wide z-10">
                — Discover your true essence.
            </p>
        </div>
    );
}
