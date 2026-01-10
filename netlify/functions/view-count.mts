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
			// ISSUE: 타입은 ArrayBufer인데, 실제로는 string임.
			const count = ((await store.get(slug)) as unknown as string) || '0'
			return new Response(JSON.stringify({ slug, count: parseInt(count, 10) }), {
				status: 200,
				headers
			})
		}

		// POST: 증가 + 조회 (포스트 상단용)
		if (req.method === 'POST') {
			const currentCount = ((await store.get(slug)) as unknown as string) || '0'
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
