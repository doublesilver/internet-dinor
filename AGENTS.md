# Internet Dinor - Agent Handoff

## 프로젝트 개요
인터넷/TV 가입 비교 사이트 (인터넷공룡). Next.js 15 + React 19 + Tailwind CSS + Supabase.

## 기술 스택
- **프레임워크**: Next.js 15 (App Router) + React 19
- **스타일링**: Tailwind CSS
- **DB**: Supabase (env 없으면 seed 데이터 fallback)
- **폼**: react-hook-form + Zod
- **배포**: Vercel (git push origin main → 자동 배포)
- **도메인**: https://인터넷공룡.com

## 환경 설정
- `.env.local` — Vercel에서 pull (`npx vercel env pull .env.local`)
- Supabase 환경변수: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- 인증: Supabase Auth 모드 (ADMIN_ALLOWED_EMAILS로 관리자 제한)

## 최근 완료 작업 (2026-03-13)
### 전수 리뷰 기반 보안 강화 + 코드 품질 개선
- timing-safe 세션 비교, UUID/slug 검증, 텍스트 길이 제한
- 11개 컴포넌트 fetch try/catch 추가, 공통 safeFetch 유틸 생성
- updateField 제네릭화, 메시지 상태 타입화
- 홈/admin/inquiry 메타데이터 추가, metadataBase, noindex
- 로고 텍스트화(인터넷공룡), 모바일 메뉴 스크롤 방지, 접근성 개선
- seed/import 에러 핸들링, 환경변수 프로덕션 필수화
- Supabase에 시드 데이터 투입 완료

### 구조 정리
- board 라우트 중복 통합 (`guide/`, `event/`, `[category]/` → 공통 config)
- `PriceCalculator` 서버/클라이언트/상태 로직 분리
- `getSiteSettings()` 반복 호출을 `(site)` layout 기준으로 통합
- 통신사 컬러 상수 단일 소스화
- `ApplyInquiryForm` react-hook-form 상태 혼용 해소
- Upstash rate limiter 설정/재시도 로직 보강

### 최근 테스트 확대
- repository seed fallback read/write 테스트 추가
- admin login/content/inquiries API route 테스트 추가
- admin middleware 테스트 추가
- admin inquiry list/detail page 렌더 테스트 추가
- inquiry editor 저장 helper 분리 + 테스트 추가
- 현재 주요 테스트 묶음: 10파일 62케이스 통과

### IDX/Firebase Studio 준비
- `.idx/dev.nix` 추가
- `README.md`, `AGENTS.md`, `CLAUDE.md` 기준 handoff 문서 정리
- Node 22 기준 워크스페이스/preview 명령 반영

## 남은 DB 작업 (Supabase SQL Editor에서 실행 필요)
```sql
-- site_settings public read 정책
CREATE POLICY "public read site_settings"
ON public.site_settings FOR SELECT USING (true);

-- products 누락 컬럼
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS original_price_label text;

-- inquiries 전화번호 제약
ALTER TABLE public.inquiries
ADD CONSTRAINT inquiries_phone_min_length CHECK (length(phone) >= 9);
```

## 남은 작업 (우선순위순)
1. admin dashboard/system page 소비 경로 테스트 확대
2. `InquiryEditor` UI 상호작용 테스트 여부 결정 (DOM 테스트 도입 or 현재 helper 분리 유지)
3. portfolio 섹션의 GitHub snapshot 실패/비공개 repo fallback 정책 정리
4. Node 22 기준 운영/CI 환경 정렬 여부 점검

## 주요 경로
- `src/app/` — 페이지
- `src/components/` — layout, sections, forms, admin, ui
- `src/lib/repositories/` — 데이터 접근 (Supabase/seed 이중)
- `src/lib/validators/` — Zod 스키마
- `src/lib/utils/` — api.ts, labels.ts, rate-limit.ts, phone.ts, date.ts
- `src/data/seeds/` — 시드 데이터

## 명령어
```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npx tsc --noEmit     # 타입 체크
npx tsx src/scripts/seed.ts  # Supabase 시드 투입
```
