# 인터넷공룡 홈페이지 1차 개발 명세 및 MVP 구현안

## 0. 문서 개요

| 항목 | 내용 |
| --- | --- |
| 문서 목적 | 기획안/디자인 방향서를 기준으로 개발자가 바로 착수할 수 있는 수준의 1차 구현 방식과 범위를 정의 |
| 기준 문서 | `인터넷공룡 홈페이지 선수금 수령용 1차 기획안`, `인터넷공룡 홈페이지 1차 디자인 방향서 및 텍스트 와이어프레임` |
| 구축 전제 | 선수금 수령용 1차 제작물, 가상 데이터 기반, 실제 운영 전 실제 데이터로 쉽게 교체 가능한 구조 |
| 제외 범위 | 본인인증, 실시간 요금 연동, CRM 자동 연동, 고급 통계, 결제 |
| 핵심 기능 | 공개 페이지, 문의 접수, 관리자 로그인, 문의 관리, 상품/게시물 관리, 정책 뼈대 |
| 권장 구현 방식 | `정적 페이지 + 서버리스 API + 관리형 DB/BaaS` 하이브리드 |

## 1. 1차 제작물에 적합한 개발 방식

| 항목 | 권장 방식 | 이유 |
| --- | --- | --- |
| 공개 웹페이지 | 정적 생성(SSG) + ISR 또는 캐시 재검증 | 홈/상품/후기/게시판은 읽기 중심이라 빠르고 저렴하게 제공 가능 |
| 문의 접수 | 서버리스 API | 이름/연락처/상세 문의를 DB에 저장하고 검증해야 함 |
| 관리자 기능 | 인증이 있는 동적 페이지 | 문의 목록/상태 변경/콘텐츠 수정은 정적 사이트만으로 운영 불가 |
| 콘텐츠 운영 | DB 기반 + 시드 데이터 초기 적재 | 1차는 가상 데이터로 시작하고 실제 운영 전 쉽게 교체 가능 |
| 배포 방식 | 프런트와 API를 같은 리포지토리에서 운영 | 초기 속도와 유지보수 효율이 가장 좋음 |
| 정책/법무 | 정적 페이지 + 폼 동의 로그 저장 | 1차 요구 수준 충족 |

### 개발 방식 결론

| 결론 | 설명 |
| --- | --- |
| 최적안 | `하이브리드 웹`이 적합하다. 공개 화면은 최대한 정적으로 제공하고, 문의/관리자만 서버리스로 처리한다. |
| 이유 | 1차 제작물은 속도와 비용을 아껴야 하지만, 문의 저장과 관리자 기능 때문에 완전한 정적 사이트만으로는 부족하다. |
| 구현 포인트 | 콘텐츠는 DB 시드로 넣고, UI는 해당 데이터를 읽어 렌더링하며, 실제 데이터 교체 시 DB 값만 바꾸면 되도록 설계한다. |

## 2. 백엔드 서버 필요 여부에 대한 명확한 결론

| 항목 | 결론 |
| --- | --- |
| 전용 상시 구동 백엔드 서버 필요 여부 | `불필요` |
| 백엔드 기능 필요 여부 | `필요` |
| 추천 구현 방식 | `서버리스 API + 관리형 DB/Auth` |

### 판단 근거

| 판단 요소 | 설명 |
| --- | --- |
| 문의 저장 | 메인 문의 폼과 상품 상세 문의 폼 데이터를 저장해야 하므로 서버 측 처리 필요 |
| 관리자 인증 | 문의 목록/상태 변경/콘텐츠 수정은 인증과 권한 체크가 필요 |
| 실제 데이터 교체 | 가상 데이터에서 실제 데이터로 전환하려면 DB 기반 관리가 유리 |
| 1차 예산/속도 | 전용 Express/Nest 서버를 별도로 두는 것보다 서버리스가 빠르고 저렴함 |
| 고도화 여지 | 후속 단계에서 API, CRM, 추적, 역할 관리 등을 점진적으로 확장 가능 |

### 실무 결론

