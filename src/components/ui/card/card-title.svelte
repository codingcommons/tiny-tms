<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import type { HeadingLevel } from './index.js'
	import { cn } from '$lib/utils/shadcn'

	type $$Props = HTMLAttributes<HTMLHeadingElement> & {
		tag?: HeadingLevel
	}

	let { class: className = undefined, tag = 'h3', children, ...rest }: $$Props = $props()
</script>

<svelte:element
	this={tag}
	class={cn('text-lg font-semibold leading-none tracking-tight', className)}
	{...rest}
>
	{@render children?.()}
</svelte:element>
