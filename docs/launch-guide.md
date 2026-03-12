# 인터넷공룡 운영 런칭 가이드

> 개발자가 아닌 운영자가 직접 따라할 수 있도록 작성한 단계별 가이드입니다.

---

## STEP 1. Supabase 프로젝트 생성 (DB 준비)

### 1-1. Supabase 가입 및 프로젝트 생성
1. https://supabase.com 접속 → **Start your project** 클릭
2. GitHub 계정으로 로그인
3. **New Project** 클릭
4. 아래 내용 입력:
   - **Name**: `internet-dinor`
   - **Database Password**: 안전한 비밀번호 입력 (따로 메모해두세요)
   - **Region**: `Northeast Asia (Seoul)` 선택
5. **Create new project** 클릭 → 2~3분 대기

### 1-2. DB 스키마 적용 (테이블 생성)
1. Supabase 대시보드 왼쪽 메뉴 → **SQL Editor** 클릭
2. **New query** 클릭
3. 프로젝트 폴더의 `db/supabase-schema.sql` 파일 내용을 전체 복사해서 붙여넣기
4. **Run** 클릭
5. "Success. No rows returned" 메시지 확인

### 1-3. API 키 확인
1. 왼쪽 메뉴 → **Project Settings** → **API**
2. 아래 3개 값을 메모:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`용
   - **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`용
   - **service_role secret** 키 → `SUPABASE_SERVICE_ROLE_KEY`용

> service_role 키는 절대 외부에 노출하지 마세요.

---

## STEP 2. 관리자 계정 생성

### 2-1. Supabase Auth 사용자 생성
1. Supabase 대시보드 → **Authentication** → **Users**
2. **Add user** → **Create new user** 클릭
3. 입력:
   - **Email**: 관리자로 사용할 이메일 (예: `admin@인터넷공룡.com` 또는 본인 이메일)
   - **Password**: 관리자 비밀번호
   - **Auto Confirm User** 체크 ✅
4. **Create user** 클릭

### 2-2. Email Provider 확인
1. **Authentication** → **Providers**
2. **Email** 항목이 **Enabled** 상태인지 확인
3. 비활성 상태면 토글로 켜기

---

## STEP 3. Vercel 환경변수 설정

1. https://vercel.com 로그인 → **internet_dinor** 프로젝트 클릭
2. **Settings** → **Environment Variables**
3. 아래 변수들을 하나씩 추가 (Environment는 **Production, Preview, Development** 모두 체크):

| Key | Value | 설명 |
|-----|-------|------|
| `NEXT_PUBLIC_SITE_URL` | `https://인터넷공룡.com` | 사이트 도메인 |
| `NEXT_PUBLIC_SUPABASE_URL` | STEP 1-3에서 메모한 Project URL | Supabase 연결 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | STEP 1-3에서 메모한 anon key | Supabase 공개 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | STEP 1-3에서 메모한 service_role key | DB 읽기/쓰기용 |
| `ADMIN_ALLOWED_EMAILS` | STEP 2에서 생성한 관리자 이메일 | 관리자 접근 허용 |

4. 모두 입력 후 → 상단 **Deployments** 탭 → 가장 최근 배포의 **⋮** 메뉴 → **Redeploy** 클릭

> 환경변수 변경 후 반드시 **재배포**해야 적용됩니다.

---

## STEP 4. 관리자 로그인 테스트

1. `https://인터넷공룡.com/admin/login` 접속
2. STEP 2에서 생성한 이메일/비밀번호로 로그인
3. 관리자 대시보드가 정상 노출되면 성공

---

## STEP 5. 실제 데이터 입력

관리자 페이지에서 직접 입력하는 것이 가장 간편합니다.

### 5-1. 사이트 기본 설정
1. `/admin/settings` 접속
2. 아래 항목 수정:
   - **사이트명**: 인터넷공룡 (또는 원하는 이름)
   - **대표번호**: 실제 상담 전화번호
   - **CTA 문구**: "30초 상담 받기" 등
   - **사업자 정보**: 대표자, 사업자등록번호, 주소, 이메일
   - **푸터 문구**: 하단 고지 문구

### 5-2. 통신사 등록 (선택)
> 현재 가상 데이터(SK, KT, LG)가 시드로 포함되어 있습니다.
> Supabase 연결 후에는 관리자에서 직접 등록해야 합니다.

Supabase 대시보드 → **Table Editor** → `carriers` 테이블에서 직접 추가하거나,
`npm run seed` 명령으로 가상 데이터를 DB에 넣을 수 있습니다.

