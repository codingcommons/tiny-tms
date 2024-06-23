<script lang="ts">
	import { page } from '$app/stores'
	import Button from '$components/ui/button/button.svelte'
	import { cn } from '$lib/utils/shadcn'

	let className: string | undefined | null = undefined
	export let items: { href: string; title: string }[]
	export { className as class }
</script>

<nav class={cn('flex space-x-2 md:flex-col md:space-x-0 md:space-y-1', className)}>
	{#each items as item}
		<Button
			href={item.href}
			variant="ghost"
			class={cn(
				$page.url.pathname === item.href
					? 'bg-muted hover:bg-muted'
					: 'hover:bg-muted hover:underline',
				'justify-start md:w-56'
			)}
		>
			{item.title}
		</Button>
	{/each}
</nav>
