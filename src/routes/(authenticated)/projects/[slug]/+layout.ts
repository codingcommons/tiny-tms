import ArrowBigLeft from 'lucide-svelte/icons/arrow-big-left'
import ClipboardType from 'lucide-svelte/icons/clipboard-type'
import FileKey from 'lucide-svelte/icons/file-key'
import Languages from 'lucide-svelte/icons/languages'
import Settings from 'lucide-svelte/icons/settings'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = () => {
	const sidebarElements = [
		{
			name: 'My Projects',
			route: '/projects',
			icon: ArrowBigLeft
		},
		{
			name: 'Translations',
			route: 'translations',
			icon: ClipboardType
		},
		{
			name: 'Keys',
			route: 'keys',
			icon: FileKey
		},
		{
			name: 'Languages',
			route: 'languages',
			icon: Languages
		},
		{
			name: 'Settings',
			route: 'settings',
			icon: Settings
		}
	]

	return {
		sidebarElements
	}
}
