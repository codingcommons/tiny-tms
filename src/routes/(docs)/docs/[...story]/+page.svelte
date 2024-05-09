<script lang="ts">
	import { page } from '$app/stores'
	import type { SvelteComponent } from 'svelte'

	const loadComponent = async (): Promise<typeof SvelteComponent | undefined> => {
		const stories = import.meta.env.PROD
			? {}
			: import.meta.glob<{ default: typeof SvelteComponent }>('/src/**/*.story.svelte')

		const storyPath = Object.keys(stories).find((story) => {
			const pathFromStory = story.replace('.story.svelte', '').replace('/src', '/docs')

			return pathFromStory === $page.url.pathname
		})

		if (storyPath) {
			const story = stories[storyPath]
			if (story) {
				return story().then((result) => result.default)
			}
		}

		return undefined
	}
</script>

{#key $page.url.pathname}
	{#await loadComponent() then component}
		{#if component}
			<svelte:component this={component} />
		{:else}
			<div class="flex flex-col gap-2 p-8">
				<h1 class="text-2xl">Component Documentation</h1>
				<p class="text-pretty">
					Welcome to the UI components documentation. Get started by selecting a component.
				</p>
			</div>
		{/if}
	{/await}
{/key}