| 항목 | 권장 판단 |
| --- | --- |
| “백엔드 서버를 따로 구축해야 하는가?” | 아니오 |
| “백엔드 기능 없이 정적 페이지만 만들면 되는가?” | 아니오 |
| 최종 권장안 | `Next.js 같은 풀스택 프런트 프레임워크 + Route Handler/Server Action + Supabase 같은 BaaS` 조합 |

## 3. 정적 웹 / 서버리스 / 백엔드 적용 기준 비교

| 비교 항목 | 정적 웹만 | 서버리스 + BaaS | 전용 백엔드 서버 |
| --- | --- | --- | --- |
| 공개 페이지 속도 | 매우 좋음 | 매우 좋음 | 좋음 |
| 문의 폼 저장 | 외부 폼 서비스 의존 필요 | 가능 | 가능 |
| 관리자 기능 | 사실상 부적합 | 적합 | 적합 |
| 가상 데이터 -> 실제 데이터 교체 | 파일 교체는 쉬움, 운영 수정은 어려움 | 쉬움 | 쉬움 |
| 운영자 콘텐츠 수정 | 어려움 | 가능 | 가능 |
| 개발 속도 | 가장 빠름 | 빠름 | 가장 느림 |
| 초기 비용 | 가장 낮음 | 낮음~중간 | 중간~높음 |
| 유지보수 난이도 | 낮음 | 낮음~중간 | 중간~높음 |
| 확장성 | 낮음 | 중간~높음 | 높음 |
| 1차 적합도 | 낮음 | `가장 적합` | 과설계 가능성 높음 |

### 적용 기준 요약

| 상황 | 선택 기준 |
| --- | --- |
| 관리자 없이 랜딩페이지만 필요 | 정적 웹만 가능 |
| 문의 저장 + 관리자 MVP + 빠른 구축 필요 | `서버리스 + BaaS 권장` |
| 복잡한 권한/정산/실시간 로직/외부 연동이 다수 필요 | 전용 백엔드 서버 검토 |

## 4. 추천 기술 스택

| 영역 | 추천 스택 | 선택 이유 |
| --- | --- | --- |
| 프런트엔드 프레임워크 | Next.js(App Router) + TypeScript | 공개 페이지와 관리자, API를 한 리포지토리에서 처리 가능 |
| UI 스타일링 | Tailwind CSS + 디자인 토큰(CSS Variables) | 1차 시안 반영 속도가 빠르고 일관성 유지가 쉬움 |
| 폼 처리 | React Hook Form + Zod | 간편 문의/상세 문의/신청 폼 검증과 확장에 적합 |
| 데이터베이스 | Supabase Postgres | 문의/상품/게시물/설정 저장 구조에 적합, 확장성 충분 |
| 인증 | Supabase Auth | 관리자 로그인 MVP 구현 속도 우수 |
| 파일/이미지 저장 | Supabase Storage 또는 정적 에셋 폴더 | 1차는 정적 에셋 중심, 후속엔 관리자 업로드 확장 가능 |
| 서버 기능 | Next Route Handlers 또는 Server Actions | 별도 백엔드 서버 없이 API 처리 가능 |
| 데이터 접근 계층 | Repository 패턴 | 시드/DB/실데이터 교체 시 UI 영향 최소화 |
| 배포 | Vercel + Supabase | Next.js 배포와 서버리스 운영에 적합 |
| 품질 관리 | ESLint + Prettier + 기본 E2E/폼 테스트 | 1차 품질 확보용 최소 세트 |

### 기술 선택 메모

| 항목 | 메모 |
| --- | --- |
| CMS 도입 여부 | 1차는 별도 Headless CMS 없이 관리자 MVP로 대체 가능 |
| 상태관리 | 공개 페이지는 서버 컴포넌트 중심, 관리자 일부만 로컬 상태 사용 |
| 차후 고도화 | 역할 권한, 알림 발송, CRM 연동이 커지면 서버 분리 검토 |

## 5. 권장 아키텍처

