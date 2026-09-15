'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCounselorAccount } from '@/app/api/supabaseApi';
import { User, MapPin, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';

export default function CreateCounselorPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [region, setRegion] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreateCounselor = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            setMessage('모든 필수 항목을 입력해 주세요.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const result = await createCounselorAccount(email, password, name, region);
            setMessage(result.message);

            if (result.success) {
                alert('코치 계정이 성공적으로 생성되었습니다.');
                setEmail('');
                setPassword('');
                setName('');
                setRegion('');
                router.push('/admins');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                setMessage('계정 생성 중 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        /* 전체 컨테이너: 오프화이트 배경 상의 카드 모듈 */
        <div className="min-h-[80vh] bg-[#f8fafc] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 space-y-6">
                {/* 헤더 타이틀 */}
                <div className="text-center border-b border-slate-100 pb-6">
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest block mb-2">
                        Admin Portal
                    </span>
                    <h1 className="text-2xl font-black text-[#0a1f44] tracking-tight">코치 계정 생성</h1>
                    <p className="text-xs text-slate-400 mt-1 font-normal">
                        신규 코치 계정 프로필 및 접속 권한을 설정합니다.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* 이름 입력 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            이름
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="코치 성함을 입력하세요"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a1f44] focus:ring-1 focus:ring-[#0a1f44] transition-all bg-slate-50/50"
                            />
                        </div>
                    </div>

                    {/* 지역 선택 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            담당 지역 / 공동체
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <MapPin size={18} />
                            </div>
                            <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#0a1f44] focus:ring-1 focus:ring-[#0a1f44] transition-all bg-slate-50/50 appearance-none cursor-pointer"
                            >
                                <option value="">지역 선택</option>
                                <option value="도봉">도봉</option>
                                <option value="성북">성북</option>
                                <option value="노원">노원</option>
                                <option value="중랑">중랑</option>
                                <option value="강북">강북</option>
                                <option value="대학">대학</option>
                                <option value="새신자">새신자</option>
                            </select>
                        </div>
                    </div>

                    {/* 이메일 입력 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            이메일 주소
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="example@toolz.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a1f44] focus:ring-1 focus:ring-[#0a1f44] transition-all bg-slate-50/50"
                            />
                        </div>
                    </div>

                    {/* 비밀번호 입력 */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            비밀번호
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a1f44] focus:ring-1 focus:ring-[#0a1f44] transition-all bg-slate-50/50"
                            />
                        </div>
                    </div>

                    {/* 메시지 출력 영역 */}
                    {message && (
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs font-medium text-amber-800">
                            <AlertCircle size={16} className="text-amber-600 shrink-0" />
                            <span>{message}</span>
                        </div>
                    )}

                    {/* 계정 생성 버튼 */}
                    <button
                        onClick={handleCreateCounselor}
                        disabled={loading}
                        className="w-full bg-[#0a1f44] text-white py-4 rounded-xl font-bold text-base hover:bg-[#0d2857] active:scale-[0.99] transition-all shadow-md shadow-[#0a1f44]/10 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    >
                        <UserPlus size={18} />
                        {loading ? '생성 처리 중...' : '계정 생성하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}