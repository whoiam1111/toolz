# TOOL:Z (툴즈)

질문과 자기이해를 위한 심리 검사 서비스 — [toolz.co.kr](https://www.toolz.co.kr)

- **일반 방문자**: 브랜드 소개, 콘텐츠(클래스), 미니 테스트, 감정 유형(향수 프로필) 체험 검사
- **코치(상담사)**: 내담자 등록(비밀유지 서약서 서명) → 검사 6종 진행 및 결과 확인
  (6도형, 인생그래프, 성격유형 구/신, 애착유형, 핵심감정)
- **관리자**: 코치 계정 생성, 단체·콘텐츠 관리, 체험 검사 응답 조회

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Supabase (Auth, Postgres, Storage) · Vitest

## 시작하기

Node.js 22 이상이 필요합니다 (`.nvmrc` 포함 — nvm 사용 시 `nvm use`).

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev                  # http://localhost:3000
```

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (Turbopack) |
| `npm run build` | 프로덕션 빌드. 타입 오류가 있으면 실패한다. 끝나면 `next-sitemap`이 `public/sitemap*.xml`, `robots.txt`를 다시 만든다 |
| `npm run lint` | ESLint (Next 16부터 빌드 중에는 실행되지 않음) |
| `npm test` | 단위 테스트 (점수 계산 로직: `app/lib/*.test.ts`) |

## 환경변수

`.env.example` 참고. `ADMIN_EMAILS`, `PROMO_CODES`는 **서버 전용**이라 `NEXT_PUBLIC_` 접두사를 붙이면 안 된다.

## 권한 구조

| 경로 | 접근 | 어디서 막는가 |
|---|---|---|
| `/dashboard/**`, `/trial/dashboard/**` | 로그인 사용자 | `proxy.ts` (서버) + `layout.tsx`의 `AuthGuard` (화면) |
| `/admins/**` | 관리자 | `proxy.ts` + `AuthGuard admin` |
| `/api/getAnswers`, `getIdAnswers`, `deleteUser` | 로그인 사용자 | 각 라우트의 `requireUser()` |
| `/api/create-counselor` | 관리자 | `requireUser('admin')` |

관리자 판별은 서버에서만 한다 (`app/lib/admin.ts`): `ADMIN_EMAILS` 환경변수 또는 `admins` 테이블.
데이터 자체의 최종 보호는 Supabase RLS가 담당한다 — 아래 마이그레이션 참고.

## 데이터베이스 마이그레이션

`supabase/migrations/`에 RLS 정책, `admins` 테이블, 개인정보 이미지 버킷 비공개 전환, 체험 응답 원자적 저장 함수가 있다.
**적용 전 파일 상단의 주의사항을 반드시 읽을 것** (기존 정책 정리, 스키마 확인, 스테이징 테스트).
코드는 마이그레이션 적용 전/후 모두 동작하도록 작성되어 있다.
