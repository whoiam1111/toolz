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

    useEffect(() => {
        if (session) {
            router.replace('/dashboard');
        }
    }, [session, router]);

    if (session === undefined) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#0f0f0f] text-white">
                <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            </div>
        );
    }

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch {
            setError('이메일 또는 비밀번호가 잘못되었습니다.');
        }
        setLoading(false);
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

                {session ? (
                    <div className="text-center relative z-10">
                        <h2 className="text-3xl font-black mb-6 text-white tracking-tighter">
                            Welcome back, <span className="text-orange-500 text-4xl block mt-2">COACH</span>
                        </h2>
                        <p className="text-gray-400 font-light mb-10 leading-relaxed">
                            {"\"TOOL:Z는 도구를 통해 개인의 성장을 설계합니다.\""}
                        </p>
                        <button
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10"
                            onClick={logout}
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <h1 className="text-sm font-bold text-orange-500 tracking-[0.3em] uppercase mb-2">
                                Admin Access
                            </h1>
                            <h2 className="text-4xl font-black text-white tracking-tighter italic">
                                TOOL : Z
                            </h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-2 tracking-widest uppercase">Email</label>
                                <input
                                    className="w-full bg-[#0a0a0a] border border-white/5 p-4 text-white rounded-2xl focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-700"
                                    type="email"
                                    placeholder="admin@toolz.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-2 tracking-widest uppercase">Password</label>
                                <input
                                    className="w-full bg-[#0a0a0a] border border-white/5 p-4 text-white rounded-2xl focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-700"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="mt-4 text-sm text-red-500 font-medium text-center">
                                {error}
                            </p>
                        )}

                        <button
                            className="w-full py-4 mt-8 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
                        </button>
                        
                        <p className="mt-8 text-center text-gray-600 text-xs font-light">
                            Authorized personnel only.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}