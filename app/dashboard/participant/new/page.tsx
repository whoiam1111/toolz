'use client';

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import SignaturePad from 'signature_pad';
import { uploadSignature, addNewParticipant } from '@/app/api/supabaseApi';
import { useAuth } from '@/app/context/AuthContext';
import * as htmlToImage from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, UserPlus, ShieldCheck, Loader2 } from 'lucide-react';

export default function NewParticipantPage() {
    const router = useRouter();
    const { session } = useAuth();

    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        birth_date: '',
        stress: '',
        religion: '',
    });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const signaturePadRef = useRef<SignaturePad | null>(null);
    const agreementRef = useRef<HTMLDivElement | null>(null);
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    // ✅ useEffect 의존성 배열 에러 수정 완료
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ratio = window.devicePixelRatio || 1;
        const width = 300;
        const height = 150;

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(ratio, ratio);

        signaturePadRef.current = new SignaturePad(canvas, {
            penColor: '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            minWidth: 1.5,
            maxWidth: 3,
        });

        const preventDefault = (e: TouchEvent) => {
            if (e.cancelable) e.preventDefault();
        };

        canvas.addEventListener('touchstart', preventDefault, { passive: false });
        canvas.addEventListener('touchmove', preventDefault, { passive: false });

        return () => {
            canvas.removeEventListener('touchstart', preventDefault);
            canvas.removeEventListener('touchmove', preventDefault);
        };
    }, []); // ✅ 빈 배열을 유지하여 Hooks 규칙을 준수합니다.

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAgreementSubmit = async () => {
        if (!agreed || !signaturePadRef.current || signaturePadRef.current.isEmpty()) {
            alert('보안 각서에 동의하고 서명해주세요.');
            return;
        }

        try {
            const node = agreementRef.current;
            if (!node) {
                alert('약속서 캡처에 실패했습니다.');
                return;
            }

            const dataUrl = await htmlToImage.toPng(node);
            setSignatureData(dataUrl);
            setStep(2);
        } catch (err) {
            console.error('Capture error:', err);
            alert('서약서 이미지 생성 중 오류 발생');
        }
    };

    const handleSubmit = async () => {
        const { name, birth_date, stress, religion } = form;
        if (!name || !birth_date || !stress || !religion || !signatureData) {
            alert('모든 필드를 작성해주세요.');
            return;
        }

        setLoading(true);

        const fileName = `agreement-full-${Date.now()}.png`;
        const { url: signatureurl, error: uploadError } = await uploadSignature(signatureData, fileName);

        if (uploadError || !signatureurl) {
            alert('서명 업로드에 실패했습니다.');
            setLoading(false);
            return;
        }

        const { error } = await addNewParticipant({
            name,
            birth_date,
            stress,
            religion,
            signatureurl,
            counselorId: session?.user?.id ?? '',
        });

        setLoading(false);

        if (error) {
            alert('등록 중 오류 발생');
        } else {
            alert('참여자 등록이 완료되었습니다.');
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white py-16 px-6">
            <div className="max-w-2xl mx-auto">
                
                <header className="mb-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h2 className="text-3xl font-black tracking-tighter mb-2 italic uppercase">
                            TOOL : Z <span className="text-orange-500 font-normal not-italic tracking-normal">Registration</span>
                        </h2>
                        <p className="text-gray-500 font-light text-sm tracking-widest uppercase">Member onboarding process</p>
                    </motion.div>
                </header>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div
                                ref={agreementRef}
                                className="bg-white text-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-6 font-serif leading-relaxed relative border border-white/10"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                                    <ShieldCheck size={180} />
                                </div>
                                
                                <h2 className="text-2xl font-black text-center underline underline-offset-8 mb-10 tracking-widest uppercase">
                                    비밀 유지 서약서
                                </h2>
                                
                                <div className="text-[13px] md:text-sm space-y-4 text-justify break-keep text-gray-800">
                                    <p>본인은 <strong>TOOL:Z</strong> 코칭 프로그램에 참여함에 있어 아래의 조항을 충분히 이해하고 이에 동의하며 서명합니다.</p>
                                    <ol className="space-y-4 list-decimal list-inside">
                                        <li><strong>기밀 유지</strong>: 상담사와 내담자는 상호 동의 없이는 상담 및 교육 내용을 외부에 공개하지 않습니다.</li>
                                        <li><strong>지적 재산권</strong>: 프로그램 과정 중 제공되는 모든 도구(Tool) 및 자료의 저작권은 TOOL:Z에 귀속됩니다.</li>
                                        <li><strong>데이터 보호</strong>: 연구 목적의 데이터 활용 시 내담자의 개인정보는 철저히 비식별 처리되어 보호됩니다.</li>
                                        <li><strong>신의 성실</strong>: 본인은 삶의 긍정적인 변화를 위해 성실히 과정에 임할 것을 약속합니다.</li>
                                    </ol>
                                </div>

                                <div className="pt-8 border-t border-gray-100 flex flex-col items-center">
                                    <label className="flex items-center gap-3 cursor-pointer group mb-8">
                                        <input
                                            type="checkbox"
                                            checked={agreed}
                                            onChange={() => setAgreed(!agreed)}
                                            className="hidden peer"
                                        />
                                        <div className="w-6 h-6 border-2 border-gray-300 rounded-lg flex items-center justify-center peer-checked:bg-orange-600 peer-checked:border-orange-600 transition-all">
                                            <Check size={16} className="text-white" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 select-none">상기 내용을 충분히 숙지하였으며 동의합니다.</span>
                                    </label>

                                    <div className="text-center space-y-4 w-full">
                                        <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase italic">Date: {today}</p>
                                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-2 inline-block transition-all focus-within:border-orange-500">
                                            <canvas
                                                ref={canvasRef}
                                                className="bg-transparent touch-none cursor-crosshair"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Sign Inside the Box</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleAgreementSubmit}
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl mt-8 transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                            >
                                NEXT STEP <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#151515] p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                                <UserPlus className="text-orange-500" size={24} />
                                <h3 className="text-xl font-bold tracking-tight">Participant Information</h3>
                            </div>

                            <div className="grid gap-6 mb-10 md:grid-cols-2">
                                {[
                                    { name: 'name', label: '성함', placeholder: '홍길동', type: 'text' },
                                    { name: 'birth_date', label: '생년월일', placeholder: '', type: 'date' },
                                    { name: 'stress', label: '주요 스트레스 요인', placeholder: '예: 진로, 인간관계', type: 'text' },
                                    { name: 'religion', label: '거주지 (동 단위)', placeholder: '예: 자양동', type: 'text' },
                                ].map(({ name, label, placeholder, type }) => (
                                    <div key={name} className="space-y-2">
                                        <label htmlFor={name} className="text-[10px] font-bold text-gray-500 ml-2 tracking-[0.2em] uppercase">
                                            {label}
                                        </label>
                                        <input
                                            id={name}
                                            name={name}
                                            type={type}
                                            placeholder={placeholder}
                                            onChange={handleChange}
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-800 font-medium text-sm appearance-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-900/20 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    'COMPLETE REGISTRATION'
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}