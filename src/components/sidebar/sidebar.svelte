<script lang="ts">
	import { writable } from 'svelte/store'
	import type { NavigationElement } from '.'
	import { page } from '$app/stores'
	import { ThemeSelector } from '$components/ui/theme-selector'

	import ChevronLeft from 'lucide-svelte/icons/chevron-left'
	import ChevronRight from 'lucide-svelte/icons/chevron-right'
	import { browser } from '$app/environment'

	export let sidebarElements: NavigationElement[] = []

	let collapsedSidebar = writable(false)
	if (browser) {
		$collapsedSidebar = localStorage.getItem('collapsedSidebar') === 'true'
		collapsedSidebar.subscribe((value) => {
			localStorage.setItem('collapsedSidebar', value.toString())
		})
	}
</script>

<div
	class:collapsedSidebar={$collapsedSidebar}
	class="duration-400 flex h-full w-80 flex-none flex-col bg-secondary text-secondary-foreground transition-all ease-in-out"
>
	<!-- Top Section -->
	<div class="m-8 mb-6 mr-0 flex items-center text-2xl">
		<div>⌘</div>
		<div class="ml-2 overflow-hidden whitespace-nowrap" class:collapsedElement={$collapsedSidebar}>
			Tiny-TMS
		</div>
		<button
			on:click={() => ($collapsedSidebar = !$collapsedSidebar)}
			class="ml-auto mr-2 cursor-pointer rounded-full hover:bg-primary-foreground"
		>
			{#if $collapsedSidebar}
				<ChevronRight />
			{:else}
				<ChevronLeft />
			{/if}
		</button>
	</div>

	<div class="mx-4 flex-grow">
		{#each sidebarElements as element}
			<a
				href={element.route}
				class="flex cursor-pointer rounded-lg border border-transparent p-4 hover:border-primary"
				class:selected={$page.url.pathname.endsWith(element.route)}
			>
				<svelte:component this={element.icon} class="min-h-6 min-w-6"></svelte:component>
				<div
					class="ml-2 overflow-hidden whitespace-nowrap"
					class:collapsedElement={$collapsedSidebar}
				>
					{element.name}
				</div>
			</a>
		{/each}
	</div>

	<a href="/profile" class="m-4 mt-auto flex items-center">
		<div class="ml-4 mr-2.5 min-h-8 min-w-8 rounded-full bg-yellow-300"></div>
		<div
			class:collapsedElement={$collapsedSidebar}
			class="mr-auto overflow-hidden whitespace-nowrap"
		>
			My Account
		</div>
		<div class:collapsedElement={$collapsedSidebar} class="overflow-hidden">
			<ThemeSelector />
		</div>
	</a>
</div>

<style>
	.collapsedElement {
		display: none;
	}

	.collapsedSidebar {
		@apply w-[90px];
	}
	.selected {
		@apply bg-primary-foreground;
	}
</style>
