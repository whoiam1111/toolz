import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTrialClientId, loadAndSaveZoneResult, trialDisplayName } from './trialClient';

function createMemoryStorage() {
    const store = new Map<string, string>();
    return {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => void store.set(key, value),
        removeItem: (key: string) => void store.delete(key),
    };
}

describe('trialDisplayName', () => {
    it('식별용 접미사(#6자)를 떼고 이름만 보여준다', () => {
        expect(trialDisplayName('홍길동#ab12cd')).toBe('홍길동');
    });

    it('예전 형식(이름만 저장된 값)은 그대로 둔다', () => {
        expect(trialDisplayName('홍길동')).toBe('홍길동');
        expect(trialDisplayName('홍#길동')).toBe('홍#길동');
    });
});

describe('getTrialClientId', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', createMemoryStorage());
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('"이름#임의6자" 형식을 만들고, 같은 브라우저에서 같은 이름이면 재사용한다', () => {
        const first = getTrialClientId(' 홍길동 ');
        expect(first).toMatch(/^홍길동#[a-z0-9]{6}$/);
        expect(getTrialClientId('홍길동')).toBe(first);
    });

    it('다른 이름은 다른 값을 받는다', () => {
        expect(getTrialClientId('홍길동')).not.toBe(getTrialClientId('김철수'));
    });

    it('localStorage를 쓸 수 없어도 동작한다', () => {
        vi.stubGlobal('localStorage', undefined);
        expect(getTrialClientId('홍길동')).toMatch(/^홍길동#[a-z0-9]{6}$/);
    });
});

describe('loadAndSaveZoneResult', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', createMemoryStorage());
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('영역별 결과를 누적 저장하고, 응답이 없으면 저장된 값만 읽는다', () => {
        // g2: 열정가(7), e3: 탐구자(5) — app/lib/data.ts
        expect(loadAndSaveZoneResult('홍길동#aaaaaa', 'heart', 'g2-5,e3-1')).toEqual({ heart: 7 });
        expect(loadAndSaveZoneResult('홍길동#aaaaaa', 'head', 'g2-1,e3-5')).toEqual({ heart: 7, head: 5 });
        expect(loadAndSaveZoneResult('홍길동#aaaaaa', 'gut', null)).toEqual({ heart: 7, head: 5 });
    });

    it('손상된 저장값은 무시한다', () => {
        localStorage.setItem('perfume_x', '{not json');
        expect(loadAndSaveZoneResult('x', 'heart', null)).toEqual({});
    });
});
