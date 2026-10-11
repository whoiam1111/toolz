import { questions } from './data';
import { pickWinningPerfume } from './scoring';

// 체험 검사 응답자 식별값(clientid)
// 예전에는 입력한 이름을 그대로 써서 동명이인의 응답이 한 행에 합쳐졌다.
// 이제 "이름#임의6자" 형식으로 만들고, 같은 브라우저에서 같은 이름이면 같은 값을 재사용한다
// (head/heart/gut 영역 결과를 한 사람의 기록으로 모으기 위해).

const STORAGE_KEY = 'toolz_trial_clients';
const SUFFIX_PATTERN = /#[a-z0-9]{6}$/;

function randomSuffix() {
    return Math.random().toString(36).slice(2, 8).padEnd(6, '0');
}

export function getTrialClientId(name: string): string {
    const trimmed = name.trim();
    let saved: Record<string, string> = {};
    try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
        // localStorage를 쓸 수 없는 환경(사파리 비공개 모드 등)에서는 매번 새로 만든다
    }

    if (saved[trimmed]) return saved[trimmed];

    const clientid = `${trimmed}#${randomSuffix()}`;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, [trimmed]: clientid }));
    } catch {
        // 저장 실패는 무시
    }
    return clientid;
}

export type TrialZone = 'head' | 'heart' | 'gut';
export type ZoneResults = Partial<Record<TrialZone, number>>;

// 브라우저에 저장된 영역별 향수 결과를 읽고, 이번 응답(answersParam)이 있으면 해당 영역 결과를 갱신해 저장
export function loadAndSaveZoneResult(clientid: string, zone: TrialZone, answersParam: string | null): ZoneResults {
    const key = `perfume_${clientid}`;
    let saved: ZoneResults = {};
    try {
        saved = JSON.parse(localStorage.getItem(key) || '{}');
    } catch {
        // 손상된 값은 무시하고 새로 시작
    }

    if (answersParam) {
        saved = { ...saved, [zone]: pickWinningPerfume(answersParam, questions) };
        try {
            localStorage.setItem(key, JSON.stringify(saved));
        } catch {
            // 저장 실패는 무시 (화면에는 이번 결과가 표시됨)
        }
    }
    return saved;
}

// 화면 표시용 이름 (예전 형식의 clientid는 그대로 반환)
export function trialDisplayName(clientid: string): string {
    return clientid.replace(SUFFIX_PATTERN, '');
}