| 계층 | 역할 | 구현 방식 |
| --- | --- | --- |
| Public UI | 홈/상품/후기/게시판/신청 페이지 렌더링 | Next.js App Router, Server Components 중심 |
| Admin UI | 로그인, 대시보드, 문의 관리, 콘텐츠 CRUD | 인증 가드가 있는 관리자 라우트 |
| API Layer | 문의 저장, 관리자 CRUD, 재검증 | Route Handlers |
| Data Layer | 콘텐츠/문의/설정 저장 | Supabase Postgres |
| Auth Layer | 관리자 인증 | Supabase Auth |
| Seed Layer | 가상 상품/후기/게시물 초기 적재 | `scripts/seed.ts` |
| Validation Layer | 폼/입력값 검증 | Zod Schema |
| Cache/Revalidation | 공개 페이지 갱신 | 태그 기반 재검증 또는 ISR |

### 권장 동작 흐름

| 단계 | 흐름 |
| --- | --- |
| 1 | 시드 데이터가 DB에 적재된다 |
| 2 | 공개 페이지는 DB의 게시물/상품 데이터를 읽어 렌더링한다 |
| 3 | 사용자가 문의 폼 제출 시 서버리스 API가 검증 후 `inquiries` 테이블에 저장한다 |
| 4 | 관리자는 로그인 후 문의 상태/메모를 수정한다 |
| 5 | 관리자가 상품/게시물을 수정하면 해당 페이지 캐시를 재검증한다 |

## 6. 라우트 명세

### 6-1. 공개 라우트

| 경로 | 페이지 | 목적 | 렌더링 방식 |
| --- | --- | --- | --- |
| `/` | 홈 | 메인 랜딩 및 빠른 문의 | SSG/ISR |
| `/compare` | 상품 비교 | 통신사/대표 상품 비교 | SSG/ISR |
| `/carriers/[carrierSlug]` | 통신사 상세 | 통신사 허브 | SSG/ISR |
| `/products/[productSlug]` | 상품 상세 | 상세 정보 + 상품 문의 폼 | SSG/ISR |
| `/reviews` | 후기 목록 | 후기 탐색 | SSG/ISR |
| `/reviews/[slug]` | 후기 상세 | 신뢰 콘텐츠 상세 | SSG/ISR |
| `/board/[category]` | 게시판 목록 | 이벤트/가이드/공지 목록 | SSG/ISR |
| `/board/[category]/[slug]` | 게시글 상세 | 게시글 상세 | SSG/ISR |
| `/apply` | 신청 페이지 | 구체적인 상담 신청 | SSG/ISR |
| `/inquiry/complete` | 문의 완료 | 제출 완료 안내 | 정적 |
| `/policy/privacy` | 개인정보처리방침 | 정책 뼈대 | 정적 |
| `/policy/terms` | 이용약관 | 정책 뼈대 | 정적 |

### 6-2. 관리자 라우트

| 경로 | 페이지 | 목적 |
| --- | --- | --- |
| `/admin/login` | 로그인 | 관리자 인증 |
| `/admin` | 대시보드 | 문의 현황 요약 |
| `/admin/inquiries` | 문의 목록 | 문의 조회/검색/상태 변경 |
| `/admin/inquiries/[id]` | 문의 상세 | 상세 확인/메모 수정 |
| `/admin/products` | 상품 목록 | 상품 CRUD |
| `/admin/products/[id]` | 상품 수정 | 상품 상세 수정 |
| `/admin/posts` | 게시물 목록 | 이벤트/공지/가이드/후기 CRUD |
| `/admin/posts/[id]` | 게시물 수정 | 게시물 상세 수정 |
| `/admin/settings` | 설정 | 대표전화, CTA, 사업자 정보, 정책 링크 |

### 6-3. API 라우트

| 경로 | 메서드 | 역할 |
| --- | --- | --- |
| `/api/inquiries/quick` | POST | 메인 간편 문의 저장 |
| `/api/inquiries/product` | POST | 상품 상세 문의 저장 |
| `/api/inquiries/apply` | POST | 신청 페이지 문의 저장 |
| `/api/admin/inquiries/[id]` | PATCH | 문의 상태/메모 수정 |
| `/api/admin/products` | POST | 상품 등록 |
| `/api/admin/products/[id]` | PATCH/DELETE | 상품 수정/삭제 |
| `/api/admin/posts` | POST | 게시물 등록 |
| `/api/admin/posts/[id]` | PATCH/DELETE | 게시물 수정/삭제 |
| `/api/admin/settings` | PATCH | 사이트 기본 설정 수정 |
| `/api/revalidate` | POST | 콘텐츠 수정 후 캐시 재검증 |

