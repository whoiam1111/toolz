'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] text-gray-400 py-16 border-t border-white/5 relative overflow-hidden">
            {/* 하단 은은한 오렌지 광원 효과 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-orange-600/50 to-transparent" />
            
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
                    
                    {/* 브랜드 정보 */}
                    <div className="text-center md:text-left space-y-4">
                        <div className="flex items-center justify-center md:justify-start gap-1">
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Tool</span>
                            <span className="text-2xl font-black text-orange-600">:</span>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase">Z</span>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed font-light break-keep">
                            도구를 통해 삶의 본질을 설계합니다.<br />
                            A부터 Z까지, 당신의 성장을 위한 모든 툴, **TOOL:Z**.
                        </p>
                    </div>

                    {/* 연락처 및 주소 */}
                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <div className="flex items-center gap-3 text-sm group transition-colors hover:text-white">
                            <MapPin size={18} className="text-orange-600" />
                            <span>서울 노원구 화랑로 453, 5층</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm group transition-colors hover:text-white">
                            <Mail size={18} className="text-orange-600" />
                            <a href="mailto:contact@toolz.kr" className="hover:underline underline-offset-4 font-medium">
                                contact@toolz.kr
                            </a>
                        </div>

                        {/* 소셜 아이콘 */}
                        <div className="flex gap-4 pt-4">
                            <Link href="https://instagram.com" target="_blank" className="p-2.5 bg-white/5 rounded-xl hover:bg-orange-600 hover:text-white transition-all border border-white/5">
                                <Instagram size={18} />
                            </Link>
                            <Link href="https://youtube.com" target="_blank" className="p-2.5 bg-white/5 rounded-xl hover:bg-orange-600 hover:text-white transition-all border border-white/5">
                                <Youtube size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 저작권 표시 */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] tracking-wider text-gray-500 font-light">
                    <p>© 2022-2026 TOOL:Z. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-orange-500 transition-colors">개인정보처리방침</Link>
                        <Link href="/terms" className="hover:text-orange-500 transition-colors">이용약관</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}