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
export interface PerfumeInfoBook {
    id: number;
    title: string;
    imageTags: string[];
    description: string[];
    mainNotes?: string[];
    enneagramQuotes?: {
        typeNumber: number;
        typeName: string;
        quotes: { book: string; text: string }[];
        growthPoint: string;
    };
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
export const PERFUME_DATA_BOOK: Record<number, PerfumeInfoBook> = {
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
        enneagramQuotes: {
            typeNumber: 1,
            typeName: '개혁가',
            quotes: [
                { book: '알베르 카뮈, 《페스트》', text: '중요한 것은 성실하게 자신의 직업을 수행하는 것입니다.' },
                {
                    book: '프란츠 카프카, 《변신》',
                    text: '인간으로서 살아남기 위해 우리에게는 최소한의 도덕적 양심과 책임감이 필요하다.',
                },
                {
                    book: '조지 오웰, 《1984》',
                    text: '자유란 진실이 말해질 수 있는 권리이며, 그것은 곧 둘 더하기 둘은 넷이라고 말할 수 있는 자유다.',
                },
            ],
            growthPoint:
                '완벽주의와 과도한 책임감으로 지칠 때, 완벽한 결과보다 매 순간의 성실함과 진실성을 지키는 것이 유연한 성장의 핵심임을 깨닫습니다.',
        },
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
        enneagramQuotes: {
            typeNumber: 2,
            typeName: '조력가',
            quotes: [
                {
                    book: '생텍쥐페리, 《어린 왕자》',
                    text: '가장 중요한 것은 눈에 보이지 않고, 마음으로 봐야만 잘 볼 수 있다.',
                },
                {
                    book: '한강, 《채식주의자》',
                    text: '인간은 무엇인가, 나는 제대로 살고 있는가, 이 모든 질문 속에서 타인을 향한 연민은 멈추지 않는다.',
                },
                {
                    book: '무라카미 하루키, 《노르웨이숲》',
                    text: '사람을 사랑한다는 것은 참으로 멋진 일이고, 그 애정이 성실하다면 누구도 미궁속에 버려지지 않아요',
                },
            ],
            growthPoint:
                '타인의 인정이나 관계에 에너지를 소모하기보다, 내면의 진심 어린 연민과 깊이 있는 성찰로 타인을 돕는 건강한 경계를 세웁니다.',
        },
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
        enneagramQuotes: {
            typeNumber: 3,
            typeName: '성취가',
            quotes: [
                {
                    book: 'F. 스콧 피츠제럴드, 《위대한 개츠비》',
                    text: '누군가를 비판하고 싶을 때는 이 세상의 모든 사람이 너처럼 유리한 입장에 서 있지 않다는 걸 기억해라.',
                },
                {
                    book: '라이너 마리아 릴케, 《말테의 수기》',
                    text: '사실 재능이라는 것은 노력한 다음에만 필요한 것이다',
                },
                { book: '요한 볼프강 폰 괴테, 《파우스트》', text: '인간은 노력하는 한 헤매는 법이다.' },
            ],
            growthPoint:
                '성과와 결과 중심의 삶에서 벗어나, 타인의 입장을 헤아리는 여유를 갖고 실패와 방황 또한 성장의 필연적인 과정임을 수용합니다.',
        },
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
        enneagramQuotes: {
            typeNumber: 4,
            typeName: '예술가',
            quotes: [
                {
                    book: '서머싯 몸, 《달과 6펜스》',
                    text: '나는 그림을 그려야 한다지 않소. 그리지 않고서는 못 배기겠단 말이오. 물에 빠진 사람에게 헤엄을 잘 치고 못 치고가 문제겠소? 우선 헤어나오는 게 중요하지. 그렇지 않으면 빠져 죽어요',
                },
                {
                    book: '요한 볼프강 폰 괴테, 《젊은 베르테르의 슬픔》',
                    text: '마음이 이끄는 대로 온전히 몰입하는 삶만이 진정으로 살아있다고 말할 수 있다.',
                },
                {
                    book: '호르헤 루이스 보르헤스, 《알레프》',
                    text: "관념론의 가르침에 의하면 '살다'와 '꿈꾸다'라는 동사는 모든 점에서 동의어이다.",
                },
            ],
            growthPoint:
                '깊은 감정과 고립감에 머무는 대신, 내면의 예술적 몰입을 외부 세계와의 건강한 연결고리로 확장하여 일상의 생명력을 채웁니다.',
        },
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
        enneagramQuotes: {
            typeNumber: 5,
            typeName: '탐구자',
            quotes: [
                {
                    book: '헤르만 헤세, 《유리알 유희》',
                    text: '정신적인 삶의 깊이와 사유의 진실을 추구하는 것만이 혼란스러운 세상에서 길을 잃지 않는 유일한 방법이다.',
                },
                {
                    book: '알베르 카뮈, 《시지프 신화》',
                    text: '부조리한 세계를 직시하고 오직 이성을 무기로 그에 맞서는 것, 그것이 인간의 위대함이다.',
                },
                {
                    book: '서머싯 몸, 《면도날》',
                    text: '면도날의 날카로운 칼날을 넘어서기는 어렵나니. 그러므로 현자가 이르노니, 구원으로 가는 길 역시 어려우리라.',
                },
            ],
            growthPoint:
                '머릿속 사유와 분석에만 머무르지 않고, 부조리한 현실 속으로 직접 걸어 들어가 행동하는 지성의 용기를 발휘합니다.',
        },
    },
    6: {
        id: 6,
        title: '🌲 6. WOODY',
        imageTags: ['다크우드', '숲속 나무', '나이테', '따뜻한 원목'],
        description: ['깊고 따뜻한 숲의 향기.', '나무가 주는 안정감과', '은은한 잔향이', '오래도록 기억에 남습니다.'],
        mainNotes: ['Aesop Tacit', 'Wheel'],
        enneagramQuotes: {
            typeNumber: 6,
            typeName: '충실가',
            quotes: [
                {
                    book: '어니스트 헤밍웨이, 《노인과 바다》',
                    text: '인간은 파멸당할 수 있을지는 몰라도 패배할 수는 없다',
                },
                {
                    book: '빅터 프랭클, 《죽음의 수용소에서》',
                    text: '왜 살아야 하는지 그 이유를 아는 사람은 그 어떤 상황도 견뎌낼 수 있다.',
                },
                {
                    book: '윌리엄 셰익스피어, 《햄릿》',
                    text: '다른 무엇보다도 자신에게 정직해라. 그러면 낮에 이어 밤이 따라 오듯이 남에게 거짓될 수 없는 법.',
                },
            ],
            growthPoint:
                '미래의 불안과 타인의 시선에서 벗어나, 어떤 시련 속에서도 나 자신의 주체적인 선택과 불굴의 의지를 믿는 힘을 기릅니다.',
        },
    },
    7: {
        id: 7,
        title: '🌊 7. MARINE',
        imageTags: ['햇살 비치는 바다', '파도', '해변', '푸른 수평선'],
        description: ['바다를 닮은 깨끗한 향.', '시원한 공기와', '맑은 바람을 담아', '청량한 분위기를 전합니다.'],
        mainNotes: ['White Musk', 'Green Tea', 'Bamboo'],
        enneagramQuotes: {
            typeNumber: 7,
            typeName: '열정가',
            quotes: [
                {
                    book: '니코스 카잔차키스, 《그리스인 조르바》',
                    text: '나는 아무것도 바라지 않는다, 나는 아무것도 두렵지 않다, 나는 자유다.',
                },
                { book: '아베 코보, 《모래의 여자》', text: '벌이 없으면 도망치는 재미도 없다' },
                {
                    book: '밀란 쿤데라, 《참을 수 없는 존재의 가벼움》',
                    text: '사람이 무엇을 희구해야만 하는가를 안다는 것은 절대 불가능하다.',
                },
            ],
            growthPoint:
                '산만한 호기심과 도피성 자극에서 벗어나, 내면의 진정한 자유를 향해 하나의 목표에 깊이 몰입하는 끈기를 기릅니다.',
        },
    },
    8: {
        id: 8,
        title: '🤍 8. MUSK',
        imageTags: ['흰 셔츠', '린넨', '하얀 침구', '햇살 드는 창가'],
        description: ['가장 편안한 잔향.', '깨끗한 비누와', '포근한 린넨을 떠올리게 하는', '부드러운 머스크 향입니다.'],
        mainNotes: ['White Musk'],
        enneagramQuotes: {
            typeNumber: 8,
            typeName: '도전자',
            quotes: [
                {
                    book: '안톤 체호프, 《체호프 단편선》',
                    text: '삶이 나를 짓누르기 전에 네가 먼저 삶을 부숴버려, 삶으로부터 취할 수 있는 모든 것을 취하란 말이야',
                },
                { book: '블레즈 파스칼, 《팡세》', text: '힘없는 정의는 무력하고, 정의 없는 힘은 폭력이다' },
                {
                    book: '빅토르 위고, 《레 미제라블》',
                    text: "혁명이란 무엇인가를 이해하고 싶다면 그것을 '진보'라고 불러 보라.",
                },
            ],
            growthPoint:
                '강한 통제력과 투쟁심을 타인을 지배하는 데 쓰기보다, 내면의 부드러움을 포용하고 정의로운 보호와 성장의 에너지로 전환합니다.',
        },
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
        enneagramQuotes: {
            typeNumber: 9,
            typeName: '평화주의자',
            quotes: [
                {
                    book: '임레 케르테스, 《좌절》',
                    text: '나의 고백은 그들의 고백보다 열등하지 않을 것입니다. 어쨌거나 나의 인생길을 걸은 사람은 여러분이 아니라 바로 나입니다',
                },
                {
                    book: '헨리 데이비드 소로, 《월든》',
                    text: '내면의 고요함과 단순한 삶 속에서 진정한 안식과 자유를 발견할 수 있다.',
                },
                {
                    book: '버지니아 울프, 《자기만의 방》',
                    text: '타인의 평화를 지켜주느라 잊고 살았던 나만의 온전한 공간과 주체성을 회복해야 한다.',
                },
            ],
            growthPoint:
                '갈등을 피하기 위해 타인에게 맞추던 태도를 내려놓고, 나만의 공간과 주체성을 회복하여 진정한 내면의 평화와 변화를 마주합니다.',
        },
    },
};
