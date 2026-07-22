export interface PerfumeInfo {
    id: number;
    code: string;
    name: string;
    imageTags: string[];
    description: string[];
    mainNotes?: string[];
}

export const PERFUME_DATA: Record<number, PerfumeInfo> = {
    1: {
        id: 1,
        code: 'GREEN',
        name: '🌿 1. GREEN',
        imageTags: ['햇살이 비치는 숲길', '싱그러운 나뭇잎', '대나무 숲', '이슬 맺힌 초록 잎'],
        description: [
            '숲을 한 모금 마신 듯한 싱그러움.',
            '막 피어난 초록 잎과 깨끗한 공기가 몸을 감싸는 듯한 향입니다.',
            '편안하면서도 산뜻한 분위기를 선사합니다.',
        ],
        mainNotes: ['Green Tea', 'Bamboo', 'Phytoncide'],
    },
    2: {
        id: 2,
        code: 'FRUITY',
        name: '🍑 2. FRUITY',
        imageTags: ['잘 익은 배', '레몬과 오렌지', '복숭아', '과일 바구니'],
        description: [
            '햇살을 머금은 과일의 달콤함.',
            '싱그러운 과즙과 은은한 달콤함이 기분 좋은 에너지를 전합니다.',
            '가볍고 밝은 무드에 잘 어울립니다.',
        ],
        mainNotes: ['English Pear', 'Lemon', 'Orange Blossom'],
    },
    3: {
        id: 3,
        code: 'SPICY',
        name: '🌶 3. SPICY',
        imageTags: ['계피', '후추', '말린 향신료', '따뜻한 우드 테이블'],
        description: [
            '부드럽지만 존재감 있는 향.',
            '은은한 스파이스가 깊이 있는 분위기를 더해 차분하고 세련된 인상을 남깁니다.',
        ],
    },
    4: {
        id: 4,
        code: 'CITRUS',
        name: '🍋 4. CITRUS',
        imageTags: ['레몬 반쪽', '자몽', '오렌지', '햇살 아래 감귤'],
        description: ['첫인상이 상쾌한 향.', '톡 터지는 시트러스와 맑은 공기가 만나 기분 좋은 하루를 시작하게 합니다.'],
        mainNotes: ['Lemon', 'Orange Blossom'],
    },
    5: {
        id: 5,
        code: 'HERB',
        name: '🌿 5. HERB',
        imageTags: ['허브 화분', '로즈마리', '바질', '라벤더 들판 일부'],
        description: ['맑은 공기를 닮은 향.', '허브 특유의 깨끗함과 은은한 그린 노트가 만나 편안한 여운을 남깁니다.'],
    },
    6: {
        id: 6,
        code: 'WOODY',
        name: '🌲 6. WOODY',
        imageTags: ['다크우드', '숲속 나무', '나이테', '따뜻한 원목'],
        description: ['깊고 따뜻한 숲의 향기.', '나무가 주는 안정감과 은은한 잔향이 오래도록 기억에 남습니다.'],
        mainNotes: ['Aesop Tacit', 'Wheel'],
    },
    7: {
        id: 7,
        code: 'MARINE',
        name: '🌊 7. MARINE',
        imageTags: ['햇살 비치는 바다', '파도', '해변', '푸른 수평선'],
        description: ['바다를 닮은 깨끗한 향.', '시원한 공기와 맑은 바람을 담아 청량한 분위기를 전합니다.'],
    },
    8: {
        id: 8,
        code: 'MUSK',
        name: '🤍 8. MUSK',
        imageTags: ['흰 셔츠', '린넨', '하얀 침구', '햇살 드는 창가'],
        description: ['가장 편안한 잔향.', '깨끗한 비누와 포근한 린넨을 떠올리게 하는 부드러운 머스크 향입니다.'],
        mainNotes: ['White Musk'],
    },
    9: {
        id: 9,
        code: 'FLORAL',
        name: '🌸 9. FLORAL',
        imageTags: ['미모사', '수선화', '일랑일랑', '들꽃'],
        description: [
            '꽃이 피는 순간을 담았습니다.',
            '은은한 꽃향기가 부드럽게 퍼지며 따뜻하고 우아한 분위기를 완성합니다.',
        ],
        mainNotes: ['Mimosa', 'Narcissus', 'Ylang-Ylang'],
    },
};
