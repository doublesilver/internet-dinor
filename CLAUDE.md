# 인터넷공룡 (Internet Dinor)

인터넷/TV 가입 비교 사이트. 레퍼런스 사이트(인터넷하우스)와 동일한 화면 구조를 목표로 함.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router) + React 19
- **스타일링**: Tailwind CSS 4
- **DB**: Supabase (env 없으면 seed 데이터 fallback)
- **폼**: react-hook-form + Zod
- **주소검색**: react-daum-postcode
- **폰트**: Pretendard (본문, CDN), Cafe24Ssurround (제목, CDN)

## 배포

- **GitHub**: https://github.com/doublesilver/internet-dinor (private)
- **Vercel**: https://internetdinor.vercel.app
- **도메인**: https://인터넷공룡.com
- **배포 방법**: `git push origin main` → Vercel 자동 배포

## 레퍼런스

- **원본 사이트**: https://xn--t60bm44a12c2wap96ap6f.com/ (인터넷하우스)
- 모든 페이지 구조, 데이터, 레이아웃을 레퍼런스와 동일하게 구현

## 브랜드 컬러 (파스텔 톤)

- 메인 블루: `#7EB5D6` (파스텔 스카이블루)
- 피치: `#FDDECF` (파스텔 피치)
- 라벤더: `#C8BBE8` (파스텔 연보라)
- 스카이: `#A8D4F0` (파스텔 하늘색)
- 다크: `#3D4A5C`
- 통신사별: SK `#8ABDE0`, KT `#6EA8D4`, LG `#94C4E8`, Sky `#A0D8E8`, Hello `#B0CCE0`

## 주요 경로

- `src/app/` — 페이지 (홈, 신청, 통신사, 후기, 이벤트, 가이드, 비교, 정책, 어드민)
- `src/components/` — layout, sections, forms, admin, ui
- `src/data/seeds/` — Supabase 없을 때 사용하는 시드 데이터
- `src/lib/repositories/` — 데이터 접근 레이어 (Supabase/seed 이중 소스)
- `public/images/characters/` — 캐릭터 이미지 (대표, 단체)
- `public/images/carriers/` — 통신사 로고

## 개발 명령어

```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npx tsc --noEmit     # 타입 체크
```

## 참고사항

- 본인인증(identity verification) 기능은 구현하지 않음
- 시드 데이터는 클라이언트가 어드민에서 수정 가능하도록 준비
- 사업자등록번호 등 실제 사업자 정보는 플레이스홀더 상태
- 캐릭터: 실제 PNG 2개 (대표/단체) + SVG 컴포넌트(DinoCharacter.tsx) 혼용
