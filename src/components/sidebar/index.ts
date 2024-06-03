import Sidebar from './sidebar.svelte'

export type NavigationElement = {
	name: string
	icon: ConstructorOfATypedSvelteComponent
	route: string
}

export { Sidebar }
