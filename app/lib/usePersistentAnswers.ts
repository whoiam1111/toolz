'use client';

import { useCallback, useEffect, useState } from 'react';

// 검사 응답을 localStorage에 임시 저장/복원하는 훅 (새로고침해도 진행 중인 답변 유지)
export function usePersistentAnswers(storageKey: string) {
    const [answers, setAnswers] = useState<Record<string, number>>({});

    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            // 서버 렌더링 결과와 맞추기 위해 하이드레이션 이후에 복원해야 하므로 effect 안에서 setState 한다
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (saved) setAnswers(JSON.parse(saved));
        } catch {
            // 손상된 값이나 localStorage를 쓸 수 없는 환경은 무시
        }
    }, [storageKey]);

    const setAnswer = useCallback(
        (questionId: string, value: number) => {
            setAnswers((prev) => {
                const updated = { ...prev, [questionId]: value };
                try {
                    localStorage.setItem(storageKey, JSON.stringify(updated));
                } catch {
                    // 저장 실패는 무시 (메모리 상태는 유지)
                }
                return updated;
            });
        },
        [storageKey]
    );

    const clear = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
        } catch {
            // 무시
        }
    }, [storageKey]);

    return { answers, setAnswer, clear };
}
