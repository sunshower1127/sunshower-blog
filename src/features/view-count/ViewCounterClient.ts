interface ViewCountResponse {
	slug: string
	count: number
}

export class ViewCounterClient {
	private readonly API_ENDPOINT = '/.netlify/functions/view-count'
	private readonly SESSION_KEY_PREFIX = 'viewed_'

	/**
	 * 뷰 카운트 조회 (증가 없이)
	 * @param slug - 포스트 slug
	 * @returns 현재 조회수
	 */
	public async getViewCount(slug: string): Promise<number> {
		// 서버 환경(빌드 타임)에서는 0 반환
		if (typeof window === 'undefined') {
			return 0
		}

		try {
			const url = this.getAbsoluteUrl(`${this.API_ENDPOINT}?slug=${encodeURIComponent(slug)}`)
			const response = await fetch(url, {
				method: 'GET'
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data: ViewCountResponse = await response.json()
			return data.count
		} catch (error) {
			console.error('Failed to get view count:', error)
			return 0
		}
	}

	/**
	 * 뷰 카운트 증가 (세션 체크 포함)
	 * @param slug - 포스트 slug
	 * @returns 증가된 조회수
	 */
	public async incrementViewCount(slug: string): Promise<number> {
		// 서버 환경(빌드 타임)에서는 0 반환
		if (typeof window === 'undefined') {
			return 0
		}

		// 이미 조회한 경우 증가하지 않고 현재 값만 반환
		if (this.hasViewedInSession(slug)) {
			return this.getViewCount(slug)
		}

		try {
			const url = this.getAbsoluteUrl(`${this.API_ENDPOINT}?slug=${encodeURIComponent(slug)}`)
			const response = await fetch(url, {
				method: 'POST'
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data: ViewCountResponse = await response.json()

			// 세션에 기록
			this.markAsViewed(slug)

			return data.count
		} catch (error) {
			console.error('Failed to increment view count:', error)
			return 0
		}
	}

	/**
	 * 환경에 맞는 절대 URL 생성
	 */
	private getAbsoluteUrl(path: string): string {
		// 브라우저 환경
		if (typeof window !== 'undefined') {
			return path
		}
		// 서버 환경 (SSR/빌드)
		// Netlify Dev 환경에서는 localhost:8888 사용
		const baseUrl = process.env.URL || 'http://localhost:8888'
		return `${baseUrl}${path}`
	}

	/**
	 * 세션 내 중복 조회 확인
	 */
	private hasViewedInSession(slug: string): boolean {
		if (typeof sessionStorage === 'undefined') return false
		return sessionStorage.getItem(`${this.SESSION_KEY_PREFIX}${slug}`) === 'true'
	}

	/**
	 * 세션에 조회 기록 저장
	 */
	private markAsViewed(slug: string): void {
		if (typeof sessionStorage === 'undefined') return
		sessionStorage.setItem(`${this.SESSION_KEY_PREFIX}${slug}`, 'true')
	}
}

// 싱글톤 인스턴스 내보내기
export const viewCounterClient = new ViewCounterClient()
