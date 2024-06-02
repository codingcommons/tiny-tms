import List from 'lucide-svelte/icons/list'
import type { PageLoad } from './$types'

export const load: PageLoad = () => {
	const sidebarElements = [
		{
			name: 'My Projects',
			route: '/projects',
			icon: List
		}
	]

	return {
		sidebarElements
	}
}
