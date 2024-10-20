<script lang="ts">
	import { Sidebar } from '$components/layout/sidebar'
	import { page } from '$app/stores'
	import type { LayoutData } from './$types'

	interface Props {
		data: LayoutData
		children?: import('svelte').Snippet
	}

	let { data, children }: Props = $props()
</script>

<div class="flex h-full">
	<Sidebar sidebarElements={$page.data.sidebarElements} userData={data.loggedInUser} />
	{@render children?.()}
</div>
