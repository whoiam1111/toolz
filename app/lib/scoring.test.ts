import { describe, expect, it } from 'vitest';
import { attachmentQuestions } from './question';
import {
    getWingType,
    pickWinningPerfume,
    scoreAttachment,
    scorePersonalityV1,
    scorePersonalityV2,
    scoreTrialAnswers,
} from './scoring';

// 모든 문항에 같은 점수, 또는 문항 번호별로 점수를 정하는 헬퍼
const answerAttachment = (pick: (num: number) => number) =>
    Object.fromEntries(attachmentQuestions.map((q) => [q.id, pick(q.num)]));

const REVERSE = new Set([3, 15, 19, 22, 25, 27, 29, 33]);

describe('scoreAttachment (애착유형)', () => {
    it('36문항이 불안(짝수) 18개, 회피(홀수) 18개로 나뉜다', () => {
        expect(attachmentQuestions).toHaveLength(36);
    });

    it('모두 3점이면 두 척도 모두 컷오프(54)와 같아 공포회피형', () => {
        const result = scoreAttachment(answerAttachment(() => 3), attachmentQuestions);
        expect(result).toEqual({ anxietyScore: 54, avoidanceScore: 54, type: '공포회피형' });
    });

    it('모두 1점이면 역채점 문항만 5점이 되어 안정형', () => {
        // 불안: 일반 17개 × 1 + 역채점(22번) 5 = 22 / 회피: 일반 11개 × 1 + 역채점 7개 × 5 = 46
        const result = scoreAttachment(answerAttachment(() => 1), attachmentQuestions);
        expect(result).toEqual({ anxietyScore: 22, avoidanceScore: 46, type: '안정형' });
    });

    it('불안 문항만 높으면 불안형', () => {
        // 짝수 문항은 실제 점수 5가 되게, 홀수 문항은 1이 되게 (역채점 문항은 반대로 응답)
        const answers = answerAttachment((num) => {
            const wantHigh = num % 2 === 0;
            const value = wantHigh ? 5 : 1;
            return REVERSE.has(num) ? 6 - value : value;
        });
        expect(scoreAttachment(answers, attachmentQuestions)).toEqual({
            anxietyScore: 90,
            avoidanceScore: 18,
            type: '불안형',
        });
    });

    it('회피 문항만 높으면 거부회피형 (결과 화면의 설명 데이터 키와 같은 이름)', () => {
        const answers = answerAttachment((num) => {
            const wantHigh = num % 2 === 1;
            const value = wantHigh ? 5 : 1;
            return REVERSE.has(num) ? 6 - value : value;
        });
        expect(scoreAttachment(answers, attachmentQuestions)).toEqual({
            anxietyScore: 18,
            avoidanceScore: 90,
            type: '거부회피형',
        });
    });

    it('응답하지 않은 문항은 점수에서 빠진다', () => {
        expect(scoreAttachment({}, attachmentQuestions)).toEqual({
            anxietyScore: 0,
            avoidanceScore: 0,
            type: '안정형',
        });
    });
});

describe('scorePersonalityV1 (성격유형 구버전)', () => {
    it('카테고리 문자를 에니어그램 번호로 바꾸고 날개/통합/분열을 계산한다', () => {
        const answers: Record<string, number> = {};
        for (let i = 1; i <= 9; i++) answers[`c${i}`] = 5; // C → 7번 유형, 45점
        answers.g1 = 3; // G → 8번 (7의 오른쪽 날개)
        answers.b1 = 1; // B → 6번 (7의 왼쪽 날개)

        const result = scorePersonalityV1(answers);
        expect(result.scores.C).toBe(45);
        expect(result).toMatchObject({ type: '7', wing: '8', integration: '5', disintegration: '1' });
    });

    it('1번 유형의 날개 후보는 9번과 2번이다', () => {
        const answers: Record<string, number> = { i1: 5, i2: 5, h1: 4, d1: 1 }; // I→1, H→9, D→2
        expect(scorePersonalityV1(answers)).toMatchObject({ type: '1', wing: '9' });
    });
});

describe('scorePersonalityV2 (성격유형 신버전)', () => {
    const questions = [
        { id: 't8_1', num: '1' },
        { id: 't8_2', num: '2' },
        { id: 't8_rev', num: '※', scoreIncluded: false },
        { id: 't7_1', num: '1' },
        { id: 't9_1', num: '1' },
    ];

    it('※ 문항과 scoreIncluded=false 문항은 점수에서 제외한다', () => {
        const result = scorePersonalityV2({ t8_1: 5, t8_2: 4, t8_rev: 5, t7_1: 2, t9_1: 3 }, questions);
        expect(result.scores['8']).toBe(9);
        expect(result).toMatchObject({ type: '8', wing: '9', integration: '2', disintegration: '5' });
    });

    it('날개 점수가 같으면 왼쪽(번호가 작은 쪽) 날개를 고른다', () => {
        expect(getWingType('8', { '7': 3, '9': 3 })).toBe('7');
        expect(getWingType('1', { '9': 2, '2': 2 })).toBe('9');
    });
});

describe('pickWinningPerfume (체험 감정 검사)', () => {
    const questions = [
        { id: 'g2', typeNumber: 7 },
        { id: 'e3', typeNumber: 5 },
        { id: 'g5', typeNumber: 7 },
    ];

    it('같은 향수 번호의 점수를 합산해 가장 높은 번호를 고른다', () => {
        expect(pickWinningPerfume('g2-3,e3-5,g5-4', questions)).toBe(7);
    });

    it('동점이면 번호가 작은 향수를 고른다', () => {
        expect(pickWinningPerfume('g2-3,e3-3', questions)).toBe(5);
    });

    it('응답이 비었거나 잘못된 값은 무시하고 기본값 1을 반환한다', () => {
        expect(pickWinningPerfume('', questions)).toBe(1);
        expect(pickWinningPerfume('zz-5,g2-abc', questions)).toBe(1);
    });
});

describe('scoreTrialAnswers (체험 검사 관리자 결과)', () => {
    it('문항 id 첫 글자별로 합산하고 최고 점수 그룹을 찾는다', () => {
        expect(scoreTrialAnswers({ a1: 3, a2: 2, b1: 4 })).toEqual({
            scores: { A: 5, B: 4 },
            maxType: { type: 'A', score: 5 },
        });
    });

    it('응답이 없으면 빈 결과', () => {
        expect(scoreTrialAnswers(null)).toEqual({ scores: {}, maxType: { type: '', score: 0 } });
    });
});
