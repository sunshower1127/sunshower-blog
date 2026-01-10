**완료**

# STEP 2: 백엔드 구현 (Netlify Functions)

## 목표

Netlify Functions로 뷰 카운터 API를 구현합니다. Netlify Blobs에 조회수를 저장하고 조회하는 엔드포인트를 만듭니다.

## 작업 내용

### 파일 생성

**파일:** `netlify/functions/view-count.mts`

### 코드 구현

```typescript
import type { Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

export default async (req: Request, context: Context) => {
	// CORS 헤더 설정
	const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Content-Type': 'application/json'
	}

	// OPTIONS 프리플라이트 요청 처리
	if (req.method === 'OPTIONS') {
		return new Response(null, { status: 204, headers })
	}

	try {
		// URL 파라미터에서 slug 추출
		const url = new URL(req.url)
		const slug = url.searchParams.get('slug')

		// slug 검증
		if (!slug) {
			return new Response(JSON.stringify({ error: 'Slug parameter is required' }), {
				status: 400,
				headers
			})
		}

		// Netlify Blobs store 초기화
		const store = getStore({
			name: 'view-counts',
			consistency: 'strong' // 즉시 반영 보장
		})

		// GET: 조회만 (카드용)
		if (req.method === 'GET') {
			const count = (await store.get(slug)) || '0'
			return new Response(JSON.stringify({ slug, count: parseInt(count, 10) }), {
				status: 200,
				headers
			})
		}

		// POST: 증가 + 조회 (포스트 상단용)
		if (req.method === 'POST') {
			const currentCount = (await store.get(slug)) || '0'
			const newCount = parseInt(currentCount, 10) + 1
			await store.set(slug, newCount.toString())

			return new Response(JSON.stringify({ slug, count: newCount }), { status: 200, headers })
		}

		// 지원하지 않는 HTTP 메서드
		return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
	} catch (error) {
		console.error('View count error:', error)
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers
		})
	}
}
```

## 코드 설명

### 1. 최신 Netlify Functions 형식 (2026)

- **`.mts` 확장자**: TypeScript ES 모듈
- **Default export**: Modern format
- **Request/Response API**: Lambda event 객체 대신 Web API 사용

### 2. API 동작

**엔드포인트:** `/.netlify/functions/view-count?slug={post-slug}`

| HTTP 메서드 | 동작               | 사용처        |
| ----------- | ------------------ | ------------- |
| GET         | 현재 조회수만 반환 | 포스트 카드   |
| POST        | 조회수 +1 후 반환  | 포스트 상단   |
| OPTIONS     | CORS 프리플라이트  | 브라우저 자동 |

### 3. Netlify Blobs 설정

```typescript
const store = getStore({
	name: 'view-counts', // Store 이름
	consistency: 'strong' // 즉시 반영 보장
})
```

**데이터 구조:**

```
view-counts (store)
├── "first-post" → "125"
├── "astro-tutorial" → "456"
└── "typescript-tips" → "789"
```

### 4. 에러 처리

- **400**: slug 파라미터 누락
- **405**: 지원하지 않는 HTTP 메서드
- **500**: 서버 내부 오류
- **200**: 정상 응답

## 로컬 테스트

### Netlify CLI 설치 및 실행

```bash
# CLI 설치 (이미 설치된 경우 생략)
npm install -g netlify-cli

# 로컬 개발 서버 실행
netlify dev
```

### 테스트 요청

**조회 (GET):**

```bash
curl "http://localhost:8888/.netlify/functions/view-count?slug=test-post"
```

예상 응답:

```json
{ "slug": "test-post", "count": 0 }
```

**증가 (POST):**

```bash
curl -X POST "http://localhost:8888/.netlify/functions/view-count?slug=test-post"
```

예상 응답:

```json
{ "slug": "test-post", "count": 1 }
```

**두 번째 POST:**

```json
{ "slug": "test-post", "count": 2 }
```

## 검증 체크리스트

- [ ] `netlify/functions/view-count.mts` 파일 생성됨
- [ ] `netlify dev` 명령어로 로컬 서버 실행됨
- [ ] GET 요청 시 조회수 반환됨
- [ ] POST 요청 시 조회수 증가됨
- [ ] 같은 slug에 대해 연속 POST 시 숫자 증가 확인

## 다음 단계

✅ 백엔드 구현 완료 후 → **STEP 3: 클라이언트 유틸리티**로 진행
