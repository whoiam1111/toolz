'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function ReframePoint() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { session, login } = useAuth();
    const router = useRouter();

    // 💡 세션 변경 시 대시보드로 이동
    useEffect(() => {
        if (session) {
            router.replace('/dashboard');
        }
    }, [session, router]);

    // 💡 세션 로딩 중이거나 이미 로그인된 사용자는 대시보드로 이동 전까지 스피너 유지 (UI 튕김 방지)
    if (session === undefined || session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#061229] text-slate-300">
                <Loader2 className="animate-spin text-indigo-400 mb-4" size={40} />
                <p className="text-sm font-medium tracking-wide">인증 세션을 확인하는 중...</p>
            </div>
        );
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해 주세요.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch {
            setError('이메일 또는 비밀번호가 잘못되었습니다.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#061229] flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-indigo-500/30">
            {/* 상단 및 중앙 은은한 배경 광원 */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[140px] pointer-events-none rounded-full" />
            <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-[#0a1f44] p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10 backdrop-blur-md"
            >
                {/* 상단 타이틀 브랜드 헤더 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                        <ShieldCheck size={14} className="text-indigo-400" />
                        <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">
                            Admin Access
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-3xl font-black tracking-tighter text-white uppercase italic">TOOL</span>
                        <span className="text-3xl font-black text-indigo-400">:</span>
                        <span className="text-3xl font-black tracking-tighter text-white uppercase">Z</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium">상담 관리자 통합 세션 인증</p>
                </div>

                {/* 로그인 폼 */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-slate-300 ml-1 tracking-wider uppercase flex items-center gap-1.5">
                            <Mail size={12} className="text-indigo-400" /> Email Address
                        </label>
                        <input
                            className="w-full bg-[#061229] border border-white/10 p-4 text-white rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all placeholder:text-slate-600 text-sm font-medium shadow-inner"
                            type="email"
                            placeholder="admin@toolz.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-slate-300 ml-1 tracking-wider uppercase flex items-center gap-1.5">
                            <Lock size={12} className="text-indigo-400" /> Password
                        </label>
                        <input
                            className="w-full bg-[#061229] border border-white/10 p-4 text-white rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all placeholder:text-slate-600 text-sm font-medium shadow-inner"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                            <p className="text-xs text-rose-400 font-medium">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                <span>AUTHENTICATING...</span>
                            </>
                        ) : (
                            <>
                                <span>LOGIN TO DASHBOARD</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-xs font-normal">
                        인가된 상담사 계정만 접근 가능합니다.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}