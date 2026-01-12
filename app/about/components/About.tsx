'use client';

import { motion, Variants } from 'framer-motion';

// ✅ 애니메이션 상태 정의
const fadeInUp: Variants = {
    initial: { opacity: 0, y: 30 },
    whileInView: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" } 
    }
};

export default function About() {
    return (
        <section className="py-12 px-6 max-w-5xl mx-auto text-white font-sans">
            {/* 1. 브랜드 네임 및 의미 */}
            <motion.div 
                className="text-center mb-32"
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
            >
                <h2 className="text-6xl md:text-7xl font-black tracking-tighter mb-10">
                    <span className="text-orange-500">TOOL : Z</span>
                </h2>
                <div className="space-y-8 text-xl md:text-2xl font-light text-gray-300 leading-relaxed">
                    <p className="break-keep">
                        <span className="text-white font-bold">‘TOOL’</span>은 삶을 변화시키는 실질적인 <br className="sm:hidden"/> 
                        <span className="text-orange-400">도구와 프레임워크</span>를 의미합니다.
                    </p>
                    <p className="break-keep">
                        <span className="text-white font-bold">‘Z’</span>는 Zero(본질)에서 Zenith(정점)까지, <br className="sm:hidden"/> 
                        당신이 도달할 <span className="text-orange-400">무한한 가능성</span>을 뜻합니다.
                    </p>
                    <div className="pt-4">
                        {/* ✅ 따옴표 에러 해결: {""} 방식으로 감싸서 처리 */}
                        <p className="italic text-gray-500 text-lg md:text-xl">
                            {"\"TOOL:Z는 단순한 상담을 넘어, 스스로의 세계를 재설계하는 강력한 도구를 제공합니다.\""}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 2. 브랜드 미션 */}
            <motion.div 
                className="mb-32 text-center"
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
            >
                <h3 className="text-3xl font-bold text-orange-500 mb-8 tracking-tight uppercase">Our Mission</h3>
                <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light break-keep">
                    우리는 각자가 가진 프레임을 발견하고, <br className="hidden md:block" />
                    더 나은 방향으로 정렬(Align)할 수 있도록 돕는 <br className="hidden md:block" />
                    <span className="text-white font-medium text-2xl block mt-4 italic">프리미엄 관점 설계 커뮤니티입니다.</span>
                </p>
            </motion.div>

            {/* 3. 설립 목적 (Core Values) */}
            <motion.div 
                className="mb-32 px-8 py-16 bg-[#151515] border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden"
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[80px] rounded-full" />
                <h3 className="text-3xl font-black text-white mb-10 text-center tracking-tight">Core Values</h3>
                <div className="grid md:grid-cols-2 gap-10 text-left">
                    <div className="space-y-4">
                        <h4 className="text-orange-500 font-bold text-xl italic underline decoration-orange-500/30 underline-offset-8">01. Discovery</h4>
                        <p className="text-gray-400 font-light leading-relaxed break-keep">
                            당신이 당연하게 여기던 생각의 틀을 깨고, 숨겨진 본질적인 가능성을 발견하는 것에서 모든 변화는 시작됩니다.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-orange-500 font-bold text-xl italic underline decoration-orange-500/30 underline-offset-8">02. Redefine</h4>
                        <p className="text-gray-400 font-light leading-relaxed break-keep">
                            발견된 가능성을 바탕으로 당신의 삶과 가치관을 새롭게 정의합니다. TOOL:Z는 그 과정을 위한 정교한 도구를 설계합니다.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 4. 비전 */}
            <motion.div 
                className="text-center px-6 max-w-3xl mx-auto mb-20"
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
            >
                <h3 className="text-3xl font-bold text-orange-500 mb-8 tracking-tight uppercase">The Goal</h3>
                <p className="text-gray-200 text-xl md:text-2xl leading-relaxed font-light break-keep">
                    TOOL:Z가 꿈꾸는 미래는 명확합니다. <br />
                    {/* ✅ 따옴표 에러 해결: {""} 방식으로 감싸기 */}
                    <span className="font-bold text-white border-b-2 border-orange-600 px-1 inline-block mt-4">
                        {"“모두가 자신의 삶을 직접 도구로 빚어내는 시대”"}
                    </span>
                </p>
                <p className="mt-8 text-gray-500 text-lg font-light break-keep">
                    우리는 당신의 빛을 찾아주는 조력자를 넘어, <br className="hidden md:block" />
                    당신 스스로 빛을 낼 수 있는 엔진을 만드는 파트너가 되겠습니다.
                </p>
            </motion.div>
        </section>
    );
}