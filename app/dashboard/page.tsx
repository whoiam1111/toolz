'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getParticipants, deleteParticipant } from '../api/supabaseApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, List, Eye, Trash2, Search, X } from 'lucide-react';

type Participant = {
    id: string;
    name: string;
    birth_date: string;
    stress: string;
    religion: string;
};

export default function Dashboard() {
    const [participant, setParticipant] = useState<Participant[]>([]);
    const [showList, setShowList] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (showList) fetchParticipant();
    }, [showList]);

    const fetchParticipant = async () => {
        const { data, error } = await getParticipants();
        if (error) {
            console.error(error);
        } else {
            setParticipant(data ?? []);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        const { error } = await deleteParticipant(id);
        if (error) {
            console.error('삭제 오류:', error.message);
            alert('삭제에 실패했습니다.');
        } else {
            setParticipant((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const filteredParticipants = participant.filter((p) => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#0f0f0f] text-white p-6 md:p-12 selection:bg-orange-500/30">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 섹션 */}
                <header className="mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black tracking-tighter mb-2"
                    >
                        Management <span className="text-orange-500">System</span>
                    </motion.h1>
                    <p className="text-gray-500 font-light italic">코칭 대상자 데이터베이스 관리 도구</p>
                </header>

                {/* 컨트롤 바 */}
                <section className="flex flex-wrap gap-4 mb-10">
                    <button
                        onClick={() => router.push('/dashboard/participant/new')}
                        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-4 rounded-2xl shadow-xl shadow-orange-900/20 transition-all active:scale-95"
                    >
                        <Plus size={20} strokeWidth={3} />
                        대상자 추가
                    </button>

                    <button
                        onClick={() => setShowList((prev) => !prev)}
                        className={`flex items-center gap-2 font-bold px-6 py-4 rounded-2xl border transition-all active:scale-95 ${
                            showList 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-[#151515] border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                        }`}
                    >
                        {showList ? <X size={20} /> : <List size={20} />}
                        {showList ? '목록 숨기기' : '전체 목록 보기'}
                    </button>
                </section>

                {/* 리스트 영역 */}
                <AnimatePresence>
                    {showList && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="space-y-6"
                        >
                            {/* 검색창 */}
                            <div className="relative max-w-md group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="search"
                                    placeholder="대상자 이름 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#151515] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-700"
                                />
                            </div>

                            {/* 테이블 */}
                            <div className="bg-[#151515] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
                                                <th className="py-5 px-8">이름</th>
                                                <th className="py-5 px-8 hidden md:table-cell">생년월일</th>
                                                <th className="py-5 px-8 hidden md:table-cell">스트레스 요인</th>
                                                <th className="py-5 px-8 hidden md:table-cell">사는곳(동)</th>
                                                <th className="py-5 px-8 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredParticipants.length > 0 ? (
                                                filteredParticipants.map((p) => (
                                                    <tr
                                                        key={p.id}
                                                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                                        onClick={() => router.push(`/dashboard/participant/${p.id}`)}
                                                    >
                                                        <td className="py-6 px-8 font-bold text-gray-200">{p.name}</td>
                                                        <td className="py-6 px-8 text-gray-500 hidden md:table-cell font-light">{p.birth_date}</td>
                                                        <td className="py-6 px-8 text-gray-500 hidden md:table-cell font-light max-w-[200px] truncate">{p.stress}</td>
                                                        <td className="py-6 px-8 text-gray-500 hidden md:table-cell font-light">{p.religion}</td>
                                                        <td className="py-6 px-8">
                                                            <div className="flex justify-center gap-2">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/participant/${p.id}`); }}
                                                                    className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:bg-orange-600 hover:text-white transition-all"
                                                                    title="상세보기"
                                                                >
                                                                    <Eye size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                                                                    className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:bg-red-600/20 hover:text-red-500 transition-all"
                                                                    title="삭제"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-20 text-gray-600 italic font-light">
                                                        검색된 대상자가 없습니다.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}