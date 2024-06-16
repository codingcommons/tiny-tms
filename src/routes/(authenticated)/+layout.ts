import List from 'lucide-svelte/icons/list'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ data }) => {
	const sidebarElements = [
		{
			name: 'My Projects',
			route: '/projects',
			icon: List
		}
	]

	return {
		loggedInUser: data.loggedInUser,
		sidebarElements
	}
}
