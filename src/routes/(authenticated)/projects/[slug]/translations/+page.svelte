<script lang="ts">
	import { MainContent, MainContentHeader } from '$components/layout/main-content'
	import type { PageData } from './$types'
	import { pageTitle } from '$lib/utils/page-title'

	export let data: PageData
</script>

<svelte:head>
	<title>{pageTitle(data.project.name, 'Translations')}</title>
</svelte:head>

<MainContent>
	<MainContentHeader title="{data.project.name} - Translations"></MainContentHeader>
</MainContent>