## 7. 폴더 구조 / 컴포넌트 구조

### 7-1. 권장 폴더 구조

```text
internet-dinor/
  src/
    app/
      (public)/
        page.tsx
        compare/page.tsx
        carriers/[carrierSlug]/page.tsx
        products/[productSlug]/page.tsx
        reviews/page.tsx
        reviews/[slug]/page.tsx
        board/[category]/page.tsx
        board/[category]/[slug]/page.tsx
        apply/page.tsx
        inquiry/complete/page.tsx
        policy/privacy/page.tsx
        policy/terms/page.tsx
      admin/
        login/page.tsx
        page.tsx
        inquiries/page.tsx
        inquiries/[id]/page.tsx
        products/page.tsx
        products/[id]/page.tsx
        posts/page.tsx
        posts/[id]/page.tsx
        settings/page.tsx
      api/
        inquiries/
          quick/route.ts
          product/route.ts
          apply/route.ts
        admin/
          inquiries/[id]/route.ts
          products/route.ts
          products/[id]/route.ts
          posts/route.ts
          posts/[id]/route.ts
          settings/route.ts
        revalidate/route.ts
      layout.tsx
      globals.css
    components/
      layout/
      sections/
      cards/
      forms/
      board/
      review/
      admin/
      ui/
    lib/
      supabase/
      repositories/
      validators/
      auth/
      revalidate/
      utils/
      constants/
    data/
      seeds/
      fixtures/
      form-configs/
    types/
    scripts/
      seed.ts
      import-real-data.ts
    public/
      images/
      icons/
```

### 7-2. 컴포넌트 구조

| 영역 | 주요 컴포넌트 | 역할 |
| --- | --- | --- |
| 레이아웃 | `SiteHeader`, `SiteFooter`, `MobileStickyCTA`, `PageHero` | 공통 골격 |
| 홈 | `HomeHeroSection`, `CarrierEntrySection`, `ScenarioRecommendationSection`, `TrustSection`, `FeaturedProductsSection`, `FaqSection` | 메인 랜딩 섹션 |
| 상품 | `CarrierSummaryCard`, `ProductSummaryCard`, `ProductHighlights`, `ProductComparisonChecklist` | 비교/상세 노출 |
| 후기/게시판 | `ReviewCard`, `ReviewFeaturedCard`, `BoardList`, `PostMeta`, `RelatedContentSection` | 정보성 콘텐츠 |
| 폼 | `QuickInquiryForm`, `ProductInquiryForm`, `ApplyInquiryForm`, `PrivacyConsentField` | 문의 폼 |
| UI | `Button`, `Badge`, `Input`, `Select`, `RadioGroup`, `Accordion`, `EmptyState`, `Pagination` | 공통 UI |
| 관리자 | `AdminSidebar`, `AdminTopbar`, `InquiryTable`, `InquiryStatusBadge`, `InquiryMemoEditor`, `PostEditor`, `ProductEditor`, `SettingsForm` | 관리자 MVP |

### 7-3. 개발 규칙

| 항목 | 규칙 |
| --- | --- |
| 데이터 접근 | UI가 DB를 직접 알지 않게 `repositories` 계층을 둔다 |
| 타입 관리 | `types` 폴더에 도메인 타입 정의 후 페이지/컴포넌트에서 공용 사용 |
| 폼 검증 | 클라이언트와 서버 모두 Zod 스키마를 공유 |
| 확장성 | 게시판 타입, 폼 필드, CTA 설정은 상수 또는 설정 테이블로 분리 |

## 8. 데이터 구조 예시

### 8-1. 핵심 테이블 제안

| 테이블 | 목적 | 비고 |
| --- | --- | --- |
| `carriers` | 통신사 정보 관리 | SK형/KT형/LG형 등 |
| `products` | 상품 데이터 | 대표 상품, 추천 배지, 상세 내용 포함 |
| `reviews` | 후기 데이터 | 후기 목록/상세 |
| `posts` | 이벤트/공지/가이드 통합 관리 | `type` 필드로 구분 |
| `inquiries` | 문의 데이터 저장 | 빠른 문의/상품 문의/신청 문의 통합 |
| `site_settings` | 대표전화/CTA/사업자 정보/정책 링크 | 관리자 수정 |
| `admins` 또는 `profiles` | 관리자 role 매핑 | Supabase Auth 연동 |