### 5-3. 상품 등록
1. `/admin/products/new` 접속
2. 실제 상품 정보 입력:
   - 상품명, 슬러그(URL용 영문), 통신사, 구성, 속도, 요금, 혜택 등
3. 상태를 **published**로 설정해야 사이트에 노출

### 5-4. 게시물 등록 (이벤트/가이드/공지)
1. `/admin/posts/new` 접속
2. 타입 선택 (이벤트/가이드/공지/후기)
3. 제목, 내용, 상태 입력

### 5-5. 문의 테스트
1. 메인 페이지에서 빠른 문의 폼 제출
2. `/admin/inquiries`에서 접수 확인
3. 상태 변경, 메모 입력 테스트

---

## STEP 6. 정책 페이지 수정

현재 개인정보처리방침과 이용약관은 **뼈대 수준**입니다.
실제 운영 전 반드시 수정이 필요합니다.

### 수정 대상 파일
| 페이지 | 파일 경로 |
|--------|-----------|
| 개인정보처리방침 | `src/app/policy/privacy/page.tsx` |
| 이용약관 | `src/app/policy/terms/page.tsx` |

### 필수 반영 사항
- **수집 항목**: 이름, 연락처, 설치 지역, 연락 희망 시간
- **수집 목적**: 인터넷/TV 상담 연결
- **보유 기간**: 상담 완료 후 1년 (또는 사업 기준에 맞게)
- **사업자 정보**: 실제 상호명, 대표자, 사업자등록번호, 주소

> 정식 문안은 법률 자문을 받는 것을 권장합니다.

---

## STEP 7. 검색엔진 등록 (SEO)

### 7-1. Google Search Console
1. https://search.google.com/search-console 접속
2. **URL 접두어** 방식으로 `https://인터넷공룡.com` 입력
3. 소유권 확인 방법: **HTML 태그** 또는 **DNS TXT 레코드**
   - DNS 방식: 가비아 DNS 관리에서 TXT 레코드 추가
4. 소유권 확인 후 → **Sitemaps** 메뉴 → `https://인터넷공룡.com/sitemap.xml` 제출

### 7-2. Naver Search Advisor
1. https://searchadvisor.naver.com 접속
2. **웹마스터 도구** → 사이트 추가: `https://인터넷공룡.com`
3. 소유권 확인 (HTML 태그 또는 DNS)
4. **요청** → **사이트맵 제출** → `https://인터넷공룡.com/sitemap.xml`
5. **요청** → **웹 페이지 수집** → 메인 URL 수집 요청

> 검색 노출까지 보통 1~4주 소요됩니다.

---

## STEP 8. Google Analytics 연동 (선택)

### 8-1. GA4 계정 생성
1. https://analytics.google.com 접속
2. **관리** → **만들기** → **속성** 생성
3. 데이터 스트림 → **웹** 선택 → 도메인 입력
4. **측정 ID** 복사 (G-XXXXXXXXXX 형식)

### 8-2. 사이트에 적용
코드 수정이 필요합니다. 다음 세션에서 요청해주세요:
- "GA4 측정 ID G-XXXXXXXXXX 연동해줘"

---

## 운영 체크리스트

모든 STEP 완료 후 최종 확인:

| 확인 항목 | 확인 방법 |
|-----------|-----------|
| 사이트 접속 | `https://인터넷공룡.com` 정상 로딩 |
| 관리자 로그인 | `/admin/login` → 대시보드 진입 |
| 빠른 문의 접수 | 메인 폼 제출 → 관리자 문의 목록 확인 |
| 상품 문의 접수 | 상품 상세 폼 제출 → 관리자 확인 |
| 상품 노출 | 상품 비교 페이지에서 등록한 상품 확인 |
| 전화 연결 | 전화 상담 버튼 클릭 → 전화 연결 |
| 사업자 정보 | 푸터에 실제 사업자 정보 노출 |
| 정책 페이지 | 개인정보처리방침/이용약관 실제 문안 반영 |
| Sitemap | `/sitemap.xml` 접속 가능 |
| 검색엔진 | Search Console/Search Advisor에 sitemap 제출 완료 |

---

## 문의/수정 요청 시

코드 수정이 필요한 작업은 이 프로젝트 폴더에서 Claude Code를 실행한 뒤 요청하세요:
- "GA4 연동해줘"
- "개인정보처리방침 내용 수정해줘"
- "새로운 페이지 추가해줘"
- "디자인 수정해줘"

수정 후 GitHub에 push하면 Vercel이 자동으로 재배포합니다.
