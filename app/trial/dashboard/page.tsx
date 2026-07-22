'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Answer {
    clientid: string;
    answers: Record<string, number>;
    created_at: string;
}

interface UserResult {
    clientid: string;
    name: string;
    answers: Record<string, number>;
    created_at: string;
}

export default function DashboardPage() {
    const [userResults, setUserResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const router = useRouter();

    // 📥 페이지 열리면 그냥 바로 데이터 가져오기 (세션 눈치 안 봄!)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/getAnswers');
                if (!response.ok) throw new Error('서버 응답 오류');

                const text = await response.text();
                const data = text ? JSON.parse(text) : {};

                if (data.answers) {
                    const results: UserResult[] = data.answers.map((answer: Answer) => ({
                        clientid: answer.clientid,
                        name: answer.clientid,
                        answers: answer.answers,
                        created_at: answer.created_at,
                    }));

                    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                    setUserResults(results);
                }
            } catch (error) {
                console.error('데이터 로드 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewDetails = (user: UserResult) => {
        router.push(`/trial/dashboard/adminResult?clientid=${encodeURIComponent(user.clientid)}`);
    };

    const handleDelete = async (clientid: string) => {
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
        if (!confirmDelete) return;

        try {
            const response = await fetch('/api/deleteUser', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientid }),
            });

            if (!response.ok) throw new Error('삭제 실패');
            setUserResults((prev) => prev.filter((user) => user.clientid !== clientid));
        } catch (error) {
            console.error('삭제 중 오류:', error);
        }
    };

    const filteredResults = userResults.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center text-[#8C7A6B]">
                <p className="font-serif italic text-sm tracking-widest animate-pulse">Loading Client Data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 font-sans">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#383129]">상담사 대시보드</h1>

            <div className="mb-6 text-center">
                <input
                    type="text"
                    placeholder="이름/ID로 검색..."
                    className="border border-[#D8CFC4] bg-[#FCFAF7] px-4 py-2 rounded-xl w-full max-w-md focus:outline-none focus:border-[#8C7A6B]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto bg-[#FCFAF7] border border-[#E6DDD0] rounded-2xl shadow-sm">
                <table className="w-full table-auto border-collapse text-sm">
                    <thead>
                        <tr className="bg-[#F3EDE3] text-[#6E6153] border-b border-[#E6DDD0]">
                            <th className="py-3 px-4 border-r border-[#E6DDD0]">이름 (ID)</th>
                            <th className="py-3 px-4 border-r border-[#E6DDD0]">참여시간</th>
                            <th className="py-3 px-4 border-r border-[#E6DDD0]">상세보기</th>
                            <th className="py-3 px-4">삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.map((user) => {
                            const date = new Date(user.created_at);
                            const formattedTime = isNaN(date.getTime())
                                ? '시간 정보 없음'
                                : date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

                            return (
                                <tr
                                    key={user.clientid}
                                    className="text-center border-t border-[#E6DDD0] hover:bg-[#F7F4EE]/60 transition-colors"
                                >
                                    <td className="py-3 px-4 border-r border-[#E6DDD0] font-mono text-xs">
                                        {user.name}
                                    </td>
                                    <td className="py-3 px-4 border-r border-[#E6DDD0] text-xs text-[#7A6E63]">
                                        {formattedTime}
                                    </td>
                                    <td className="py-3 px-4 border-r border-[#E6DDD0]">
                                        <button
                                            onClick={() => handleViewDetails(user)}
                                            className="text-[#3A322A] font-semibold hover:underline text-xs"
                                        >
                                            상세보기
                                        </button>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleDelete(user.clientid)}
                                            className="text-red-500 hover:underline text-xs"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredResults.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-8 text-center text-gray-400"
                                >
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