### 8-2. 상품 데이터 예시

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | uuid | PK |
| `carrier_id` | uuid | 통신사 참조 |
| `slug` | text | URL 식별자 |
| `name` | text | 상품명 |
| `summary` | text | 카드 요약 |
| `internet_speed` | text | 100M/500M/1G |
| `tv_included` | boolean | TV 포함 여부 |
| `bundle_type` | text | 인터넷 단독/인터넷+TV |
| `monthly_price_label` | text | 가상 요금 표시 |
| `benefit_label` | text | 가상 혜택 표시 |
| `target_tags` | jsonb | 추천 대상 태그 배열 |
| `badge_tags` | jsonb | 인기/추천/실속형 등 |
| `hero_points` | jsonb | 상세 상단 핵심 포인트 |
| `detail_sections` | jsonb | 상세 설명 블록 |
| `faq_items` | jsonb | 상품별 FAQ |
| `is_featured` | boolean | 대표 노출 여부 |
| `status` | text | draft/published |
| `sort_order` | integer | 정렬값 |

```json
{
  "id": "prd_001",
  "carrier_id": "car_sk",
  "slug": "safe-500-tv-basic",
  "name": "안심 500 + TV 베이직",
  "summary": "가족 단위에 맞는 대표 결합형 상품",
  "internet_speed": "500M",
  "tv_included": true,
  "bundle_type": "internet_tv",
  "monthly_price_label": "월 39,000원대",
  "benefit_label": "상담 시 혜택 안내",
  "target_tags": ["가족", "TV포함", "결합상담"],
  "badge_tags": ["인기", "추천"],
  "hero_points": ["500M 속도", "TV 베이직 포함", "와이파이 상담 가능"],
  "detail_sections": [
    { "title": "추천 대상", "body": "가족 단위, TV 포함 구성을 원하는 사용자" },
    { "title": "유의사항", "body": "실제 혜택은 시점과 조건에 따라 달라질 수 있음" }
  ],
  "faq_items": [
    { "q": "인터넷만 가입 가능한가요?", "a": "가능하며 별도 단독 상품도 안내합니다." }
  ],
  "is_featured": true,
  "status": "published",
  "sort_order": 10
}
```

### 8-3. 후기 데이터 예시

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | uuid | PK |
| `slug` | text | URL 식별자 |
| `title` | text | 후기 제목 |
| `summary` | text | 목록 요약 |
| `body` | text or richtext | 상세 본문 |
| `review_type` | text | 인터넷 단독/인터넷+TV/약정만료 등 |
| `tags` | jsonb | 태그 배열 |
| `featured` | boolean | 베스트 후기 여부 |
| `published_at` | timestamp | 게시일 |
| `status` | text | draft/published |

```json
{
  "id": "rev_001",
  "slug": "moving-house-fast-consult",
  "title": "이사 일정 맞춰 빠르게 상담받았어요",
  "summary": "이사 전 급하게 인터넷이 필요했는데 비교 설명이 빨랐습니다.",
  "body": "가상의 후기 본문입니다. 설치 일정과 통신사 비교 포인트를 상담받은 경험을 서술합니다.",
  "review_type": "moving",
  "tags": ["이사", "인터넷+TV", "빠른상담"],
  "featured": true,
  "published_at": "2026-03-11T09:00:00Z",
  "status": "published"
}
```

### 8-4. 이벤트 데이터 예시

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | uuid | PK |
| `type` | text | `event` |
| `slug` | text | URL 식별자 |
| `title` | text | 이벤트 제목 |
| `summary` | text | 요약 |
| `body` | text or richtext | 상세 내용 |
| `cta_label` | text | 문의 유도 문구 |
| `start_at` | timestamp | 시작일 |
| `end_at` | timestamp | 종료일 |
| `is_featured` | boolean | 메인 노출 여부 |
| `status` | text | draft/published |

