<script lang="ts">
	import { getSidebarElements } from '../sidebar-context'
	import List from 'lucide-svelte/icons/list'

	const sidebarElements = getSidebarElements()

	$sidebarElements = [
		{
			name: 'My Projects',
			route: '/projects',
			icon: List
		}
	]
</script>

Projects
