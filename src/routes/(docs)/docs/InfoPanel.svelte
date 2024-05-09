<script lang="ts" context="module">
	import { type Writable, writable } from 'svelte/store'

	const component: Writable<string> = writable('')
	const props: Writable<Record<string, unknown>> = writable({})
	const events: Writable<Record<string, unknown>> = writable({})

	export const showDetails = (
		details: {
			component?: string
			props?: Record<string, unknown> | undefined
			events?: Record<string, unknown> | undefined
		} = {}
	) => {
		component.set(details.component || '')
		props.set(details.props || {})
		events.set(details.events || {})
	}
</script>

<script>
	import { page } from '$app/stores'

	$: $page.url.pathname && showDetails()
</script>

<div class="h-[20vh] overflow-y-auto bg-slate-600 p-4 text-white">
	{#if $component}
		<h2 class="text-2xl"><code>{'<' + $component + ' />'}</code></h2>

		<div class="mt-3 flex">
			<div class="basis-1/2">
				<h3 class="text-lg">Props:</h3>
				<pre class="mt-4">
					{JSON.stringify($props, undefined, 3)}
				</pre>
			</div>
			<div class="basis-1/2">
				<h3 class="text-lg">Events:</h3>
				<pre class="mt-4">
					{JSON.stringify($events, undefined, 3)}
				</pre>
			</div>
		</div>
	{:else}
		<div class="mt-10 text-center">click next to a component so see more details</div>
	{/if}
</div>
