// components/LoadingSpinner.tsx
export default function LoadingSpinner() {
    return (
        /* 전체 배경: 오프화이트 톤 (#f8fafc) */
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] px-4">
            {/* 스피너 아이콘: 딥 로열 블루 (#0a1f44) 적용 */}
            <svg
                className="animate-spin h-12 w-12 text-[#0a1f44] mb-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <p className="text-lg text-[#0a1f44] font-bold tracking-tight">권한 확인 중입니다...</p>
        </div>
    );
}