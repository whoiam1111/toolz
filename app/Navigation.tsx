'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
    const [scrolling, setScrolling] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { session, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            // 스크롤 시 유리 느낌의 그림자와 테두리 효과
            setScrolling(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    /* 메인 톤앤매너에 맞춘 텍스트 및 호버 스타일 */
    const navLinkStyle = "px-4 py-2 rounded-full font-medium text-slate-200 transition-all duration-300 hover:text-white hover:bg-white/10";

    return (
        <>
            <motion.header
                className={`fixed h-[70px] top-0 left-0 w-full z-[100] transition-all duration-300 ease-in-out ${
                    // 스크롤 시 딥 네이비 반투명 배경 및 블러 효과
                    scrolling 
                    ? 'bg-[#0a1f44]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-[#0a1f44]/20' 
                    : 'bg-[#0a1f44] border-b border-transparent'
                }`}
            >
                <div className="container mx-auto h-full flex justify-between items-center px-6">
                    {/* 로고 영역 */}
                    <Link className="flex items-center group" href="/">
                        <h1 className="text-2xl font-black tracking-normal transition-all flex items-center">
                            <span className="text-white group-hover:text-blue-200 transition-colors duration-300">
                                TOOL
                            </span>
                            
                            {/* 콜론 영역: 로열 블루 포인트 컬러 (blue-400) 적용 */}
                            <span className="mx-2 text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300 relative -top-[2.5px]">
                                :
                            </span>
                            
                            <span className="text-white group-hover:text-blue-200 transition-colors duration-300">
                                Z
                            </span>
                        </h1>
                    </Link>

                    {/* 데스크탑 메뉴 */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        <Link href="/about" className={navLinkStyle}>About</Link>
                        <Link href="/content" className={navLinkStyle}>Content</Link>
                        
                        {session && (
                            <Link href="/dashboard" className={navLinkStyle}>Dashboard</Link>
                        )}
                        
                        {session?.user?.email === 'seouljdb@jdb.com' && (
                            <Link href="/admins" className={navLinkStyle}>Admin</Link>
                        )}

                        <div className="w-[1px] h-4 bg-white/20 mx-3" />

                        {session ? (
                            <button
                                onClick={logout}
                                className="px-5 py-2 rounded-full font-bold text-sm bg-white/10 text-slate-200 hover:bg-white hover:text-[#0a1f44] transition-all border border-white/20"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="px-6 py-2 rounded-full font-bold text-sm bg-white text-[#0a1f44] hover:bg-blue-50 transition-all shadow-md shadow-black/10"
                            >
                                Login
                            </Link>
                        )}
                    </nav>

                    {/* 모바일 버튼 */}
                    <button className="lg:hidden text-white hover:text-blue-300 transition" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.header>

            {/* 모바일 풀스크린 메뉴: 딥 로열 블루 배경 */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.nav
                        className="fixed inset-0 w-full h-screen z-[90] bg-[#0a1f44] pt-[70px]"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl font-bold">
                            <Link href="/about" className="text-slate-200 hover:text-blue-300 transition" onClick={toggleMenu}>About</Link>
                            <Link href="/content" className="text-slate-200 hover:text-blue-300 transition" onClick={toggleMenu}>Content</Link>
                            {session ? (
                                <>
                                    <Link href="/dashboard" className="text-slate-200 hover:text-blue-300 transition" onClick={toggleMenu}>Dashboard</Link>
                                    <button onClick={() => { logout(); toggleMenu(); }} className="text-blue-300 hover:text-white transition">Logout</button>
                                </>
                            ) : (
                                <Link href="/login" className="px-12 py-4 bg-white text-[#0a1f44] rounded-full shadow-lg" onClick={toggleMenu}>Login</Link>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
}