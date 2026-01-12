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
            // 스크롤이 조금이라도 되면 그림자와 테두리를 추가
            setScrolling(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navLinkStyle = "px-4 py-2 rounded-full font-medium text-gray-400 transition-all duration-300 hover:text-white hover:bg-white/5";

    return (
        <>
            <motion.header
                className={`fixed h-[70px] top-0 left-0 w-full z-[100] transition-all duration-300 ease-in-out ${
                    // 처음부터 배경색 [#0f0f0f] 적용, 스크롤 시 그림자와 하단 선 추가
                    scrolling 
                    ? 'bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/10 shadow-2xl' 
                    : 'bg-[#0f0f0f] border-b border-transparent'
                }`}
            >
                <div className="container mx-auto h-full flex justify-between items-center px-6">
                    {/* 로고 영역 */}
                    <Link className="flex items-center group" href="/">
                        <h1 className="text-2xl font-black tracking-normal transition-all flex items-center">
                            <span className="text-white group-hover:text-orange-500 transition-colors duration-300">
                                TOOL
                            </span>
                            
                            {/* 콜론 영역: text-3xl로 키우고 위치를 미세하게 조정했습니다 */}
                            <span className="mx-2 text-3xl text-orange-600 group-hover:text-orange-400 transition-colors duration-300 relative -top-[2.5px]">
                                :
                            </span>
                            
                            <span className="text-white group-hover:text-orange-500 transition-colors duration-300">
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

                        <div className="w-[1px] h-4 bg-white/10 mx-3" />

                        {session ? (
                            <button
                                onClick={logout}
                                className="px-5 py-2 rounded-xl font-bold text-sm bg-white/5 text-gray-300 hover:bg-orange-600 hover:text-white transition-all border border-white/10"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="px-6 py-2 rounded-xl font-bold text-sm bg-orange-600 text-white hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20"
                            >
                                Login
                            </Link>
                        )}
                    </nav>

                    {/* 모바일 버튼 */}
                    <button className="lg:hidden text-white" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.header>

            {/* 모바일 풀스크린 메뉴 */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.nav
                        className="fixed inset-0 w-full h-screen z-[90] bg-[#0f0f0f] pt-[70px]"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl font-bold">
                            <Link href="/about" className="text-gray-300 hover:text-orange-500" onClick={toggleMenu}>About</Link>
                            <Link href="/content" className="text-gray-300 hover:text-orange-500" onClick={toggleMenu}>Content</Link>
                            {session ? (
                                <>
                                    <Link href="/dashboard" className="text-gray-300 hover:text-orange-500" onClick={toggleMenu}>Dashboard</Link>
                                    <button onClick={() => { logout(); toggleMenu(); }} className="text-orange-500">Logout</button>
                                </>
                            ) : (
                                <Link href="/login" className="px-12 py-4 bg-orange-600 text-white rounded-2xl" onClick={toggleMenu}>Login</Link>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
}