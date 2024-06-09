<script lang="ts">
	import type { NavigationElement } from '.'
	import { page } from '$app/stores'
	import { ThemeSelector } from '$components/ui/theme-selector'
	import ChevronLeft from 'lucide-svelte/icons/chevron-left'
	import ChevronRight from 'lucide-svelte/icons/chevron-right'
	import { localStorageWritable } from '$lib/utils/localstorage-writable'
	import type { User } from 'services/user/user'
	import { UserDefaultIcon } from '$components/ui/user-icon'

	interface Props {
		sidebarElements?: NavigationElement[]
		userData: User | undefined
	}

	let { sidebarElements = [], userData }: Props = $props()

	const collapsedSidebar = localStorageWritable('collapsedSidebar', false)
</script>

<div
	class:collapsedSidebar={$collapsedSidebar}
	class="flex h-full w-80 flex-none flex-col bg-secondary text-secondary-foreground transition-all ease-in-out"
>
	<!-- Top Section -->
	<div class="m-8 mb-6 mr-0 flex items-center text-2xl">
		<div>⌘</div>
		<div class="ml-2 overflow-hidden whitespace-nowrap" class:collapsedElement={$collapsedSidebar}>
			Tiny-TMS
		</div>
		<button
			onclick={() => ($collapsedSidebar = !$collapsedSidebar)}
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
				<element.icon class="min-h-6 min-w-6"></element.icon>
				<div
					class="ml-2 overflow-hidden whitespace-nowrap"
					class:collapsedElement={$collapsedSidebar}
				>
					{element.name}
				</div>
			</a>
		{/each}
	</div>

	<div class="m-4 mt-auto flex items-center justify-between">
		<a
			class="flex items-center transition-all ease-in-out"
			class:collapsedIcon={$collapsedSidebar}
			href="/profile"
		>
			{#if !userData}
				<UserDefaultIcon />
			{:else}
				<UserDefaultIcon firstname={userData.first_name} lastname={userData.last_name} />
			{/if}
			<div
				class:collapsedElement={$collapsedSidebar}
				class="ml-2.5 overflow-hidden whitespace-nowrap"
			>
				My Account
			</div>
		</a>
		<div class:collapsedElement={$collapsedSidebar} class="overflow-hidden">
			<ThemeSelector />
		</div>
	</div>
</div>

<style lang="postcss">
	.collapsedElement {
		display: none;
	}
	.collapsedSidebar {
		@apply w-[90px];
	}

	.collapsedIcon {
		@apply mx-auto;
	}

	.selected {
		@apply bg-primary-foreground;
	}
</style>
