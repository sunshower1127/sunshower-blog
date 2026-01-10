# STEP 4: ViewCounter 컴포넌트

## 목표

재사용 가능한 뷰 카운터 UI 컴포넌트를 만듭니다. 로딩 상태, 에러 처리, Astro 뷰 트랜지션을 지원합니다.

## 작업 내용

### 파일 생성

**파일:** `src/components/ViewCounter.astro`

### 코드 구현

```astro
---
interface Props {
  slug: string;
  increment?: boolean;  // true: 포스트 상단 (증가), false: 카드 (조회만)
  class?: string;
}

const { slug, increment = false, class: className = '' } = Astro.props;
---

<div
  class={`view-counter ${className}`}
  data-slug={slug}
  data-increment={increment}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="inline-block mr-1"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
  <span class="view-count" aria-label="View count">
    <span class="loading">...</span>
    <span class="count hidden">0</span>
  </span>
  <span class="sr-only">views</span>
</div>

<script>
  import { viewCounterClient } from '@/utils';

  async function initViewCounters() {
    const counters = document.querySelectorAll<HTMLElement>('.view-counter');

    for (const counter of counters) {
      const slug = counter.dataset.slug;
      const shouldIncrement = counter.dataset.increment === 'true';

      if (!slug) continue;

      const loadingEl = counter.querySelector<HTMLElement>('.loading');
      const countEl = counter.querySelector<HTMLElement>('.count');

      try {
        const count = shouldIncrement
          ? await viewCounterClient.incrementViewCount(slug)
          : await viewCounterClient.getViewCount(slug);

        if (countEl) {
          countEl.textContent = count.toLocaleString();
          countEl.classList.remove('hidden');
        }
        if (loadingEl) {
          loadingEl.classList.add('hidden');
        }
      } catch (error) {
        console.error('Failed to load view count:', error);
        if (loadingEl) {
          loadingEl.textContent = '—';
        }
      }
    }
  }

  // 페이지 로드 시 실행
  document.addEventListener('DOMContentLoaded', initViewCounters);

  // Astro 뷰 트랜지션 지원
  document.addEventListener('astro:page-load', initViewCounters);
</script>

<style>
  .view-counter {
    display: inline-flex;
    align-items: center;
    font-size: 0.875rem;
    color: rgba(107, 114, 128, 1); /* gray-500 */
  }

  .dark .view-counter {
    color: rgba(156, 163, 175, 1); /* gray-400 */
  }

  .view-count {
    display: inline-block;
    min-width: 2rem;
    text-align: left;
  }

  .hidden {
    display: none;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

## 코드 설명

### 1. Props 인터페이스

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `slug` | string | (필수) | 포스트 slug |
| `increment` | boolean | false | true: 조회수 증가, false: 조회만 |
| `class` | string | '' | 추가 CSS 클래스 |

### 2. UI 구조

```
<div class="view-counter">
  👁️ (SVG 아이콘)
  <span class="view-count">
    <span class="loading">...</span>  ← 초기 상태
    <span class="count hidden">0</span>  ← 로딩 완료 후 표시
  </span>
</div>
```

### 3. 상태 전환

**로딩 중:**
```
👁️ ...
```

**로딩 완료:**
```
👁️ 1,234
```

**에러 발생:**
```
👁️ —
```

### 4. 클라이언트 스크립트

**동작 흐름:**
1. 페이지 로드 시 `initViewCounters()` 실행
2. 모든 `.view-counter` 요소 찾기
3. `data-slug`, `data-increment` 속성 읽기
4. API 호출 (증가 또는 조회)
5. UI 업데이트

**Astro 뷰 트랜지션 지원:**
```javascript
document.addEventListener('astro:page-load', initViewCounters);
```

페이지 전환 시에도 정상 작동.

### 5. 스타일링

**Tailwind CSS 스타일:**
- 라이트 모드: `text-gray-500`
- 다크 모드: `text-gray-400`
- 반응형: `text-sm` (0.875rem)

**접근성:**
- `aria-label="View count"`: 스크린 리더 지원
- `sr-only` 클래스: "views" 텍스트 숨김

## 사용 예시

### 포스트 상단 (증가 모드)

```astro
<ViewCounter slug="my-first-post" increment={true} />
```

→ 👁️ 125 (조회수 증가)

### 포스트 카드 (조회 모드)

```astro
<ViewCounter slug="my-first-post" increment={false} class="text-white" />
```

→ 👁️ 125 (조회만, 흰색 텍스트)

## 로컬 테스트

### 1. Astro 개발 서버 실행

```bash
pnpm dev
```

### 2. 테스트 페이지 생성

**임시 파일:** `src/pages/test-view-counter.astro`

```astro
---
import ViewCounter from '@/components/ViewCounter.astro';
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="View Counter Test">
  <div class="p-8 space-y-4">
    <h1>View Counter Test</h1>

    <div>
      <h2>증가 모드 (increment=true)</h2>
      <ViewCounter slug="test-post-1" increment={true} />
    </div>

    <div>
      <h2>조회 모드 (increment=false)</h2>
      <ViewCounter slug="test-post-1" increment={false} />
    </div>

    <div class="bg-gray-800 p-4">
      <h2 class="text-white">흰색 텍스트</h2>
      <ViewCounter slug="test-post-2" increment={false} class="text-white" />
    </div>
  </div>
</BaseLayout>
```

### 3. 브라우저에서 확인

1. `http://localhost:4321/test-view-counter` 접속
2. 개발자 도구 → Network 탭 열기
3. API 호출 확인 (`view-count?slug=test-post-1`)
4. 숫자가 "..."에서 실제 값으로 바뀌는지 확인
5. 새로고침 → 증가 모드는 숫자 유지, 조회 모드도 동일

### 4. sessionStorage 확인

개발자 도구 → Application → Session Storage:

```
viewed_test-post-1: "true"
```

## 검증 체크리스트

- [ ] `src/components/ViewCounter.astro` 파일 생성됨
- [ ] 테스트 페이지에서 눈 아이콘 + 숫자 표시됨
- [ ] 로딩 중 "..." 표시됨
- [ ] 로딩 완료 후 숫자로 전환됨
- [ ] `increment={true}` 모드에서 sessionStorage 저장 확인
- [ ] 다크 모드에서도 정상 표시됨
- [ ] 네트워크 에러 시 "—" 표시됨

## 스타일 커스터마이징 (선택)

### 애니메이션 추가

```css
.count {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 색상 변경

```astro
<ViewCounter slug="post" class="text-blue-600" />
```

## 다음 단계

✅ ViewCounter 컴포넌트 완료 후 → **STEP 5: 포스트 상단 통합**으로 진행
