'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        /* 전체 푸터 배경: 딥 로열 블루 톤 (#0a1f44) */
        <footer className="bg-[#0a1f44] text-slate-300 py-16 border-t border-white/10 relative overflow-hidden">
            {/* 하단 은은한 블루 광원 선 효과 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
            
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
                    
                    {/* 브랜드 정보 */}
                    <div className="text-center md:text-left space-y-4">
                        <div className="flex items-center justify-center md:justify-start gap-1">
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Tool</span>
                            <span className="text-2xl font-black text-blue-400">:</span>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase">Z</span>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed font-normal text-slate-300 break-keep">
                            도구를 통해 삶의 본질을 설계합니다.<br />
                            A부터 Z까지, 당신의 성장을 위한 모든 툴, <strong className="font-bold text-white">TOOL:Z</strong>.
                        </p>
                    </div>

                    {/* 연락처 및 주소 */}
                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <div className="flex items-center gap-3 text-sm text-slate-300 group transition-colors hover:text-white">
                            <MapPin size={18} className="text-blue-400" />
                            <span>서울 노원구 화랑로 453, 5층</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-slate-300 group transition-colors hover:text-white">
                            <Mail size={18} className="text-blue-400" />
                            <a href="mailto:contact@toolz.kr" className="hover:underline underline-offset-4 font-medium">
                                contact@toolz.kr
                            </a>
                        </div>

                        {/* 소셜 아이콘 (순수 SVG로 교체하여 Deprecated 취소선 문제 완벽 해결) */}
                        <div className="flex gap-4 pt-4">
                            <Link 
                                href="https://instagram.com" 
                                target="_blank" 
                                aria-label="Instagram"
                                className="p-2.5 bg-white/10 text-slate-200 rounded-xl hover:bg-white hover:text-[#0a1f44] transition-all border border-white/10 shadow-sm"
                            >
                                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </Link>
                            <Link 
                                href="https://youtube.com" 
                                target="_blank" 
                                aria-label="YouTube"
                                className="p-2.5 bg-white/10 text-slate-200 rounded-xl hover:bg-white hover:text-[#0a1f44] transition-all border border-white/10 shadow-sm"
                            >
                                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 저작권 표시 */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] tracking-wider text-slate-400 font-normal">
                    <p>© 2022-2026 TOOL:Z. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-blue-300 transition-colors">개인정보처리방침</Link>
                        <Link href="/terms" className="hover:text-blue-300 transition-colors">이용약관</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}