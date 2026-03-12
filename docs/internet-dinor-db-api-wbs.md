# 인터넷공룡 다음 단계 실행안

## 0. 문서 개요

| 항목 | 내용 |
| --- | --- |
| 문서 목적 | 1차 개발 명세 다음 단계로, DB 스키마/API 명세/개발 WBS를 실제 착수 수준으로 정리 |
| 기준 문서 | 기획안, 디자인 방향서, 개발 명세, 작업 기준 메모 |
| 사용 대상 | 개발자, PM, QA |
| 결과물 범위 | Supabase SQL 초안, API 계약, 구현 태스크 분해 |

## 1. 다음 단계 목표

| 목표 | 설명 |
| --- | --- |
| DB 확정 | 테이블, 필드, 인덱스, 상태값을 정해 바로 생성 가능하게 함 |
| API 확정 | 프런트/관리자/백엔드 간 요청/응답 계약을 고정 |
| 태스크 분해 | 개발 순서와 작업 단위를 명확히 해 일정 예측 가능하게 함 |

## 2. DB 스키마 설계 요약

| 테이블 | 핵심 역할 | 우선순위 |
| --- | --- | --- |
| `carriers` | 통신사 기본 정보 | P1 |
| `products` | 상품 상세/비교/대표 노출 데이터 | P0 |
| `posts` | 이벤트/공지/가이드 통합 관리 | P1 |
| `reviews` | 후기 데이터 | P1 |
| `inquiries` | 모든 문의 저장 | P0 |
| `site_settings` | 대표 전화, CTA, 사업자 정보, 정책 링크 | P0 |
| `admin_profiles` | 관리자 정보 및 권한 레벨 | P0 |

## 3. DB 테이블 상세 명세

### 3-1. `carriers`

| 필드 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | uuid | PK | 통신사 ID |
| `slug` | text | unique, not null | URL 식별값 |
| `name` | text | not null | 표시명 |
| `short_name` | text | not null | 짧은 표시명 |
| `summary` | text | null | 한 줄 설명 |
| `hero_title` | text | null | 통신사 상세 상단 제목 |
| `hero_description` | text | null | 상단 설명 |
| `feature_points` | jsonb | default `[]` | 특징 목록 |
| `status` | text | check | `draft`, `published` |
| `sort_order` | int | default 0 | 정렬 |
| `created_at` | timestamptz | not null | 생성일 |
| `updated_at` | timestamptz | not null | 수정일 |

### 3-2. `products`

| 필드 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | uuid | PK | 상품 ID |
| `carrier_id` | uuid | FK | 통신사 참조 |
| `slug` | text | unique, not null | URL 식별값 |
| `name` | text | not null | 상품명 |
| `summary` | text | null | 카드용 요약 |
| `description` | text | null | 상세 상단 설명 |
| `bundle_type` | text | check | `internet_only`, `internet_tv`, `business`, `custom` |
| `internet_speed` | text | null | 100M/500M/1G |
| `tv_included` | boolean | default false | TV 포함 여부 |
| `monthly_price_label` | text | null | 가상 요금 노출값 |
| `benefit_label` | text | null | 혜택 문구 |
| `badge_tags` | jsonb | default `[]` | 추천/인기 등 |
| `target_tags` | jsonb | default `[]` | 가족/1인가구 등 |
| `hero_points` | jsonb | default `[]` | 상단 핵심 포인트 |
| `detail_sections` | jsonb | default `[]` | 상세 설명 블록 |
| `faq_items` | jsonb | default `[]` | 상품별 FAQ |
| `is_featured` | boolean | default false | 메인 대표상품 여부 |
| `status` | text | check | `draft`, `published` |
| `sort_order` | int | default 0 | 정렬 |
| `created_at` | timestamptz | not null | 생성일 |
| `updated_at` | timestamptz | not null | 수정일 |

### 3-3. `posts`

| 필드 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | uuid | PK | 게시물 ID |
| `type` | text | check | `event`, `guide`, `notice` |
| `slug` | text | unique, not null | URL 식별값 |
| `title` | text | not null | 제목 |
| `summary` | text | null | 목록 요약 |
| `body` | text | not null | 본문 |
| `thumbnail_url` | text | null | 썸네일 |
| `cta_label` | text | null | CTA 문구 |
| `related_product_slugs` | jsonb | default `[]` | 연관 상품 |
| `is_featured` | boolean | default false | 메인 노출 여부 |
| `published_at` | timestamptz | null | 게시일 |
| `status` | text | check | `draft`, `published` |
| `created_at` | timestamptz | not null | 생성일 |
| `updated_at` | timestamptz | not null | 수정일 |

### 3-4. `reviews`

