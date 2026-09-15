interface DrawboxProps {
    setIsErasing: (value: boolean) => void;
    isErasing: boolean;
    handleClear: () => void;
    handleSave: () => void;
    lineColor: string;
    setLineColor: (value: string) => void;
    eraserSize: number;
    setEraserSize: (value: number) => void;
}

export default function Drawbox({
    setIsErasing,
    isErasing,
    handleClear,
    handleSave,
    lineColor,
    setLineColor,
    eraserSize,
    setEraserSize,
}: DrawboxProps) {
    return (
        /* 카드 툴바: 오프화이트 모듈에 어울리는 흰색 카드 & 은은한 경계선 및 그림자 */
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
            {/* 그리기 버튼 */}
            <button
                onClick={() => setIsErasing(false)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    !isErasing
                        ? 'bg-[#0a1f44] text-white shadow-md shadow-[#0a1f44]/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
            >
                ✏️ 그리기
            </button>

            {/* 지우개 버튼 */}
            <button
                onClick={() => setIsErasing(true)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isErasing
                        ? 'bg-[#0a1f44] text-white shadow-md shadow-[#0a1f44]/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
            >
                🧽 지우개
            </button>

            {/* 전체 지우기 버튼 */}
            <button
                onClick={handleClear}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
            >
                🗑 전체 지우기
            </button>

            {/* 저장 버튼 (포인트 블루 스타일 적용) */}
            <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl border border-blue-600/30 bg-blue-50 text-sm font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
                💾 저장
            </button>

            {/* 옵션 패널 (선 색상 / 지우개 크기) */}
            <div className="w-[240px] h-[40px] flex items-center justify-start bg-slate-50 px-3 rounded-xl border border-slate-100">
                {!isErasing ? (
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 w-full cursor-pointer">
                        🎨 선 색상
                        <input
                            type="color"
                            value={lineColor}
                            onChange={(e) => setLineColor(e.target.value)}
                            className="w-6 h-6 border border-slate-300 rounded cursor-pointer overflow-hidden bg-transparent"
                        />
                    </label>
                ) : (
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 w-full">
                        🔧 크기
                        <input
                            type="range"
                            min={5}
                            max={50}
                            value={eraserSize}
                            onChange={(e) => setEraserSize(Number(e.target.value))}
                            className="w-full accent-[#0a1f44] cursor-pointer"
                        />
                        <span className="whitespace-nowrap text-xs font-bold text-blue-600 w-8">{eraserSize}px</span>
                    </label>
                )}
            </div>
        </div>
    );
}