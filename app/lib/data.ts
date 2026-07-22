export interface RawQuestion {
    id: string;
    type: string;
    question: string;
}

export interface Question extends RawQuestion {
    zone: 'heart' | 'head' | 'gut';
    typeNumber: number;
}

// 유형명 -> 향수 번호 매핑
export const TYPE_TO_NUMBER: Record<string, number> = {
    개혁가: 1,
    조력자: 2,
    성취자: 3,
    예술가: 4,
    탐구자: 5,
    '충실한 유형': 6,
    열정가: 7,
    지도자: 8,
    평화주의자: 9,
};

// Raw 질문 목록
const rawQuestions: RawQuestion[] = [
    { id: 'g2', type: '열정가', question: '나는 새로운 것을 체험할 때 기쁨을 느낀다' },
    { id: 'e3', type: '탐구자', question: '나는 감정적으로 에너지 낭비하는게 싫다' },
    { id: 'd1', type: '예술가', question: '나는 감정기복이 심해 금방 우울해진다' },
    { id: 'h1', type: '지도자', question: '나는 주도적이고 자기주장이 강한 편이다' },
    { id: 'a2', type: '개혁가', question: '나는 실수를 하면 스스로를 비판한다.' },
    { id: 'f1', type: '충실한 유형', question: '나는 안전에 초점을 두고 행동하는 편이다' },
    { id: 'c3', type: '성취자', question: '나는 능력 있는 사람으로 보이기 위해 이미지를 관리한다' },
    { id: 'h3', type: '지도자', question: '나는 감정을 절제하기 보다는 표출하는게 더 시원하다' },
    { id: 'b2', type: '조력자', question: '나는 호감을 사기 위해서는 손해를 봐도 좋다고 생각한다' },
    { id: 'i2', type: '평화주의자', question: '나는 다툼을 피하기 위해 문제를 덮어두는 경향이 있다' },
    { id: 'c1', type: '성취자', question: '나는 성공하고 싶다는 욕구가 강해서 끊임없이 노력한다' },
    { id: 'a3', type: '개혁가', question: '나는 규칙과 원칙을 중요하게 여긴다.' },
    { id: 'e2', type: '탐구자', question: '나는 아는 것이 힘이고 정보가 돈이라고 생각한다' },
    { id: 'i3', type: '평화주의자', question: '나는 겉으로는 우유부단 하지만 속으로는 내 고집이 있다' },
    { id: 'g3', type: '열정가', question: '나는 힘들고 괴로우면 피하고 싶다' },
    { id: 'd2', type: '예술가', question: '내 기분에 따라 의사결정이 달라지는 편이다' },
    { id: 'h2', type: '지도자', question: '나는 솔직하고 당당한 편이다' },
    { id: 'c2', type: '성취자', question: '나는 도움이 되는 사람과 친분을 쌓으려고 한다' },
    { id: 'b3', type: '조력자', question: '나는 착해 보여야 한다는 강박관념 때문에 화를 잘 못낸다' },
    { id: 'f3', type: '충실한 유형', question: '나는 정보와 사생활 보안에 철저하다' },
    { id: 'd3', type: '예술가', question: '나는 마음에 상처도 잘 받고 변덕스럽다' },
    { id: 'b1', type: '조력자', question: '나는 친절하고 상냥하다는 말을 자주 듣는다' },
    { id: 'e1', type: '탐구자', question: '나는 논리적이고 합리적인 대화를 좋아한다' },
    { id: 'f2', type: '충실한 유형', question: '만약에 생길 위험에 대비해 자주 확인하고 점검하는 편이다' },
    { id: 'a1', type: '개혁가', question: '나는 항상 올바르게 행동하려고 노력한다.' },
    { id: 'g1', type: '열정가', question: '나는 심각하고 지루한 것을 견디기 힘들다' },
    { id: 'i1', type: '평화주의자', question: '나는 앞에 나서거나 경쟁하는 것을 좋아하지 않는다' },
];

// Zone 판별 함수
const getZone = (idPrefix: string): 'heart' | 'head' | 'gut' => {
    if (['b', 'c', 'd'].includes(idPrefix)) return 'heart'; // 가슴형 (2,3,4)
    if (['e', 'f', 'g'].includes(idPrefix)) return 'head'; // 머리형 (5,6,7)
    return 'gut'; // 장형 (8,9,1 - h,i,a)
};