```json
{
  "id": "post_evt_001",
  "type": "event",
  "slug": "spring-consult-benefit",
  "title": "봄 시즌 상담 혜택 안내",
  "summary": "가상의 혜택 예시를 기준으로 상담을 유도하는 이벤트 게시물",
  "body": "이벤트 상세 설명, 적용 대상, 유의사항 등을 입력합니다.",
  "cta_label": "혜택 문의하기",
  "start_at": "2026-03-01T00:00:00Z",
  "end_at": "2026-03-31T23:59:59Z",
  "is_featured": true,
  "status": "published"
}
```

### 8-5. 공지/가이드 데이터 예시

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | uuid | PK |
| `type` | text | `notice` 또는 `guide` |
| `slug` | text | URL 식별자 |
| `title` | text | 제목 |
| `summary` | text | 요약 |
| `body` | text or richtext | 본문 |
| `related_product_slugs` | jsonb | 연관 상품 |
| `published_at` | timestamp | 게시일 |
| `status` | text | draft/published |

```json
{
  "id": "post_guide_001",
  "type": "guide",
  "slug": "how-to-choose-internet-speed",
  "title": "인터넷 속도는 어떻게 고르면 될까요?",
  "summary": "100M, 500M, 1G 중 어떤 구성이 맞는지 쉽게 설명하는 가이드",
  "body": "가상의 가이드 본문입니다.",
  "related_product_slugs": ["safe-500-tv-basic"],
  "published_at": "2026-03-11T09:00:00Z",
  "status": "published"
}
```

### 8-6. 문의 데이터 예시

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | uuid | PK |
| `inquiry_type` | text | `quick`, `product`, `apply` |
| `name` | text | 이름 |
| `phone` | text | 연락처 |
| `product_id` | uuid nullable | 상품 문의 시 연결 |
| `carrier_slug` | text nullable | 통신사 맥락 |
| `source_page` | text | 접수 페이지 |
| `status` | text | 신규/연락대기/연락완료 등 |
| `privacy_agreed` | boolean | 동의 여부 |
| `contact_time_preference` | text nullable | 연락 희망 시간 |
| `region_label` | text nullable | 설치 지역 |
| `payload_json` | jsonb | 상품 상세 폼의 확장 필드 |
| `utm_json` | jsonb | utm_source 등 |
| `admin_memo` | text nullable | 상담 메모 |
| `created_at` | timestamp | 접수일시 |
| `updated_at` | timestamp | 수정일시 |

```json
{
  "id": "inq_001",
  "inquiry_type": "product",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "product_id": "prd_001",
  "carrier_slug": "sk",
  "source_page": "/products/safe-500-tv-basic",
  "status": "new",
  "privacy_agreed": true,
  "contact_time_preference": "evening",
  "region_label": "서울 강동구",
  "payload_json": {
    "signup_type": "carrier_change",
    "desired_bundle": "internet_tv",
    "desired_speed": "500M",
    "tv_required": true,
    "mobile_bundle_interest": "interested",
    "memo": "이사 예정일 4월 초"
  },
  "utm_json": {
    "utm_source": "naver",
    "utm_medium": "cpc",
    "utm_campaign": "brand_main"
  },
  "admin_memo": null,
  "created_at": "2026-03-11T09:00:00Z",
  "updated_at": "2026-03-11T09:00:00Z"
}
```

## 9. 상품 상세 폼 확장 설계

| 항목 | 권장 방식 | 이유 |
| --- | --- | --- |
| 기본 공통 필드 | `name`, `phone`, `privacy_agreed` | 모든 문의에 공통 |
| 상품 특화 필드 | 설정 기반 렌더링 | 상품 유형에 따라 필드 구성이 달라질 수 있음 |
| 저장 방식 | 공통 컬럼 + `payload_json` | 1차에서 스키마 변경 없이 필드 확장 가능 |
| 검증 방식 | Zod 스키마를 필드 설정에서 생성 또는 조합 | 확장 시 프런트/서버 검증 일관성 확보 |
| 후속 확장 | 향후 관리자에서 필드 설정까지 수정하도록 확장 가능 | 1차는 코드 설정 파일로 충분 |

### 폼 설정 예시

