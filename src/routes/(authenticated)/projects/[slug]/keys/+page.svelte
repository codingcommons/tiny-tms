<script lang="ts">
	import { pageTitle } from '$lib/utils/page-title'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<svelte:head>
	<title>{pageTitle(data.project.name, 'Keys')}</title>
</svelte:head>

This page will display all keys. It will also give the option to add or delete keys.
