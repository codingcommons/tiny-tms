<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils/shadcn.js'

	type $$Props = HTMLAttributes<HTMLDivElement>

	let { class: className = undefined, children, ...rest }: $$Props = $props()
</script>

<div
	class={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
	{...rest}
>
	{@render children?.()}
</div>
