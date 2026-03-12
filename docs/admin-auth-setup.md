# 인터넷공룡 관리자 인증 전환 가이드

| 항목 | 1차 권장값 | 설명 |
| --- | --- | --- |
| 인증 모드 | Supabase Auth | 실제 운영 전환 시 권장 |
| fallback 모드 | Preview Login | 선수금 수령용 데모/임시 운영용 |
| 허용 관리자 | `ADMIN_ALLOWED_EMAILS` | MVP는 이메일 allowlist 단일 관리 방식 |

## 1. 동작 방식

| 조건 | 적용 모드 | 비고 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `ADMIN_ALLOWED_EMAILS` 설정 | Supabase Auth | 권장 운영 모드 |
| 위 조건 미충족 | Preview Login | 환경변수 기반 임시 로그인 |

## 2. Supabase Auth 설정 항목

| 환경변수 | 예시 | 필수 여부 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | 필수 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | 필수 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | 콘텐츠/문의 DB 저장용 필수 |
| `ADMIN_ALLOWED_EMAILS` | `admin@example.com` | 필수 |

## 3. Supabase Dashboard 준비 순서

| 순서 | 작업 | 비고 |
| --- | --- | --- |
| 1 | Authentication > Sign In / Providers에서 Email 활성화 | 이메일/비밀번호 로그인 사용 |
| 2 | Authentication > Users에서 관리자 계정 생성 | allowlist 이메일과 동일해야 함 |
| 3 | Project Settings > API에서 URL / anon key / service role key 확인 | `.env.local` 반영 |
| 4 | 관리자 로그인 테스트 | `/admin/login` |

## 4. 운영 메모

| 항목 | 현재 구현 | 후속 고도화 |
| --- | --- | --- |
| 관리자 권한 | 이메일 allowlist | `profiles` / `admins` 테이블 role 분리 |
| 세션 유지 | access token 유효기간 기준 | refresh token 자동 갱신 |
| 보안 | httpOnly cookie | MFA, 감사 로그 |

## 5. 외주 1차 기준

| 구분 | 포함 | 제외 |
| --- | --- | --- |
| 인증 | Supabase Auth 연동 구조, fallback 로그인 | MFA, 소셜 로그인 |
| 권한 | 단일 관리자 이메일 allowlist | 세분화된 역할 체계 |
| 운영 | 관리자 페이지 접근 보호 | 상세 접속 이력 관리 |
