<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import type { HeadingLevel } from './index.js'
	import { cn } from '$lib/utils/shadcn'

	type $$Props = HTMLAttributes<HTMLHeadingElement> & {
		level?: HeadingLevel
	}

	let { class: className = undefined, level = 'h5', children, ...rest }: $$Props = $props()
</script>

<svelte:element
	this={level}
	class={cn('mb-1 font-medium leading-none tracking-tight', className)}
	{...rest}
>
	{@render children?.()}
</svelte:element>
