import { createResource, Show, Suspense, onMount, type Component, createSignal } from 'solid-js'
import { viewCounterClient } from './ViewCounterClient'
import './ViewCounter.css'

interface ViewCounterProps {
	slug: string
	increment?: boolean
	class?: string
}

export const ViewCounter: Component<ViewCounterProps> = (props) => {
	// 방법 1: import.meta.env.SSR 체크
	const [count, { refetch }] = createResource(async () => {
		console.log(typeof window !== 'undefined')
		return props.increment
			? await viewCounterClient.incrementViewCount(props.slug)
			: await viewCounterClient.getViewCount(props.slug)
	})

	return (
		<div class={`view-counter ${props.class || ''}`}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='16'
				height='16'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				stroke-width='2'
				stroke-linecap='round'
				stroke-linejoin='round'
				class='inline-block mr-1'
				aria-hidden='true'
			>
				<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
				<circle cx='12' cy='12' r='3'></circle>
			</svg>
			<span class='view-count' aria-label='View count'>
				<span>{count()?.toLocaleString()}</span>
			</span>
			<span class='sr-only'>views</span>
		</div>
	)
}
