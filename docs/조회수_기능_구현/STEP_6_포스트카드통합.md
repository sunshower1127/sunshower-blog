# STEP 6: 포스트 카드 통합

## 목표

블로그 메인 페이지 및 카테고리 페이지의 포스트 카드에 뷰 카운터를 추가합니다 (조회 모드).

## 작업 내용

### 파일 수정

**파일:** `src/components/PostCard.astro`

### 수정 위치

**라인 1-5 (import 섹션):**

기존:
```astro
---
import { Image } from 'astro:assets'
import FormattedDate from '@/components/FormattedDate'
import ArrowUp from '@/components/icons/ArrowUp'
```

수정 후:
```astro
---
import { Image } from 'astro:assets'
import FormattedDate from '@/components/FormattedDate'
import ArrowUp from '@/components/icons/ArrowUp'
import ViewCounter from '@/components/ViewCounter.astro'  // [NEW]
```

**라인 27-36 (카드 하단 메타 정보 섹션):**

기존:
```astro
<div class='flex items-center justify-between gap-x-1 text-white px-6 py-4'>
  <div class='flex flex-col gap-1 items-center justify-center'>
    <FormattedDate date={pubDate} />
    <span class='text-sm'>{readTime}</span>
  </div>

  <span class='pb-4'>{category}</span>
</div>
```

수정 후:
```astro
<div class='flex items-center justify-between gap-x-1 text-white px-6 py-4'>
  <div class='flex flex-col gap-1 items-center justify-center'>
    <FormattedDate date={pubDate} />
    <span class='text-sm'>{readTime}</span>
    <!-- [NEW] 뷰 카운터 추가 (조회 모드) -->
    <ViewCounter slug={slug} increment={false} class="text-white" />
  </div>

  <span class='pb-4'>{category}</span>
</div>
```

## 전체 수정된 섹션 코드

```astro
---
import { Image } from 'astro:assets'
import FormattedDate from '@/components/FormattedDate'
import ArrowUp from '@/components/icons/ArrowUp'
import ViewCounter from '@/components/ViewCounter.astro'

const {
  id,
  data: { title, description, pubDate, heroImage, category },
  readTime,
  slug
} = Astro.props
---

<article class='grid grid-rows-[300px_auto] md:grid-rows-[300px_220px] min-h-full group'>
  <a class='relative overflow-hidden' href={`/post/${slug}/`}>
    <Image
      src={heroImage}
      width={600}
      height={200}
      format='webp'
      class='h-full min-w-full object-cover hover:scale-[101%] transition-all duration-200 rounded-[2px]'
      alt={`img of ${title}`}
    />

    <div class='z-30 absolute bottom-0 w-full h-20'>
      <div class='-z-10 absolute bottom-0 glass w-full min-h-full'></div>
      <div class='flex items-center justify-between gap-x-1 text-white px-6 py-4'>
        <div class='flex flex-col gap-1 items-center justify-center'>
          <FormattedDate date={pubDate} />
          <span class='text-sm'>{readTime}</span>
          <ViewCounter slug={slug} increment={false} class="text-white" />
        </div>

        <span class='pb-4'>{category}</span>
      </div>
    </div>
  </a>

  <!-- 나머지 코드 동일 -->
```

## 코드 설명

### 1. increment={false}

포스트 카드에서는 조회수를 증가시키지 않습니다.
- 카드 마우스 오버, 스크롤 시 조회수가 증가하면 안 됨
- API GET 호출로 현재 값만 조회

### 2. class="text-white"

카드 하단 메타 정보 영역은 이미지 위 반투명 배경이므로 흰색 텍스트 사용.

```astro
<ViewCounter slug={slug} increment={false} class="text-white" />
```

### 3. 레이아웃 구조

```
┌─────────────────────────────┐
│                             │
│      Hero Image             │
│                             │
│  ┌──────────────────────┐   │
│  │ Jan 10, 2026         │   │
│  │ 5 min read      Tech │   │
│  │ 👁️ 125               │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
  포스트 제목
  설명...
```

## 테스트

### 1. 메인 페이지 확인

```bash
pnpm dev
```

브라우저에서 `/` 메인 페이지 접속

### 2. 확인 사항

**시각적 확인:**
- [ ] 각 포스트 카드 하단에 "👁️ ..." 표시됨
- [ ] 1-2초 후 실제 숫자로 변경됨
- [ ] 흰색 텍스트로 잘 보임
- [ ] 날짜, 읽기시간과 정렬 일치

**기능 확인:**
- [ ] 카드 마우스 오버 → 조회수 변화 없음
- [ ] 페이지 새로고침 → 조회수 동일
- [ ] 개발자 도구 Network 탭에서 GET 요청 확인 (POST 아님)

**여러 카드:**
- [ ] 모든 카드에 각자의 조회수 표시됨
- [ ] 로딩 속도 정상 (병렬 처리)

### 3. 카테고리 페이지 확인

`/category/tech/1` 같은 카테고리 페이지에서도 동일하게 작동하는지 확인.

## 예상 결과

### 포스트 카드 (라이트 모드 배경)

```
┌───────────────────────────────┐
│                               │
│     [Hero Image]              │
│                               │
│  ┌─────────────────────────┐  │
│  │ January 10, 2026        │  │
│  │ 5 min read         Tech │  │
│  │ 👁️ 125                  │  │
│  └─────────────────────────┘  │
└───────────────────────────────┘
 How to Build...
 In this tutorial...
```

### 포스트 카드 (다크 모드 배경)

동일하게 표시, 배경색만 다름.

## 성능 최적화 (선택)

여러 카드가 동시에 로드될 때 성능을 개선하려면:

**ViewCounter.astro의 script 섹션 수정:**

```typescript
async function initViewCounters() {
  const counters = document.querySelectorAll<HTMLElement>('.view-counter');

  // 병렬 처리로 성능 개선
  await Promise.all(
    Array.from(counters).map(async (counter) => {
      const slug = counter.dataset.slug;
      const shouldIncrement = counter.dataset.increment === 'true';

      if (!slug) return;

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
    })
  );
}
```

**변경 사항:**
- `for...of` → `Promise.all()` + `map()`
- 모든 카드의 API 호출을 병렬로 처리
- 로딩 시간 단축

## 스타일 조정 (선택)

### 레이아웃 변경

수평 배치 (날짜 옆):

```astro
<div class='flex flex-col gap-1 items-center justify-center'>
  <div class='flex items-center gap-2'>
    <FormattedDate date={pubDate} />
    <ViewCounter slug={slug} increment={false} class="text-white" />
  </div>
  <span class='text-sm'>{readTime}</span>
</div>
```

### 아이콘 색상 변경

```astro
<ViewCounter slug={slug} increment={false} class="text-blue-300" />
```

## 검증 체크리스트

- [ ] `src/components/PostCard.astro` 수정 완료
- [ ] ViewCounter import 추가됨
- [ ] 뷰 카운터 UI 표시됨 (흰색 텍스트)
- [ ] increment={false}로 조회만 수행
- [ ] 메인 페이지에서 정상 작동
- [ ] 카테고리 페이지에서 정상 작동
- [ ] 여러 카드의 조회수가 각각 표시됨
- [ ] 성능 문제 없음 (로딩 속도 정상)

## 다음 단계

✅ 포스트 카드 통합 완료 후 → **STEP 7: 최종 테스트 및 배포**로 진행
