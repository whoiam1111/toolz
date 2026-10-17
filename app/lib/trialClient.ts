
import { questions } from './data';
import { pickWinningPerfume } from './scoring';

// 체험 검사 응답자 식별값(clientid)
//
// 234 / 567 / 891 문항 검사를 서로 다른 QR 또는 기기에서 진행하더라도
// 동일한 이름이면 같은 clientid를 사용한다.
// 그래야 서버의 insertAnswers()가 기존 답변에 새 답변을 병합할 수 있다.
//
// 주의: 이름이 같은 서로 다른 참여자는 하나로 합쳐진다.

export function getTrialClientId(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
}

export type TrialZone = 'head' | 'heart' | 'gut';

export type ZoneResults = Partial<Record<TrialZone, number>>;

// 브라우저에 저장된 영역별 향수 결과를 읽고,
// 이번 응답이 있으면 해당 영역 결과를 갱신한다.
export function loadAndSaveZoneResult(
    clientid: string,
    zone: TrialZone,
    answersParam: string | null
): ZoneResults {
    const key = `perfume_${clientid}`;

    let saved: ZoneResults = {};

    try {
        saved = JSON.parse(localStorage.getItem(key) || '{}');
    } catch {
        // 손상된 값은 무시하고 새로 시작한다.
        saved = {};
    }

    if (answersParam) {
        saved = {
            ...saved,
            [zone]: pickWinningPerfume(answersParam, questions),
        };

        try {
            localStorage.setItem(key, JSON.stringify(saved));
        } catch {
            // 브라우저 저장에 실패해도 이번 결과 표시에는 영향을 주지 않는다.
        }
    }

    return saved;
}

// 화면 표시용 이름
// 과거에 사용하던 이름#랜덤접미사 형식의 ID도 처리한다.
export function trialDisplayName(clientid: string): string {
    return clientid.replace(/#[a-zA-Z0-9]{6}$/, '');
}
