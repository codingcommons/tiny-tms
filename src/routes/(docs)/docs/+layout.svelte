<script lang="ts">
	import { pageTitle } from '$utils/seo.utils'
	import InfoPanel from './InfoPanel.svelte'
	import NavigationTree from './NavigationTree.svelte'
	import { setMode } from 'mode-watcher'
	import type { LayoutData } from './$types'

	export let data: LayoutData

	setMode('light')
</script>

<svelte:head>
	<title>{pageTitle('Component Documentation')}</title>
</svelte:head>

<div class="flex h-screen bg-slate-100">
	{#if data}
		<NavigationTree {data} />
	{/if}
	<main class="h-screen w-full flex-col overflow-hidden">
		<div class="grid h-screen grid-rows-1 content-between">
			<div class="grid overflow-y-auto">
				<slot />
			</div>
			<InfoPanel />
		</div>
	</main>
</div>