| 필드 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | uuid | PK | 후기 ID |
| `slug` | text | unique, not null | URL 식별값 |
| `title` | text | not null | 제목 |
| `summary` | text | null | 요약 |
| `body` | text | not null | 본문 |
| `review_type` | text | check | `internet_only`, `internet_tv`, `moving`, `bundle`, `renewal` |
| `tags` | jsonb | default `[]` | 태그 |
| `featured` | boolean | default false | 베스트 후기 여부 |
| `published_at` | timestamptz | null | 게시일 |
| `status` | text | check | `draft`, `published` |
| `created_at` | timestamptz | not null | 생성일 |
| `updated_at` | timestamptz | not null | 수정일 |

### 3-5. `inquiries`

| 필드 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | uuid | PK | 문의 ID |
| `inquiry_type` | text | check | `quick`, `product`, `apply` |
| `name` | text | not null | 이름 |
| `phone` | text | not null | 연락처 |
| `product_id` | uuid | FK nullable | 상품 문의 참조 |
| `carrier_slug` | text | null | 통신사 맥락 |
| `source_page` | text | not null | 접수 페이지 |
| `status` | text | check | `new`, `pending`, `contacted`, `retry`, `consulted`, `in_progress`, `closed` |
| `privacy_agreed` | boolean | not null | 동의 여부 |
| `region_label` | text | null | 설치 지역 |
| `contact_time_preference` | text | null | 연락 희망 시간 |
| `payload_json` | jsonb | default `{}` | 상세 폼 확장 데이터 |
| `utm_json` | jsonb | default `{}` | 추적 데이터 |
| `admin_memo` | text | null | 관리자 메모 |
| `created_at` | timestamptz | not null | 접수일 |
| `updated_at` | timestamptz | not null | 수정일 |

### 3-6. `site_settings`

| 필드 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | uuid | PK | 설정 ID |
| `site_name` | text | not null | 사이트명 |
| `phone_label` | text | not null | 대표번호 표시값 |
| `phone_link` | text | not null | `tel:` 링크 |
| `hero_cta_label` | text | not null | 메인 CTA |
| `secondary_cta_label` | text | null | 보조 CTA |
| `business_info_json` | jsonb | default `{}` | 사업자 정보 |
| `policy_links_json` | jsonb | default `{}` | 정책 링크 |
| `footer_notice` | text | null | 푸터 문구 |
| `created_at` | timestamptz | not null | 생성일 |
| `updated_at` | timestamptz | not null | 수정일 |

### 3-7. `admin_profiles`

| 필드 | 타입 | 제약 | 설명 |
| --- | --- | --- | --- |
| `id` | uuid | PK/FK(auth.users.id) | 관리자 사용자 ID |
| `email` | text | unique, not null | 로그인 이메일 |
| `display_name` | text | not null | 표시명 |
| `role` | text | check | `super_admin`, `operator` |
| `is_active` | boolean | default true | 활성화 여부 |
| `created_at` | timestamptz | not null | 생성일 |
| `updated_at` | timestamptz | not null | 수정일 |

## 4. 인덱스 / 제약 / 운영 규칙

| 항목 | 적용 내용 |
| --- | --- |
| slug 인덱스 | `carriers.slug`, `products.slug`, `posts.slug`, `reviews.slug` 유니크 인덱스 |
| 목록 조회 인덱스 | `products(status, sort_order)`, `posts(type, status, published_at)`, `reviews(status, published_at)` |
| 문의 조회 인덱스 | `inquiries(status, created_at desc)`, `inquiries(inquiry_type, created_at desc)`, `inquiries(product_id)` |
| 참조 무결성 | 상품의 `carrier_id`, 문의의 `product_id`는 FK 적용 |
| 상태값 관리 | enum 대신 check constraint 기반으로 1차 구현하여 변경 유연성 확보 |
| 확장 데이터 | 자주 변할 가능성이 큰 필드는 `jsonb`로 유연하게 처리 |

## 5. API 명세

### 5-1. 공통 규칙

| 항목 | 기준 |
| --- | --- |
| 응답 포맷 | `{ success: boolean, message?: string, data?: any, errors?: any }` |
| 콘텐츠 타입 | `application/json` |
| 인증 방식 | 공개 API는 비인증, 관리자 API는 서버 세션 또는 토큰 기반 |
| 검증 | 모든 입력은 서버에서 Zod로 재검증 |
| 에러 처리 | 400(입력 오류), 401(인증 없음), 403(권한 없음), 404(대상 없음), 500(서버 오류) |

### 5-2. `POST /api/inquiries/quick`

