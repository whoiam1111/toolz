// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// export default function PremiumPromoPage() {
//     const router = useRouter();

//     return (
//         <div className="min-h-screen bg-[#F7F4EE] text-[#4A4238] font-serif px-4 py-16 flex flex-col items-center relative overflow-hidden">
//             {/* 배경 조명 효과 */}
//             <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#EFE8DC] to-transparent rounded-full blur-[100px] pointer-events-none opacity-80" />

//             <motion.header
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//                 className="text-center mb-12 z-10"
//             >
//                 <span className="text-[10px] font-sans tracking-[0.3em] text-[#8C7A6B] uppercase border-b border-[#D8CFC4] pb-1">
//                     ATELIER DE PARFUM · EXCLUSIVE
//                 </span>
//                 <h1 className="text-3xl md:text-4xl font-normal tracking-wide text-[#383129] mt-6 italic">
//                     The Complete Olfactory Profile
//                 </h1>
//                 <p className="text-sm font-sans text-[#8C7A6B] font-light mt-4 max-w-lg mx-auto leading-relaxed">
//                     방금 체험하신 테스트는 향기의 세계로 들어가는 작은 문에 불과합니다.
//                     <br />
//                     정식 리포트에서는 <strong>총 9개의 스피릿, 81개의 심층 문항</strong>을 통해
//                     <br />
//                     당신만의 완벽한 향기 처방전(Detailed Recipe)을 완성합니다.
//                 </p>
//             </motion.header>

//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.2 }}
//                 className="w-full max-w-4xl bg-[#FCFAF7] border border-[#E6DDD0] shadow-xl shadow-[#D8CFCE]/30 rounded-2xl p-8 md:p-12 relative z-10"
//             >
//                 {/* 데이터 프리뷰 헤더 */}
//                 <div className="flex justify-between items-end border-b border-[#ECE4DA] pb-4 mb-6">
//                     <div>
//                         <h2 className="text-xl font-serif text-[#383129]">Detailed Analytics Preview</h2>
//                         <p className="text-[10px] font-sans text-[#A39585] tracking-widest uppercase mt-1">
//                             프리미엄 결과지 예시
//                         </p>
//                     </div>
//                     <div className="hidden sm:block text-[10px] font-mono text-[#8C7A6B]">UNLOCK FULL 81 QUESTIONS</div>
//                 </div>

