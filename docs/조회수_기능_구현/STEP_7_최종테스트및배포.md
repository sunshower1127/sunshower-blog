# STEP 7: 최종 테스트 및 배포

## 목표

전체 기능을 통합 테스트하고 Netlify에 배포합니다.

## 최종 테스트

### 1. 로컬 환경 테스트

**Netlify CLI로 프로덕션 환경 시뮬레이션:**

```bash
# Netlify Dev 실행 (Functions 포함)
netlify dev
```

접속: `http://localhost:8888`

### 2. 전체 시나리오 테스트

#### 시나리오 1: 포스트 최초 방문

1. 메인 페이지 접속
2. 포스트 카드에서 조회수 확인 (예: 👁️ 0)
3. 포스트 클릭
4. 포스트 상단에서 조회수 증가 확인 (예: 👁️ 1)
5. 뒤로가기
6. 카드에서 조회수 업데이트 확인 (예: 👁️ 1)

**예상 API 호출:**
- 카드: GET `/view-count?slug=post-1` → 0
- 포스트: POST `/view-count?slug=post-1` → 1
- 카드 (뒤로가기): GET `/view-count?slug=post-1` → 1

#### 시나리오 2: 세션 내 재방문

1. 포스트 페이지 새로고침
2. 조회수 변화 없음 확인 (예: 👁️ 1)
3. sessionStorage 확인: `viewed_post-1 = "true"`

**예상 API 호출:**
- GET `/view-count?slug=post-1` → 1 (POST 호출 안됨)

#### 시나리오 3: 새 세션

1. 새 탭/창에서 동일 포스트 접속
2. 조회수 증가 확인 (예: 👁️ 2)

**예상 API 호출:**
- POST `/view-count?slug=post-1` → 2

#### 시나리오 4: 여러 포스트

1. 메인 페이지 접속
2. 모든 카드에 각각의 조회수 표시 확인
3. 다른 포스트 클릭
4. 각 포스트가 독립적으로 카운트됨 확인

**예상 동작:**
- 포스트 A: 👁️ 5
- 포스트 B: 👁️ 12
- 포스트 C: 👁️ 3

#### 시나리오 5: 에러 처리

**네트워크 에러 시뮬레이션:**

1. 개발자 도구 → Network 탭 → Offline 체크
2. 페이지 새로고침
3. 뷰 카운터에 "—" 표시 확인
4. 페이지 나머지 부분은 정상 동작 확인

### 3. 브라우저 호환성 테스트

**테스트 브라우저:**
- [ ] Chrome/Edge (최신)
- [ ] Firefox (최신)
- [ ] Safari (최신)
- [ ] 모바일 Safari (iOS)
- [ ] 모바일 Chrome (Android)

**확인 사항:**
- sessionStorage 정상 동작
- Fetch API 정상 동작
- SVG 아이콘 표시
- 다크 모드 전환

### 4. 반응형 테스트

**디바이스 크기:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**확인 사항:**
- 포스트 상단 레이아웃 깨지지 않음
- 포스트 카드 레이아웃 정상
- 텍스트 가독성

### 5. 성능 테스트

**Lighthouse 실행:**

```bash
# Chrome DevTools → Lighthouse → Performance 테스트
```

**확인 사항:**
- [ ] Performance Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Total Blocking Time < 300ms

**뷰 카운터 영향:**
- 클라이언트 사이드 렌더링으로 초기 로딩 영향 최소
- 비동기 로딩으로 페이지 렌더링 차단 안 함

## 프로덕션 빌드 테스트

### 1. 빌드 실행

```bash
pnpm build
```

**확인 사항:**
- [ ] 빌드 에러 없음
- [ ] TypeScript 에러 없음
- [ ] Netlify Functions 번들링 성공

**예상 출력:**
```
✓ Built in XXXms
✓ Netlify Functions:
  - view-count
```

### 2. 빌드 결과 검증

**생성된 파일 확인:**

```
dist/
├── index.html
├── post/
│   └── [각 포스트]/
│       └── index.html
└── ...

.netlify/
└── functions-internal/
    └── view-count.mjs
```

### 3. 로컬 프리뷰

```bash
pnpm preview
```

또는:

```bash
netlify deploy --build --prod
```

## Netlify 배포

### 1. Git 커밋

```bash
git add .
git commit -m "feat: Add view counter with Netlify Functions and Blobs

- Implement Netlify Functions API for view counting
- Add Netlify Blobs storage integration
- Create ViewCounter component with session-based deduplication
- Integrate view counter in post header and post cards
- Add loading and error states"
```

### 2. Git 푸시

```bash
git push origin main
```

### 3. Netlify 자동 배포

Netlify가 자동으로 감지하고 배포 시작:

1. Build 시작
2. Netlify Functions 빌드
3. 정적 파일 빌드
4. 배포 완료

**배포 로그 확인:**
- Netlify Dashboard → Site → Deploys
- Build log에서 에러 없는지 확인

### 4. 환경 변수 확인 (선택)

