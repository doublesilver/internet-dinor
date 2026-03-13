# Internet Dinor

인터넷/TV 가입 비교 사이트 `인터넷공룡`입니다.  
`Next.js 15 + React 19 + Tailwind CSS + Supabase` 기반이고, Supabase 환경변수가 없으면 seed/fallback 데이터로 동작합니다.

## Stack

- `Next.js 15` App Router
- `React 19`
- `Tailwind CSS`
- `Supabase`
- `react-hook-form`
- `Zod`
- `Vercel`

## Local Setup

1. `npm ci`
2. `.env.local` 준비
3. `npm run dev`

주요 환경변수:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_ALLOWED_EMAILS`
- `NEXT_PUBLIC_SITE_URL`

자세한 운영/배포 문서는 `AGENTS.md`, `CLAUDE.md`, `docs/`를 참고하면 됩니다.

## Firebase Studio / IDX

이 레포는 `.idx/dev.nix`를 포함하고 있어서 GitHub에서 가져오면 아래 흐름으로 바로 작업을 이어갈 수 있습니다.

1. GitHub 레포 import
2. Firebase Studio secret/env에 프로젝트 환경변수 입력
3. 워크스페이스가 `npm ci` 자동 실행
4. preview에서 `npm run dev -- --hostname 0.0.0.0 --port $PORT` 실행

Node는 `22.x` 기준입니다.

## Commands

```bash
npm run dev
npm run build
npx tsc --noEmit
npx vitest run
```

## Current Highlights

- board/category 라우트 통합
- PriceCalculator 분리
- `getSiteSettings()` layout 통합
- carrier theme 단일 소스화
- inquiry/admin 경로 테스트 확대
- admin middleware, admin API, repository fallback, inquiry editor 저장 흐름 테스트 보강
- `/portfolio` 페이지와 GitHub snapshot 연동 추가