//                 {/* 테이블 랩퍼 - 하단 페이드아웃 효과 적용 */}
//                 <div className="relative">
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left border-collapse font-sans">
//                             <thead>
//                                 <tr className="border-b-2 border-[#D8CEBF] text-[#8C7A6B] text-[10px] uppercase tracking-wider">
//                                     <th className="py-3 px-4 w-16 text-center">NO.</th>
//                                     <th className="py-3 px-4">QUESTION (문항)</th>
//                                     <th className="py-3 px-4 text-center w-32">MY CHOICE</th>
//                                     <th className="py-3 px-4 text-right w-24">SCORE</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-[#ECE4DA]">
//                                 {/* 💡 가상의 9문항 데이터 예시 */}
//                                 {[
//                                     {
//                                         id: 1,
//                                         q: '나는 종종 완벽함을 추구하며, 세부적인 디테일에 집착하는 경향이 있다.',
//                                         ans: '매우 그렇다',
//                                         score: 4,
//                                     },
//                                     {
//                                         id: 2,
//                                         q: '타인의 감정 변화를 빠르고 섬세하게 알아차리며 도움을 주고 싶다.',
//                                         ans: '그렇다',
//                                         score: 3,
//                                     },
//                                     {
//                                         id: 3,
//                                         q: '목표를 달성했을 때의 성취감이 내 삶의 가장 큰 원동력이다.',
//                                         ans: '매우 그렇다',
//                                         score: 4,
//                                     },
//                                     {
//                                         id: 4,
//                                         q: '남들과 다른 나만의 고유한 스타일과 분위기를 유지하는 것이 중요하다.',
//                                         ans: '전혀 아니다',
//                                         score: 1,
//                                     },
//                                     {
//                                         id: 5,
//                                         q: '결정을 내리기 전, 가능한 모든 정보와 데이터를 수집해야 마음이 편하다.',
//                                         ans: '그렇다',
//                                         score: 3,
//                                     },
//                                 ].map((item, index) => (
//                                     <tr
//                                         key={index}
//                                         className="text-xs text-[#5C5043]"
//                                     >
//                                         <td className="py-3 px-4 text-center font-mono text-[#8C7A6B]">{item.id}</td>
//                                         <td className="py-3 px-4 font-light text-[#4A4238]">{item.q}</td>
//                                         <td className="py-3 px-4 text-center font-medium">
//                                             {item.ans === '매우 그렇다' && (
//                                                 <span className="text-[#6B5E51] font-bold">{item.ans}</span>
//                                             )}
//                                             {item.ans === '그렇다' && (
//                                                 <span className="text-[#8C7A6B]">{item.ans}</span>
//                                             )}
//                                             {item.ans === '전혀 아니다' && (
//                                                 <span className="text-[#A39585]">{item.ans}</span>
//                                             )}
//                                         </td>
//                                         <td className="py-3 px-4 text-right font-mono text-[11px] text-[#A39585]">
//                                             +{item.score} pt
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* 🔥 그라데이션 페이드아웃 (블라인드 처리) */}
//                     <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#FCFAF7] via-[#FCFAF7]/90 to-transparent flex flex-col justify-end items-center pb-6">
//                         <div className="bg-[#FCFAF7] border border-[#E6DDD0] shadow-sm px-6 py-3 rounded-full flex items-center gap-3">
//                             <span className="text-lg">🔒</span>
//                             <span className="text-xs font-sans tracking-wide text-[#6E6153]">
//                                 숨겨진 76개의 정밀 문항과 심층 분석이 대기 중입니다.
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 하단 요약 및 유도 버튼 */}
//                 <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-[#ECE4DA] pt-8 gap-6">
//                     <div className="text-center md:text-left">
//                         <h3 className="text-sm font-bold text-[#383129] font-sans">Full Spectrum Discovery</h3>
//                         <p className="text-[11px] font-sans text-[#8C7A6B] mt-2 leading-relaxed">
//                             ✔️ 9가지 성향 완벽 분석
//                             <br />
//                             ✔️ 81문항 기반의 데이터 테이블 제공
//                             <br />
//                             ✔️ 시그니처 향료 추천 및 블렌딩 레시피
//                         </p>
//                     </div>
//                 </div>
//             </motion.div>

