<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils/shadcn.js'

	type $$Props = HTMLAttributes<HTMLDivElement>

	let { class: className = undefined, children, ...rest }: $$Props = $props()
</script>

<div class={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...rest}>
	{@render children?.()}
</div>
