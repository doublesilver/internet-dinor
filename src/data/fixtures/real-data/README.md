# 실데이터 교체 가이드

이 폴더는 1차 가상 데이터를 실제 운영 데이터로 교체할 때 사용하는 JSON 템플릿 보관 위치입니다.

## 파일 규칙

- `carriers.json`
- `products.json`
- `posts.json`
- `reviews.json`
- `site-settings.json`

## 사용 방법

1. 템플릿 파일을 실제 데이터로 수정합니다.
2. `.env.local`에 Supabase 환경변수를 입력합니다.
3. `npm run import:real-data`를 실행합니다.

## 주의

- `slug`는 URL에 사용되므로 중복되면 안 됩니다.
- `products.json`의 `carrierId`는 `carriers.json`의 실제 ID와 맞아야 합니다.
- 실제 운영 전 사업자 정보와 정책 링크는 반드시 확정 문안으로 교체해야 합니다.