//             <p className="text-[10px] font-serif italic text-[#A39585] mt-12 tracking-wide z-10">
//                 — Discover your true essence.
//             </p>
//         </div>
//     );
// }
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PremiumPromoPage() {
    const router = useRouter();

    const programs = [
        {
            type: 'DEEP:QUESTION',
            tag: '01 / Small Group',
            desc: '소규모 인원이 모여 각자의 내면과 고민을 깊이 있게 나누는 고전 사유 세션',
            schedule: '2명, 3명 인원으로 유동적인 시간에 운영',
            location: '조율 가능',
            posterImg: '/postersdeep.png',
        },
        {
            type: 'RE:READ',
            tag: '02 / Community',
            desc: '타인과 함께 생각을 나누며 시야를 넓히는 공동체 인문학 세션',
            schedule: '월, 금 19:30 (9월 4, 7, 11, 14, 18, 21일)',
            location: '고려대역 SPACEGO',
            posterImg: '/postersreread.jpg',
        },
        {
            type: '북토킹',
            tag: '03 / Book Talk',
            desc: '하나의 책을 깊이 있게 파고들며 텍스트의 본질을 이해하는 심화 독서 모임',
            schedule: '매주 토요일 14:00',
            location: '고려대역 SPACEGO',
            posterImg: '/postersbook.png',
        },
    ];

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
                    The Complete Olfactory & Literary Profile
                </h1>
                <p className="text-sm font-sans text-[#8C7A6B] font-light mt-4 max-w-lg mx-auto leading-relaxed">
                    방금 체험하신 향기와 테스트는 인문학적 사유로 들어가는 작은 문에 불과합니다.
                    <br />
                    정식 리포트에서는 <strong>총 9개의 스피릿, 81개의 심층 문항</strong>과 함께
                    <br />
                    당신의 내면 결을 비춰줄 <strong>깊이 있는 고전문학 처방전</strong>이 완성됩니다.
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
                        <h2 className="text-xl font-serif text-[#383129]">Detailed Analytics & Recipe Preview</h2>
                        <p className="text-[10px] font-sans text-[#A39585] tracking-widest uppercase mt-1">
                            프리미엄 결과지 예시
                        </p>
                    </div>
                    <div className="hidden sm:block text-[10px] font-mono text-[#8C7A6B]">
                        UNLOCK FULL 81 QUESTIONS & CLASSICS
                    </div>
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
                                숨겨진 76개의 정밀 문항과 깊이 있는 고전문학 솔루션이 대기 중입니다.
                            </span>
                        </div>
                    </div>
                </div>

                {/* 하단 요약 및 프로그램 라인업 섹션 */}
                <div className="mt-12 border-t border-[#ECE4DA] pt-8">
                    <div className="text-center mb-8">
                        <span className="text-[10px] font-sans tracking-[0.2em] text-[#8C7A6B] uppercase border-b border-[#D8CFC4] pb-1">
                            LITERARY JOURNEY PROGRAM
                        </span>
                        <h3 className="text-lg font-serif text-[#383129] mt-3">
                            더 깊은 사유와 변화를 위한 맞춤형 프로그램 라인업
                        </h3>
                        <p className="text-xs font-sans text-[#8C7A6B] font-light mt-1 max-w-md mx-auto">
                            오늘 만난 향기와 고전문학의 여정을 일상 속에서 구체적으로 이어가세요.
                        </p>
                    </div>

                    {/* 3가지 라인업 카드 (세로형 포스터 비율 aspect-[3/4] 적용) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {programs.map((prog, idx) => (
                            <div
                                key={idx}
                                className="bg-[#F7F4EE] border border-[#D8CFC4] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#8C7A6B] transition-all shadow-sm"
                            >
                                {/* 포스터 영역 (세로형 비율 및 img 태그 적용) */}
                                <div className="w-full aspect-[3/4] bg-[#EFE8DC] relative overflow-hidden flex items-center justify-center border-b border-[#D8CFC4]">
                                    <img
                                        src={prog.posterImg}
                                        alt={prog.type}
                                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* 텍스트 및 상세 정보 영역 */}
                                <div className="p-6 flex flex-col justify-between flex-grow">
                                    <div>
                                        <span className="text-[10px] font-sans tracking-widest text-[#8C7A6B] uppercase font-bold block mb-1">
                                            {prog.tag}
                                        </span>
                                        <h4 className="text-sm font-bold text-[#383129] font-sans mb-2">{prog.type}</h4>
                                        <p className="text-xs text-[#5C5043] font-sans font-light leading-relaxed mb-4">
                                            {prog.desc}
                                        </p>
                                    </div>

                                    {/* 일시 및 장소 정보 */}
                                    <div className="border-t border-[#E6DDD0] pt-3 text-[11px] font-sans text-[#7A6B5D] space-y-1">
                                        <p className="flex items-center gap-1.5">
                                            <span>📅</span> <span className="font-medium text-[#4A4238]">일시:</span>{' '}
                                            {prog.schedule}
                                        </p>
                                        <p className="flex items-center gap-1.5">
                                            <span>📍</span> <span className="font-medium text-[#4A4238]">장소:</span>{' '}
                                            {prog.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <p className="text-[10px] font-serif italic text-[#A39585] mt-12 tracking-wide z-10">
                — Discover your true essence and timeless literature.
            </p>
        </div>
    );
}
