<script lang="ts">
	import { Sidebar } from '$components/sidebar'
	import { page } from '$app/stores'
</script>

<div class="flex h-full">
	<Sidebar sidebarElements={$page.data.sidebarElements} />
	<slot></slot>
</div>
