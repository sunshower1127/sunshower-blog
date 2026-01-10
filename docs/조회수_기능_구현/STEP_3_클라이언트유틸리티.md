# STEP 3: 클라이언트 유틸리티

## 목표

sessionStorage를 사용한 중복 방지 로직과 API 호출 로직을 구현합니다.

## 작업 내용

### 파일 생성

**파일:** `src/utils/viewCounter.ts`

### 코드 구현

```typescript
interface ViewCountResponse {
  slug: string;
  count: number;
}

export class ViewCounterClient {
  private readonly API_ENDPOINT = '/.netlify/functions/view-count';
  private readonly SESSION_KEY_PREFIX = 'viewed_';

  /**
   * 세션 내 중복 조회 확인
   */
  private hasViewedInSession(slug: string): boolean {
    if (typeof sessionStorage === 'undefined') return false;
    return sessionStorage.getItem(`${this.SESSION_KEY_PREFIX}${slug}`) === 'true';
  }

  /**
   * 세션에 조회 기록 저장
   */
  private markAsViewed(slug: string): void {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(`${this.SESSION_KEY_PREFIX}${slug}`, 'true');
  }

  /**
   * 뷰 카운트 조회 (증가 없이)
   * @param slug - 포스트 slug
   * @returns 현재 조회수
   */
  async getViewCount(slug: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.API_ENDPOINT}?slug=${encodeURIComponent(slug)}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ViewCountResponse = await response.json();
      return data.count;
    } catch (error) {
      console.error('Failed to get view count:', error);
      return 0;
    }
  }

  /**
   * 뷰 카운트 증가 (세션 체크 포함)
   * @param slug - 포스트 slug
   * @returns 증가된 조회수
   */
  async incrementViewCount(slug: string): Promise<number> {
    // 이미 조회한 경우 증가하지 않고 현재 값만 반환
    if (this.hasViewedInSession(slug)) {
      return this.getViewCount(slug);
    }

    try {
      const response = await fetch(
        `${this.API_ENDPOINT}?slug=${encodeURIComponent(slug)}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ViewCountResponse = await response.json();

      // 세션에 기록
      this.markAsViewed(slug);

      return data.count;
    } catch (error) {
      console.error('Failed to increment view count:', error);
      return 0;
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const viewCounterClient = new ViewCounterClient();
```

### utils/index.ts 수정

**파일:** `src/utils/index.ts`

기존 export에 다음 추가:

```typescript
export { ViewCounterClient, viewCounterClient } from './viewCounter'
```

## 코드 설명

### 1. ViewCounterClient 클래스

**주요 메서드:**

| 메서드 | 용도 | 사용처 |
|--------|------|--------|
| `getViewCount()` | 조회만 | 포스트 카드 |
| `incrementViewCount()` | 증가 + 조회 | 포스트 상단 |

**Private 메서드:**
- `hasViewedInSession()`: 세션 내 조회 여부 확인
- `markAsViewed()`: 세션에 조회 기록 저장

### 2. sessionStorage 중복 방지 로직

**저장 구조:**
```
sessionStorage
├── "viewed_first-post" → "true"
├── "viewed_astro-tutorial" → "true"
└── "viewed_typescript-tips" → "true"
```

**동작:**
1. 포스트 최초 방문: `incrementViewCount()` 호출 → API POST → sessionStorage 저장
2. 같은 세션 내 재방문: sessionStorage 체크 → API GET (조회만)
3. 새 탭/창: 새 세션 → 다시 증가

### 3. 에러 처리

- `fetch` 실패 시 `0` 반환
- 네트워크 에러 발생해도 페이지는 정상 동작
- console.error로 디버깅 정보 출력

### 4. 싱글톤 패턴

```typescript
export const viewCounterClient = new ViewCounterClient();
```

모든 컴포넌트에서 동일한 인스턴스를 사용하여 일관성 보장.

## 브라우저 콘솔 테스트

개발자 도구 콘솔에서 테스트:

```javascript
import { viewCounterClient } from '@/utils';

// 조회만
await viewCounterClient.getViewCount('test-post');  // 예: 5

// 증가 (최초)
await viewCounterClient.incrementViewCount('test-post');  // 예: 6

// 증가 시도 (세션 내 재시도)
await viewCounterClient.incrementViewCount('test-post');  // 예: 6 (증가 안됨)

// sessionStorage 확인
sessionStorage.getItem('viewed_test-post');  // "true"
```

## TypeScript 타입 체크

**tsconfig.json 확인:**

프로젝트의 `tsconfig.json`에 다음 설정이 있는지 확인:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM"]
  }
}
```

**타입 에러 없이 빌드되는지 확인:**

```bash
pnpm build
```

## 검증 체크리스트

- [ ] `src/utils/viewCounter.ts` 파일 생성됨
- [ ] `src/utils/index.ts`에 export 추가됨
- [ ] TypeScript 컴파일 에러 없음
- [ ] `pnpm build` 성공
- [ ] (선택) 브라우저 콘솔에서 테스트 완료

## 다음 단계

✅ 클라이언트 유틸리티 완료 후 → **STEP 4: ViewCounter 컴포넌트**로 진행