| 항목 | 내용 |
| --- | --- |
| 목적 | 홈/공통 하단의 간편 문의 저장 |
| 요청 필드 | `name`, `phone`, `privacyAgreed`, `sourcePage`, `utm` |
| 필수 필드 | `name`, `phone`, `privacyAgreed`, `sourcePage` |
| 저장 타입 | `inquiry_type = quick` |
| 성공 응답 | 접수 ID와 완료 페이지 이동 여부 반환 |

```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "privacyAgreed": true,
  "sourcePage": "/",
  "utm": {
    "utm_source": "naver"
  }
}
```

### 5-3. `POST /api/inquiries/product`

| 항목 | 내용 |
| --- | --- |
| 목적 | 상품 상세 문의 저장 |
| 요청 필드 | `name`, `phone`, `productSlug`, `sourcePage`, `privacyAgreed`, `regionLabel`, `contactTimePreference`, `payload` |
| 필수 필드 | `name`, `phone`, `productSlug`, `sourcePage`, `privacyAgreed` |
| 저장 타입 | `inquiry_type = product` |
| 특징 | 상품별 확장 필드를 `payload`로 전달 |

```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "productSlug": "safe-500-tv-basic",
  "sourcePage": "/products/safe-500-tv-basic",
  "privacyAgreed": true,
  "regionLabel": "서울 강동구",
  "contactTimePreference": "evening",
  "payload": {
    "signup_type": "carrier_change",
    "desired_bundle": "internet_tv",
    "desired_speed": "500M",
    "tv_required": true,
    "mobile_bundle_interest": "interested",
    "memo": "이사 예정"
  }
}
```

### 5-4. `POST /api/inquiries/apply`

| 항목 | 내용 |
| --- | --- |
| 목적 | 신청 페이지의 구체적 상담 접수 저장 |
| 요청 필드 | `name`, `phone`, `regionLabel`, `privacyAgreed`, `payload`, `sourcePage` |
| 저장 타입 | `inquiry_type = apply` |
| 특징 | 상품 선택 없이도 접수 가능 |

### 5-5. `PATCH /api/admin/inquiries/[id]`

| 항목 | 내용 |
| --- | --- |
| 목적 | 문의 상태/메모 수정 |
| 인증 | 관리자 필수 |
| 요청 필드 | `status`, `adminMemo` |
| 필수 필드 | 둘 중 하나 이상 |
| 비고 | 수정 시 `updated_at` 갱신 |

```json
{
  "status": "contacted",
  "adminMemo": "1차 상담 완료, 재약정 비교 요청"
}
```

### 5-6. `POST /api/admin/products`

| 항목 | 내용 |
| --- | --- |
| 목적 | 상품 등록 |
| 인증 | 관리자 필수 |
| 요청 필드 | 상품 테이블 주요 필드 전체 |
| 비고 | `status = draft` 기본값 가능 |

### 5-7. `PATCH /api/admin/products/[id]`

| 항목 | 내용 |
| --- | --- |
| 목적 | 상품 수정 |
| 인증 | 관리자 필수 |
| 요청 필드 | 수정 대상 필드 일부 또는 전체 |
| 후처리 | 성공 시 상품 상세/비교/홈 캐시 재검증 |

### 5-8. `POST /api/admin/posts`

| 항목 | 내용 |
| --- | --- |
| 목적 | 이벤트/가이드/공지/후기 등록 |
| 인증 | 관리자 필수 |
| 방식 | 1차는 `posts`와 `reviews`를 분리 관리하므로 라우트도 분리 가능 |

### 5-9. `PATCH /api/admin/settings`

| 항목 | 내용 |
| --- | --- |
| 목적 | 대표번호, CTA, 사업자 정보 수정 |
| 인증 | 관리자 필수 |
| 비고 | 푸터/헤더/메인 CTA에 공통 반영 |

## 6. 화면-API 매핑

| 화면 | API | 동작 |
| --- | --- | --- |
| 홈 빠른 문의 폼 | `POST /api/inquiries/quick` | 접수 후 완료 페이지 이동 |
| 상품 상세 문의 폼 | `POST /api/inquiries/product` | 상품 맥락 포함 저장 |
| 신청 페이지 폼 | `POST /api/inquiries/apply` | 구체 조건 포함 저장 |
| 관리자 문의 상세 | `PATCH /api/admin/inquiries/[id]` | 상태/메모 수정 |
| 관리자 상품 관리 | `POST/PATCH /api/admin/products` | 상품 등록/수정 |
| 관리자 게시물 관리 | `POST/PATCH /api/admin/posts` | 게시물 등록/수정 |
| 관리자 설정 | `PATCH /api/admin/settings` | 공통 설정 수정 |

## 7. 개발 WBS

### 7-1. 세팅 단계

