// 검사 점수 계산 (순수 함수 — 화면/DB와 분리해 단위 테스트한다: app/lib/scoring.test.ts)

// ---------------------------------------------------------------------
// 에니어그램 공통
// ---------------------------------------------------------------------
export const integrationMap: Record<string, string> = {
    '1': '7',
    '2': '4',
    '3': '6',
    '4': '1',
    '5': '8',
    '6': '9',
    '7': '5',
    '8': '2',
    '9': '3',
};

export const disintegrationMap: Record<string, string> = {
    '1': '4',
    '2': '8',
    '3': '9',
    '4': '2',
    '5': '7',
    '6': '3',
    '7': '1',
    '8': '5',
    '9': '6',
};

export type EnneagramResult = {
    type: string;
    wing: string;
    integration: string;
    disintegration: string;
};

// ---------------------------------------------------------------------
// 성격유형 검사 (구버전): 문항 id가 a1~i9, 카테고리 문자(A~I)를 에니어그램 번호로 매핑
// ---------------------------------------------------------------------
const PERSONALITY_V1_CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] as const;

// 카테고리 문자 → 에니어그램 번호 (D->2, E->3, F->4, A->5, B->6, C->7, G->8, H->9, I->1)
export const personalityV1Mapping: Record<string, string> = {
    D: '2',
    E: '3',
    F: '4',
    A: '5',
    B: '6',
    C: '7',
    G: '8',
    H: '9',
    I: '1',
};

export function scorePersonalityV1(answers: Record<string, number>) {
    const scores: Record<string, number> = {};
    for (const category of PERSONALITY_V1_CATEGORIES) {
        scores[category] = 0;
        for (let i = 1; i <= 9; i++) {
            scores[category] += answers[`${category.toLowerCase()}${i}`] || 0;
        }
    }

    // 점수가 높은 순서로 정렬하여 주 유형 결정
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const type = personalityV1Mapping[sortedScores[0][0]];

    // 날개: 주 유형 양옆 번호 중 점수가 높은 것
    const wingCandidates = [
        ((parseInt(type) + 8) % 9 || 9).toString(), // 왼쪽 날개 (예: 3 -> 2)
        ((parseInt(type) % 9) + 1).toString(), // 오른쪽 날개 (예: 3 -> 4)
    ];
    const wing =
        sortedScores
            .map(([letter, score]) => [personalityV1Mapping[letter], score] as [string, number])
            .filter(([t]) => wingCandidates.includes(t))
            .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

    const result: EnneagramResult = {
        type,
        wing,
        integration: integrationMap[type],
        disintegration: disintegrationMap[type],
    };
    return { scores, ...result };
}

// ---------------------------------------------------------------------
// 성격유형 검사 (신버전): 문항 id가 t{번호}_{순번}, scoreIncluded=false 또는 num='※' 문항은 제외
// ---------------------------------------------------------------------
export type PersonalityV2Question = {
    id: string;
    num: string;
    scoreIncluded?: boolean;
};

function getTypeFromQuestionId(questionId: string): string {
    return questionId.split('_')[0].replace('t', ''); // t8_1 -> 8
}

export function calculateCategoryScores(
    answers: Record<string, number>,
    questions: PersonalityV2Question[]
): Record<string, number> {
    const scores: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };

    for (const question of questions) {
        if (question.scoreIncluded === false || question.num === '※') continue;
        const value = answers[question.id];
        if (typeof value !== 'number') continue;
        const type = getTypeFromQuestionId(question.id);
        if (scores[type] != null) scores[type] += value;
    }
    return scores;
}

export function getWingType(primaryType: string, scores: Record<string, number>): string {
    const typeNum = parseInt(primaryType, 10);
    const leftWing = typeNum === 1 ? '9' : String(typeNum - 1);
    const rightWing = typeNum === 9 ? '1' : String(typeNum + 1);
    return scores[leftWing] >= scores[rightWing] ? leftWing : rightWing;
}

export function scorePersonalityV2(answers: Record<string, number>, questions: PersonalityV2Question[]) {
    const scores = calculateCategoryScores(answers, questions);
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const type = sortedScores[0]?.[0] ?? '';

    const result: EnneagramResult = {
        type,
        wing: type ? getWingType(type, scores) : '',
        integration: type ? integrationMap[type] : '',
        disintegration: type ? disintegrationMap[type] : '',
    };
    return { scores, ...result };
}

// ---------------------------------------------------------------------
// 애착유형 검사: 짝수 문항 = 불안, 홀수 문항 = 회피, 역채점 문항은 6 - 점수
// 컷오프 54점 (18문항 × 3점) 이상이면 높음
// ---------------------------------------------------------------------
export const ATTACHMENT_REVERSE_ITEMS = [3, 15, 19, 22, 25, 27, 29, 33];
export const ATTACHMENT_CUTOFF = 54;

export type AttachmentType = '안정형' | '불안형' | '거부회피형' | '공포회피형';

export function scoreAttachment(answers: Record<string, number>, questions: { id: string; num: number }[]) {
    let anxietyScore = 0;
    let avoidanceScore = 0;

    for (const q of questions) {
        const answerValue = answers[q.id];
        if (!answerValue) continue;

        const score = ATTACHMENT_REVERSE_ITEMS.includes(q.num) ? 6 - answerValue : answerValue;
        if (q.num % 2 === 0) anxietyScore += score;
        else avoidanceScore += score;
    }

    const highAnxiety = anxietyScore >= ATTACHMENT_CUTOFF;
    const highAvoidance = avoidanceScore >= ATTACHMENT_CUTOFF;
    const type: AttachmentType =
        highAnxiety && highAvoidance
            ? '공포회피형'
            : highAnxiety
              ? '불안형'
              : highAvoidance
                ? '거부회피형'
                : '안정형';

    return { anxietyScore, avoidanceScore, type };
}

// ---------------------------------------------------------------------
// 체험 감정 검사(향수): URL의 "문항id-점수,문항id-점수" 문자열에서 가장 점수가 높은 향수 번호
// 동점이면 먼저 나온 번호, 응답이 없으면 1
// ---------------------------------------------------------------------
export function pickWinningPerfume(answersParam: string, questions: { id: string; typeNumber: number }[]): number {
    const scores: Record<number, number> = {};

    answersParam.split(',').forEach((item) => {
        const [qId, scoreStr] = item.split('-');
        const score = parseInt(scoreStr, 10);
        const foundQ = questions.find((q) => q.id === qId);
        if (foundQ && !Number.isNaN(score)) {
            scores[foundQ.typeNumber] = (scores[foundQ.typeNumber] || 0) + score;
        }
    });

    let maxScore = -1;
    let winningId = 1;
    Object.entries(scores).forEach(([pId, totalScore]) => {
        if (totalScore > maxScore) {
            maxScore = totalScore;
            winningId = Number(pId);
        }
    });
    return winningId;
}

// ---------------------------------------------------------------------
// 체험 검사 관리자 결과: 문항 id 첫 글자(대문자)별 합계와 최고 점수 그룹
// ---------------------------------------------------------------------
export function scoreTrialAnswers(answers: Record<string, number> | null | undefined) {
    const scores: Record<string, number> = {};

    Object.entries(answers || {}).forEach(([questionId, score]) => {
        if (questionId && typeof score === 'number') {
            const group = questionId[0].toUpperCase();
            scores[group] = (scores[group] || 0) + score;
        }
    });

    const maxType = Object.entries(scores).reduce<{ type: string; score: number }>(
        (prev, [type, score]) => (prev.score > score ? prev : { type, score }),
        { type: '', score: 0 }
    );

    return { maxType, scores };
}
