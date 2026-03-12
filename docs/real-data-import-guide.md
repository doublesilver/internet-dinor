# 인터넷공룡 실데이터 교체 가이드

## 1. 목적

| 항목 | 내용 |
| --- | --- |
| 목적 | 1차 가상 데이터 기반 제작물을 실제 운영용 데이터로 안전하게 교체하기 위한 절차 정리 |
| 적용 시점 | 디자인/구조 확정 후, 운영 전 상품/후기/게시물/사업자 정보 반영 단계 |
| 전제 | Supabase DB와 `.env.local` 연결이 완료된 상태 |

## 2. 교체 대상 파일

| 파일 | 역할 |
| --- | --- |
| `src/data/fixtures/real-data/carriers.template.json` | 통신사 정보 템플릿 |
| `src/data/fixtures/real-data/products.template.json` | 상품 정보 템플릿 |
| `src/data/fixtures/real-data/posts.template.json` | 이벤트/가이드/공지 템플릿 |
| `src/data/fixtures/real-data/reviews.template.json` | 후기 템플릿 |
| `src/data/fixtures/real-data/site-settings.template.json` | 대표번호/사업자 정보 템플릿 |

## 3. 적용 절차

| 순서 | 작업 |
| --- | --- |
| 1 | 템플릿 파일을 복사해 `carriers.json`, `products.json`, `posts.json`, `reviews.json`, `site-settings.json` 생성 |
| 2 | 실제 운영 데이터로 값 수정 |
| 3 | `.env.local`에 Supabase URL / anon key / service role key 입력 |
| 4 | `npm run import:real-data` 실행 |
| 5 | 관리자/공개 페이지에서 값 반영 여부 확인 |

## 4. 주의 사항

| 항목 | 설명 |
| --- | --- |
| slug 중복 금지 | URL 경로 충돌이 발생함 |
| 상품-통신사 연결 | `products.json`의 `carrierId`는 실제 carriers 데이터와 일치해야 함 |
| 사업자 정보 | 푸터, 정책, 관리자 설정에 공통 사용되므로 실제 값으로 최종 확인 필요 |
| 후기/이벤트 문구 | 실제 운영 전 가상/예시 표현이 남아 있지 않은지 확인 필요 |
| 정책 페이지 | 문구는 현재 뼈대 수준이므로 운영 전 최종 법무 문안 반영 필요 |

