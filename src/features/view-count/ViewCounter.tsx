import { createResource, onMount, type Component } from 'solid-js'
import { viewCounterClient } from './ViewCounterClient'

interface ViewCounterProps {
	slug: string
	increment?: boolean
	class?: string
}

export const ViewCounter: Component<ViewCounterProps> = (props) => {
	const [count, { refetch }] = createResource(
		() => props.slug,
		async (slug) => {
			return props.increment
				? await viewCounterClient.incrementViewCount(slug)
				: await viewCounterClient.getViewCount(slug)
		}
	)

	// ISSUE: solid-js의 createResource가 Client Side에서 자동으로 트리거 되지 않음.
	// 따라서 onMount에서 refetch를 호출하여 초기화를 수동으로 트리거해야 함. (공식 권장 패턴)
	onMount(() => {
		refetch()
	})

	return (
		<span
			class={`inline-flex translate-y-[3px] gap-px items-center text-sm text-gray-500 dark:text-gray-400 ${props.class || ''}`}
		>
			<ViewCounterIcon />
			<span class='min-w-8' aria-label='View count'>
				<span>{count()?.toLocaleString() ?? '0'}</span>
			</span>
			<span class='sr-only'>views</span>
		</span>
	)
}

function ViewCounterIcon() {
	return (
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
			class='align-middle'
			aria-hidden='true'
		>
			<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
			<circle cx='12' cy='12' r='3'></circle>
		</svg>
	)
}
