# STEP 5: 포스트 상단 통합

## 목표

블로그 포스트 상단 메타 정보 섹션에 뷰 카운터를 추가합니다 (증가 모드).

## 작업 내용

### 파일 수정

**파일:** `src/layouts/BlogPost.astro`

### 수정 위치

**라인 1-10 (import 섹션):**

기존:
```astro
---
import BaseLayout from '@/layouts/BaseLayout'
import FormattedDate from '@/components/FormattedDate'
import Share from '@/components/Share'
import TableOfContents from '@/components/TableOfContents'
import { Image } from 'astro:assets'
import Disqus from '@/components/Disqus.astro'
import ListRelatedPosts from '@/components/ListRelatedPosts.astro'
```

수정 후:
```astro
---
import BaseLayout from '@/layouts/BaseLayout'
import FormattedDate from '@/components/FormattedDate'
import Share from '@/components/Share'
import TableOfContents from '@/components/TableOfContents'
import ViewCounter from '@/components/ViewCounter.astro'  // [NEW]
import { Image } from 'astro:assets'
import Disqus from '@/components/Disqus.astro'
import ListRelatedPosts from '@/components/ListRelatedPosts.astro'
```

**라인 11-15 (props 및 변수 섹션):**

기존:
```astro
const { data, readTime, headings, id } = Astro.props
const { title, description, pubDate, heroImage, tags } = data

const articleDate = pubDate.toISOString()
```

수정 후:
```astro
const { data, readTime, headings, id } = Astro.props
const { title, description, pubDate, heroImage, tags } = data

// [NEW] slug 추출
const slug = id.replace('.mdx', '').replace('.md', '')

const articleDate = pubDate.toISOString()
```

**라인 32-37 (날짜 + 읽기시간 표시 섹션):**

기존:
```astro
<div class='flex items-center justify-center gap-x-1'>
  <p class='text-center text-sm text-opacity-50'>
    Published <FormattedDate date={pubDate} />
  </p>
  <p class='text-center text-sm text-opacity-50 font-bold'>
    - {readTime}
  </p>
</div>
```

수정 후:
```astro
<div class='flex items-center justify-center gap-x-1'>
  <p class='text-center text-sm text-opacity-50'>
    Published <FormattedDate date={pubDate} />
  </p>
  <p class='text-center text-sm text-opacity-50 font-bold'>
    - {readTime}
  </p>
  <!-- [NEW] 뷰 카운터 추가 (증가 모드) -->
  <p class='text-center text-sm text-opacity-50 font-bold'>
    - <ViewCounter slug={slug} increment={true} />
  </p>
</div>
```

## 전체 수정된 섹션 코드

```astro
---
import BaseLayout from '@/layouts/BaseLayout'
import FormattedDate from '@/components/FormattedDate'
import Share from '@/components/Share'
import TableOfContents from '@/components/TableOfContents'
import ViewCounter from '@/components/ViewCounter.astro'
import { Image } from 'astro:assets'
import Disqus from '@/components/Disqus.astro'
import ListRelatedPosts from '@/components/ListRelatedPosts.astro'

const { data, readTime, headings, id } = Astro.props
const { title, description, pubDate, heroImage, tags } = data

const slug = id.replace('.mdx', '').replace('.md', '')
const articleDate = pubDate.toISOString()
---

<BaseLayout
  title={title}
  description={description}
  image={heroImage?.src}
  articleDate={articleDate}
>
  <article class='min-w-full md:py-4 sm:max-w-none md:max-w-none'>
    <header class='mb-3 flex flex-col justify-center items-center gap-6'>
      <div class='flex flex-col gap-2'>
        <div class='flex items-center justify-center gap-x-1'>
          <p class='text-center text-sm text-opacity-50'>
            Published <FormattedDate date={pubDate} />
          </p>
          <p class='text-center text-sm text-opacity-50 font-bold'>
            - {readTime}
          </p>
          <p class='text-center text-sm text-opacity-50 font-bold'>
            - <ViewCounter slug={slug} increment={true} />
          </p>
        </div>
        <!-- 나머지 코드는 동일 -->
```

## 코드 설명

### 1. slug 추출 로직

```astro
const slug = id.replace('.mdx', '').replace('.md', '')
```

**입력 예시:**
- `id = "first-post.mdx"` → `slug = "first-post"`
- `id = "astro-tutorial.md"` → `slug = "astro-tutorial"`

**용도:** API 호출 시 포스트 식별자로 사용

### 2. ViewCounter 배치

```astro
<p class='text-center text-sm text-opacity-50 font-bold'>
  - <ViewCounter slug={slug} increment={true} />
</p>
```

**스타일:**
- `text-center`: 중앙 정렬
- `text-sm`: 작은 폰트 (14px)
- `text-opacity-50`: 반투명
- `font-bold`: 굵은 글씨

**표시 예시:**
```
Published January 10, 2026 - 5 min read - 👁️ 125
```

### 3. increment={true}

포스트 상단에서는 조회수를 증가시킵니다.
- 최초 방문: API POST → 조회수 +1
- 재방문 (같은 세션): API GET → 조회수 유지

## 테스트

### 1. 기존 포스트에서 확인

```bash
pnpm dev
```

브라우저에서 `/post/first-post/` 같은 포스트 페이지 접속

### 2. 확인 사항

**시각적 확인:**
- [ ] 날짜 옆에 "- 👁️ ..." 표시됨
- [ ] 1-2초 후 "- 👁️ 1" 로 변경됨
- [ ] 스타일이 날짜/읽기시간과 일관성 있음

**기능 확인:**
- [ ] 페이지 새로고침 → 숫자 유지 (증가 안 함)
- [ ] 새 탭에서 열기 → 숫자 증가
- [ ] 개발자 도구 Network 탭에서 POST 요청 확인

**sessionStorage 확인:**

개발자 도구 → Application → Session Storage:
```
viewed_first-post: "true"
```

### 3. 다크 모드 확인

다크 모드 토글 후 색상이 적절한지 확인.

## 예상 결과

### 라이트 모드
```
┌─────────────────────────────────────┐
│  Published January 10, 2026         │
│  - 5 min read - 👁️ 125             │
│                                     │
│  # 포스트 제목                       │
└─────────────────────────────────────┘
```

### 다크 모드
```
┌─────────────────────────────────────┐
│  Published January 10, 2026         │
│  - 5 min read - 👁️ 125             │
│  (회색 텍스트)                       │
│                                     │
│  # 포스트 제목                       │
└─────────────────────────────────────┘
```

## 스타일 조정 (선택)

### 레이아웃 변경

수평이 아닌 수직 배치:

```astro
<div class='flex flex-col items-center gap-1'>
  <p class='text-sm text-opacity-50'>
    Published <FormattedDate date={pubDate} />
  </p>
  <p class='text-sm text-opacity-50 font-bold'>
    {readTime}
  </p>
  <p class='text-sm text-opacity-50 font-bold'>
    <ViewCounter slug={slug} increment={true} />
  </p>
</div>
```

### 아이콘 크기 조정

ViewCounter 컴포넌트에서 SVG `width`/`height` 변경.

## 검증 체크리스트

- [ ] `src/layouts/BlogPost.astro` 수정 완료
- [ ] ViewCounter import 추가됨
- [ ] slug 추출 로직 추가됨
- [ ] 뷰 카운터 UI 표시됨
- [ ] 첫 방문 시 조회수 증가 확인
- [ ] 새로고침 시 증가 안 됨 확인
- [ ] 다크 모드 정상 동작 확인

## 다음 단계

✅ 포스트 상단 통합 완료 후 → **STEP 6: 포스트 카드 통합**으로 진행