Netlify Blobs는 자동으로 인증 정보를 주입하므로 별도 설정 불필요.

**확인만:**
- Netlify Dashboard → Site Settings → Environment Variables
- `NETLIFY_BLOBS_CONTEXT` 자동 설정됨

## 프로덕션 검증

### 1. 배포된 사이트 접속

`https://sunshower-blog.netlify.app/`

### 2. Functions 엔드포인트 테스트

**브라우저 콘솔에서:**

```javascript
// 조회
fetch('https://sunshower-blog.netlify.app/.netlify/functions/view-count?slug=test')
  .then(r => r.json())
  .then(console.log)

// 증가
fetch('https://sunshower-blog.netlify.app/.netlify/functions/view-count?slug=test', {
  method: 'POST'
})
  .then(r => r.json())
  .then(console.log)
```

### 3. 실제 포스트 테스트

1. 첫 포스트 방문
2. 조회수 증가 확인
3. 새로고침 → 증가 안됨
4. 시크릿 모드 → 다시 증가

### 4. Netlify Blobs 데이터 확인 (선택)

**Netlify CLI:**

```bash
netlify blobs:list view-counts
```

**예상 출력:**
```
first-post
astro-tutorial
typescript-tips
```

**특정 키 조회:**

```bash
netlify blobs:get view-counts first-post
```

**예상 출력:**
```
125
```

## 모니터링

### 1. Netlify Functions 로그

**Netlify Dashboard → Functions → view-count**

실시간 로그 확인:
- API 호출 빈도
- 에러 발생 여부
- 응답 시간

### 2. 에러 추적

**로그에서 확인:**
```
Error: Slug parameter is required
Error: Internal server error
```

### 3. 사용량 모니터링

**Netlify Dashboard → Usage**

무료 티어 제한:
- Functions: 125,000 호출/월
- Blobs: 무료 (정확한 제한은 Netlify 문서 참조)

## 롤백 계획

### 문제 발생 시

**즉시 롤백:**

```bash
# 이전 커밋으로 되돌리기
git revert HEAD
git push origin main
```

**또는 Netlify Dashboard에서:**
- Deploys → 이전 배포 선택 → Publish deploy

### 데이터 보존

Netlify Blobs 데이터는 자동 삭제되지 않으므로:
- 롤백 후에도 조회수 데이터 유지
- 재배포 시 이전 데이터 복원

## 체크리스트

### 로컬 테스트
- [ ] 모든 시나리오 테스트 완료
- [ ] 브라우저 호환성 확인
- [ ] 반응형 테스트 완료
- [ ] Lighthouse 성능 점수 확인

### 빌드
- [ ] `pnpm build` 성공
- [ ] TypeScript 에러 없음
- [ ] Functions 번들링 성공
- [ ] 로컬 프리뷰 정상

### 배포
- [ ] Git 커밋 & 푸시
- [ ] Netlify 자동 배포 성공
- [ ] 빌드 로그 에러 없음
- [ ] Functions 엔드포인트 정상 동작

### 프로덕션
- [ ] 배포된 사이트 접속 확인
- [ ] 포스트 카드 조회수 표시
- [ ] 포스트 상단 조회수 증가
- [ ] 세션 중복 방지 동작
- [ ] 다크 모드 정상
- [ ] 모바일 정상

## 향후 개선 사항

### 1. Google Analytics 4 추가

사용자 요청 시 구현:
- ViewCounter 컴포넌트에 gtag 이벤트 추가
- GA4 대시보드 연동

### 2. 통계 대시보드

관리자용 통계 페이지:
- 전체 포스트 조회수 순위
- 일일 조회수 추이
- 인기 포스트 분석

### 3. 실시간 업데이트 (선택)

WebSocket 또는 Polling:
- 현재 읽고 있는 포스트의 실시간 조회수
- 우선순위 낮음

### 4. 캐싱 전략

클라이언트 메모리 캐시:
- 5분 TTL로 API 호출 감소
- 비용 절감

## 문서화

### README.md 업데이트

프로젝트 루트의 `README.md`에 추가:

```markdown
## Features

- 📊 **View Counter**: Real-time page view tracking with Netlify Functions and Blobs
  - Session-based deduplication
  - Displayed on post headers and post cards
  - No external dependencies
```

### 개발 문서

`docs/VIEW_COUNTER.md` 생성 (선택):
- 아키텍처 설명
- API 문서
- 문제 해결 가이드

## 완료!

🎉 Netlify Functions + Netlify Blobs 뷰 카운터 구현 완료!

**구현된 기능:**
- ✅ Netlify Functions API
- ✅ Netlify Blobs 저장소
- ✅ 세션 기반 중복 방지
- ✅ 포스트 상단 통합
- ✅ 포스트 카드 통합
- ✅ 로딩/에러 처리
- ✅ 다크 모드 지원
- ✅ 반응형 디자인

**다음 단계:**
- Google Analytics 4 추가 (선택)
- 통계 대시보드 구현 (선택)
- 성능 모니터링
