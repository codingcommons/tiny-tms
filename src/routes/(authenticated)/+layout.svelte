<script lang="ts">
	import { Sidebar } from '$components/layout/sidebar'
	import { page } from '$app/stores'

	export let data
</script>

<div class="flex h-full">
	<Sidebar sidebarElements={$page.data.sidebarElements} userData={data.loggedInUser} />
	<slot />
</div>
