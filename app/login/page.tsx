'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ReframePoint() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { session, login, logout } = useAuth();
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
            <div className="flex justify-center items-center h-screen bg-[#0f0f0f] text-white">
                <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            </div>
        );
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // 💡 폼 제출 기본 동작 방지
        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해 주세요.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await login(email, password);
            // 로그인 성공 시 useEffect에 의해 /dashboard 로 이동함
        } catch {
            setError('이메일 또는 비밀번호가 잘못되었습니다.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4 selection:bg-orange-500/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#151515] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
            >
                {/* 배경 포인트 광원 */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 blur-[80px] rounded-full" />

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-sm font-bold text-orange-500 tracking-[0.3em] uppercase mb-2">
                            Admin Access
                        </h1>
                        <h2 className="text-4xl font-black text-white tracking-tighter italic">TOOL : Z</h2>
                    </div>

                    {/* 💡 form 태그로 감싸 엔터키 제출 및 안정적인 핸들링 */}
                    <form
                        onSubmit={handleLogin}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 ml-2 tracking-widest uppercase">
                                Email
                            </label>
                            <input
                                className="w-full bg-[#0a0a0a] border border-white/5 p-4 text-white rounded-2xl focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-700"
                                type="email"
                                placeholder="admin@toolz.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 ml-2 tracking-widest uppercase">
                                Password
                            </label>
                            <input
                                className="w-full bg-[#0a0a0a] border border-white/5 p-4 text-white rounded-2xl focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-700"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="mt-4 text-sm text-red-500 font-medium text-center">{error}</p>}

                        <button
                            type="submit"
                            className="w-full py-4 mt-8 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 text-xs font-light">Authorized personnel only.</p>
                </div>
            </motion.div>
        </div>
    );
}