```ts
export const productInquiryFieldConfig = [
  { key: "signup_type", label: "가입 유형", type: "select", required: true },
  { key: "desired_bundle", label: "희망 구성", type: "select", required: true },
  { key: "desired_speed", label: "희망 인터넷 속도", type: "select", required: false },
  { key: "tv_required", label: "TV 필요 여부", type: "radio", required: false },
  { key: "mobile_bundle_interest", label: "휴대폰 결합 여부", type: "radio", required: false },
  { key: "region_label", label: "설치 지역", type: "text", required: false },
  { key: "contact_time_preference", label: "연락 희망 시간", type: "select", required: false },
  { key: "memo", label: "문의 메모", type: "textarea", required: false }
];
```

## 10. MVP 구현 우선순위

### 10-1. P0

| 항목 | 범위 |
| --- | --- |
| 프로젝트 초기 세팅 | Next.js, TypeScript, Tailwind, Supabase 연결 |
| 기본 레이아웃 | 헤더, 푸터, 모바일 고정 CTA, 공통 UI |
| 핵심 공개 페이지 | 홈, 통신사 상세, 상품 상세, 신청 페이지, 완료 페이지 |
| 문의 기능 | 간편 문의/상품 문의/신청 문의 API 저장 |
| DB 및 시드 | products, posts, reviews, inquiries, settings 기본 테이블 및 시드 |
| 관리자 핵심 | 로그인, 문의 목록, 문의 상세, 상태 변경, 메모 저장 |

### 10-2. P1

| 항목 | 범위 |
| --- | --- |
| 비교/콘텐츠 페이지 | 상품 비교, 후기 목록/상세, 게시판 목록/상세 |
| 관리자 콘텐츠 관리 | 상품 CRUD, 게시물 CRUD, 대표 설정 수정 |
| 재검증 처리 | 콘텐츠 수정 후 공개 페이지 갱신 |
| 정책 페이지 | 이용약관/개인정보처리방침 뼈대 |

### 10-3. P2

| 항목 | 범위 |
| --- | --- |
| CSV 내보내기 | 문의 목록 다운로드 |
| 기본 통계 | 오늘 문의 수, 상태별 카운트 |
| 스팸 방지 | 숨김 필드, rate limit, captcha-lite 검토 |
| 실제 데이터 전환 유틸 | CSV/JSON import 스크립트 |

## 11. 1차 제작물 일정안

### 일정 가정

| 항목 | 가정 |
| --- | --- |
| 개발 인력 | 1명 풀스택 개발자 기준 |
| 디자인 상태 | 방향 문서 확정 후 상세 시안 또는 컴포넌트 기준 전달 |
| 콘텐츠 상태 | 가상 데이터/카피는 기획 문서 기준으로 제공 가능 |
| 일정 기준 | 영업일 15일 기준 |

### 상세 일정

| 기간 | 작업 | 산출물 |
| --- | --- | --- |
| Day 1 | 프로젝트 세팅, 환경변수, DB 설계 확정 | 초기 리포지토리, DB 초안 |
| Day 2 | 공통 레이아웃, 디자인 토큰, UI 컴포넌트 베이스 | 헤더/푸터/버튼/폼 공통 |
| Day 3-4 | 홈, 통신사 상세, 상품 상세 구현 | 핵심 공개 페이지 1차 |
| Day 5 | 신청 페이지, 문의 완료, 정책 페이지 구현 | 문의 흐름 완성 |
| Day 6 | 문의 API, 검증, DB 저장 연결 | 문의 저장 가능 상태 |
| Day 7 | 시드 데이터 구조, 상품/게시물/후기 데이터 적재 | 가상 데이터 반영 |
| Day 8-9 | 후기/게시판/상품 비교 페이지 구현 | 정보성 페이지 완성 |
| Day 10 | 관리자 로그인, 대시보드 기본, 문의 목록 | 관리자 핵심 1차 |
| Day 11 | 문의 상세, 상태 변경, 메모 저장 | 관리자 핵심 완성 |
| Day 12 | 상품/게시물 관리 MVP, 설정 페이지 | 콘텐츠 운영 가능 상태 |
| Day 13 | 모바일 대응, 반응형 정리, CTA 점검 | UI/UX 안정화 |
| Day 14 | QA, 예외 처리, 오류 메시지, 배포 환경 점검 | 배포 후보본 |
| Day 15 | 배포, 시드 반영, 인수인계 문서 정리 | 1차 납품본 |

