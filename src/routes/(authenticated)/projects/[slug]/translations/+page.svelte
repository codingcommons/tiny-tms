<script lang="ts">
	import { MainContent, MainContentHeader } from '$components/layout/main-content'
	import SearchInput from '$components/search-input/SearchInput.svelte'
	import type { PageData } from './$types'
	import TranslationsKeyTable from '$components/container/translations/TranslationsKeyTable.svelte'
	import { pageTitle } from '$lib/utils/page-title'

	export let data: PageData
</script>

<svelte:head>
	<title>{pageTitle(data.project.name, 'Translations')}</title>
</svelte:head>

<MainContent>
	<MainContentHeader title="{data.project.name} - Translations"></MainContentHeader>

	<div class="max-w-96">
		<SearchInput placeholder="Search keys or translations..." />
	</div>

	<div class="mb-12 mt-4">
		<TranslationsKeyTable />
	</div>
</MainContent>
