<script lang="ts">
	import { setContext } from 'svelte'
	import { type Writable, writable } from 'svelte/store'
	import type { NavigationElement } from './sidebar-context'
	import { page } from '$app/stores'
	import { ThemeSelector } from '$components/ui/theme-selector'

	const sidebarElements: Writable<NavigationElement[]> = writable([])

	setContext('sidebar', sidebarElements)
</script>

<div class="flex h-full">
	<div class="flex h-full w-80 flex-none flex-col bg-secondary text-secondary-foreground">
		<!-- Top Section -->
		<div class="m-8 mb-6 text-2xl">
			<span>⌘ Tiny-TMS</span>
		</div>

		<div class="mx-4 flex-grow">
			{#each $sidebarElements as element}
				<a
					href={element.route}
					class="flex cursor-pointer rounded-lg border border-transparent p-4 transition duration-100 ease-in-out hover:border-primary"
					class:selected={$page.url.pathname.endsWith(element.route)}
				>
					<svelte:component this={element.icon} class="mr-2"></svelte:component>
					<div>{element.name}</div>
				</a>
			{/each}
		</div>

		<div class="m-4 mt-auto flex items-center">
			<div class="mr-2.5 h-10 w-10 rounded-full bg-yellow-300"></div>
			<div class="mr-auto">My Account</div>
			<ThemeSelector />
		</div>
	</div>

	<slot></slot>
</div>

<style>
	.selected {
		@apply bg-primary-foreground;
	}
</style>