| 번호 | 작업 | 산출물 | 선행 |
| --- | --- | --- | --- |
| 1 | Next.js 프로젝트 초기화 | 기본 리포지토리 | - |
| 2 | Tailwind, ESLint, Prettier 설정 | 코드 규칙 | 1 |
| 3 | Supabase 프로젝트 생성 및 env 연결 | `.env` 구조 | 1 |
| 4 | 기본 폴더 구조 생성 | `src/app`, `components`, `lib`, `data` | 1 |

### 7-2. 데이터/서버 단계

| 번호 | 작업 | 산출물 | 선행 |
| --- | --- | --- | --- |
| 5 | DB 스키마 SQL 작성/적용 | 테이블 생성 | 3 |
| 6 | 시드 데이터 JSON/TS 작성 | 가상 데이터 세트 | 5 |
| 7 | seed 스크립트 구현 | 초기 데이터 적재 | 6 |
| 8 | 도메인 타입 정의 | `types/*` | 5 |
| 9 | repository 계층 구현 | 상품/게시물/문의 데이터 접근 함수 | 8 |
| 10 | Zod 검증 스키마 작성 | 문의/관리자 입력 검증 | 8 |
| 11 | 문의 API 구현 | quick/product/apply API | 9,10 |
| 12 | 관리자 API 구현 | inquiries/products/posts/settings API | 9,10 |

### 7-3. 공개 페이지 단계

| 번호 | 작업 | 산출물 | 선행 |
| --- | --- | --- | --- |
| 13 | 공통 레이아웃 구현 | 헤더/푸터/모바일 CTA | 2 |
| 14 | 공통 UI 컴포넌트 구현 | 버튼/인풋/카드/아코디언 | 2 |
| 15 | 홈 페이지 구현 | 메인 랜딩 | 13,14,9 |
| 16 | 통신사 상세 구현 | `/carriers/[slug]` | 13,14,9 |
| 17 | 상품 상세 구현 | `/products/[slug]` | 13,14,9 |
| 18 | 후기 목록/상세 구현 | `/reviews` | 13,14,9 |
| 19 | 게시판 목록/상세 구현 | `/board/*` | 13,14,9 |
| 20 | 신청 페이지 구현 | `/apply` | 13,14,9 |
| 21 | 문의 완료/정책 페이지 구현 | 정적 페이지 | 13 |

### 7-4. 관리자 단계

| 번호 | 작업 | 산출물 | 선행 |
| --- | --- | --- | --- |
| 22 | 관리자 로그인 구현 | `/admin/login` | 3 |
| 23 | 관리자 레이아웃 구현 | 사이드바/상단바 | 22 |
| 24 | 문의 목록/상세 구현 | `/admin/inquiries*` | 12,23 |
| 25 | 상품 관리 구현 | `/admin/products*` | 12,23 |
| 26 | 게시물 관리 구현 | `/admin/posts*` | 12,23 |
| 27 | 설정 관리 구현 | `/admin/settings` | 12,23 |

### 7-5. QA/배포 단계

| 번호 | 작업 | 산출물 | 선행 |
| --- | --- | --- | --- |
| 28 | 반응형/모바일 QA | 모바일 보정 | 15~27 |
| 29 | 폼 오류 처리/에러 메시지 QA | 예외 처리 완료 | 11,12,15,17,20,24 |
| 30 | 캐시 재검증/배포 설정 | 운영 배포본 | 12,15~27 |
| 31 | 인수인계 문서 정리 | 운영/수정 가이드 | 30 |

## 8. 개발자 착수 순서 제안

| 순서 | 먼저 할 일 | 이유 |
| --- | --- | --- |
| 1 | DB 스키마와 시드부터 고정 | 공개 페이지와 관리자 모두 데이터 구조 의존도가 높음 |
| 2 | 문의 API와 검증 작성 | 핵심 전환 기능이므로 가장 먼저 안정화해야 함 |
| 3 | 홈/상품 상세/신청 페이지부터 구현 | 실제 데모와 전환 구조의 중심 |
| 4 | 관리자 문의 관리 구현 | 납품 시 운영 가능 여부를 보여주는 핵심 |
| 5 | 후기/게시판/비교 페이지 확장 | 신뢰 콘텐츠는 후순위지만 1차 범위 포함 |

## 9. 다음 단계 산출물 목록

| 파일 | 역할 |
| --- | --- |
| `docs/client-requirements-outsourcing-guardrails.md` | 작업 기준 상기 문서 |
| `docs/internet-dinor-dev-spec-mvp.md` | 개발 방식 및 MVP 명세 |
| `docs/internet-dinor-db-api-wbs.md` | DB/API/WBS 실행 문서 |
| `db/supabase-schema.sql` | 실제 적용 가능한 SQL 초안 |