export const questions: Question[] = rawQuestions.map((q) => {
    const prefix = q.id[0].toLowerCase();
    return {
        ...q,
        zone: getZone(prefix),
        typeNumber: TYPE_TO_NUMBER[q.type],
    };
});

// 향수 데이터 정의
export interface PerfumeInfo {
    id: number;
    title: string;
    imageTags: string[];
    description: string[];
    mainNotes?: string[];
}

export const PERFUME_DATA: Record<number, PerfumeInfo> = {
    1: {
        id: 1,
        title: '🌿 1. GREEN',
        imageTags: ['햇살이 비치는 숲길', '싱그러운 나뭇잎', '대나무 숲', '이슬 맺힌 초록 잎'],
        description: [
            '숲을 한 모금 마신 듯한 싱그러움.',
            '막 피어난 초록 잎과 깨끗한 공기가',
            '몸을 감싸는 듯한 향입니다.',
            '편안하면서도 산뜻한 분위기를 선사합니다.',
        ],
        mainNotes: ['Green Tea', 'Bamboo', 'Phytoncide'],
    },
    2: {
        id: 2,
        title: '🍑 2. FRUITY',
        imageTags: ['잘 익은 배', '레몬과 오렌지', '복숭아', '과일 바구니'],
        description: [
            '햇살을 머금은 과일의 달콤함.',
            '싱그러운 과즙과 은은한 달콤함이',
            '기분 좋은 에너지를 전합니다.',
            '가볍고 밝은 무드에 잘 어울립니다.',
        ],
        mainNotes: ['English Pear', 'Lemon', 'Orange Blossom'],
    },
    3: {
        id: 3,
        title: '🌶 3. SPICY',
        imageTags: ['계피', '후추', '말린 향신료', '따뜻한 우드 테이블'],
        description: [
            '부드럽지만 존재감 있는 향.',
            '은은한 스파이스가',
            '깊이 있는 분위기를 더해',
            '차분하고 세련된 인상을 남깁니다.',
        ],
    },
    4: {
        id: 4,
        title: '🍋 4. CITRUS',
        imageTags: ['레몬 반쪽', '자몽', '오렌지', '햇살 아래 감귤'],
        description: [
            '첫인상이 상쾌한 향.',
            '톡 터지는 시트러스와',
            '맑은 공기가 만나',
            '기분 좋은 하루를 시작하게 합니다.',
        ],
        mainNotes: ['Lemon', 'Orange Blossom'],
    },
    5: {
        id: 5,
        title: '🌿 5. HERB',
        imageTags: ['허브 화분', '로즈마리', '바질', '라벤더 들판 일부'],
        description: [
            '맑은 공기를 닮은 향.',
            '허브 특유의 깨끗함과',
            '은은한 그린 노트가 만나',
            '편안한 여운을 남깁니다.',
        ],
    },
    6: {
        id: 6,
        title: '🌲 6. WOODY',
        imageTags: ['다크우드', '숲속 나무', '나이테', '따뜻한 원목'],
        description: ['깊고 따뜻한 숲의 향기.', '나무가 주는 안정감과', '은은한 잔향이', '오래도록 기억에 남습니다.'],
        mainNotes: ['Aesop Tacit', 'Wheel'],
    },
    7: {
        id: 7,
        title: '🌊 7. MARINE',
        imageTags: ['햇살 비치는 바다', '파도', '해변', '푸른 수평선'],
        description: ['바다를 닮은 깨끗한 향.', '시원한 공기와', '맑은 바람을 담아', '청량한 분위기를 전합니다.'],
        mainNotes: ['White Musk', 'Green Tea', 'Bamboo'],
    },
    8: {
        id: 8,
        title: '🤍 8. MUSK',
        imageTags: ['흰 셔츠', '린넨', '하얀 침구', '햇살 드는 창가'],
        description: ['가장 편안한 잔향.', '깨끗한 비누와', '포근한 린넨을 떠올리게 하는', '부드러운 머스크 향입니다.'],
        mainNotes: ['White Musk'],
    },
    9: {
        id: 9,
        title: '🌸 9. FLORAL',
        imageTags: ['미모사', '수선화', '일랑일랑', '들꽃'],
        description: [
            '꽃이 피는 순간을 담았습니다.',
            '은은한 꽃향기가',
            '부드럽게 퍼지며',
            '따뜻하고 우아한 분위기를 완성합니다.',
        ],
        mainNotes: ['Mimosa', 'Narcissus', 'Ylang-Ylang'],
    },
};
