import { type Writable } from 'svelte/store'
import { getContext } from 'svelte'

export type NavigationElement = {
	name: string
	icon: ConstructorOfATypedSvelteComponent
	route: string
}

export function getSidebarElements(): Writable<NavigationElement[]> {
	return getContext<Writable<NavigationElement[]>>('sidebar')
}