## 12. 리스크 및 대응

| 리스크 | 설명 | 대응 |
| --- | --- | --- |
| 실제 상품 구조 변경 | 가상 상품 구조와 실상품 구조가 다를 수 있음 | `detail_sections`, `payload_json`, `tags` 등 유연한 json 필드 사용 |
| 관리자 범위 확대 | 1차인데 권한/히스토리/에디터 요구가 커질 수 있음 | MVP 범위를 문서로 고정하고 후속 범위 분리 |
| 데이터 교체 작업 과다 | 실제 운영 전 수작업 교체가 많아질 수 있음 | 시드 스크립트와 import 스크립트를 함께 준비 |
| 스팸 문의 | 공개 폼에 자동 등록이 들어올 수 있음 | 서버 검증, 숨김 필드, rate limit, 추후 captcha 추가 |
| 모바일 비교표 가독성 | 데스크톱 기준 비교표가 모바일에서 깨질 수 있음 | 표 대신 카드 스택/아코디언 병행 |
| 캐시 반영 지연 | 관리자 수정 후 공개 페이지 즉시 반영이 안 될 수 있음 | revalidate API 또는 태그 기반 재검증 적용 |
| 법무 문안 변경 | 실제 사업자/정책 문안이 후반에 바뀔 수 있음 | `site_settings`와 정적 정책 페이지를 분리해 수정 용이화 |
| 벤더 종속 | Supabase 의존도가 생김 | Repository 계층으로 DB 접근 추상화 |

## 13. 제작 체크리스트

### 13-1. 개발 착수 체크리스트

| 체크 항목 | 확인 |
| --- | --- |
| 기획 문서 기준 페이지 범위 확정 | 필수 |
| 디자인 방향 문서 기준 컬러/컴포넌트 합의 | 필수 |
| URL 구조 확정 | 필수 |
| 문의 상태값 확정 | 필수 |
| 관리자 계정 정책 확정 | 필수 |
| 사업자 정보/정책 임시 문안 준비 | 필수 |

### 13-2. 구현 체크리스트

| 체크 항목 | 확인 |
| --- | --- |
| 홈/상세/게시판/후기/신청 페이지 구현 | 필수 |
| 메인 문의 폼 저장 | 필수 |
| 상품 상세 문의 폼 저장 | 필수 |
| 신청 페이지 문의 저장 | 필수 |
| 관리자 로그인 및 문의 관리 | 필수 |
| 상품/게시물 가상 데이터 시드 | 필수 |
| 모바일 고정 CTA | 필수 |
| 개인정보 동의 체크 및 기록 | 필수 |
| 정책 페이지 연결 | 필수 |
| 에러/성공 메시지 처리 | 필수 |

### 13-3. 배포 전 체크리스트

| 체크 항목 | 확인 |
| --- | --- |
| 환경변수 분리 | 필수 |
| 관리자 경로 보호 확인 | 필수 |
| DB 쓰기 권한 검증 | 필수 |
| 가상 데이터 노출 문구 확인 | 필수 |
| 문의 저장/조회/상태 변경 QA | 필수 |
| 모바일 360px 대응 확인 | 필수 |
| 전화 CTA 링크 확인 | 필수 |
| SEO 기본 메타/OG 설정 | 권장 |
| favicon, 대표 이미지 등록 | 권장 |

## 14. 최종 권장 구현안

| 항목 | 최종 권장안 |
| --- | --- |
| 개발 방식 | `Next.js 기반 하이브리드 웹` |
| 서버 전략 | `전용 백엔드 서버는 두지 않고, 서버리스 API로 처리` |
| 데이터 전략 | `Supabase DB에 가상 데이터를 seed로 적재하고, 운영 전 실제 데이터로 교체` |
| 관리자 전략 | `문의 관리 + 상품/게시물 관리 + 설정 수정` 수준의 MVP만 구현 |
| 폼 전략 | `메인 간편문의는 최소 필드, 상품 상세 폼은 설정 기반 + payload_json 저장으로 확장 가능` |
| 1차 납품 기준 | `공개 페이지 완성 + 문의 저장 가능 + 관리자 MVP 동작 + 모바일 대응 + 정책 뼈대` |

