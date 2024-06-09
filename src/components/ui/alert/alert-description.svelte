<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils/shadcn'

	type $$Props = HTMLAttributes<HTMLDivElement>

	let { class: className = undefined, children, ...rest }: $$Props = $props()
</script>

<div class={cn('text-sm [&_p]:leading-relaxed', className)} {...rest}>
	{@render children?.()}
</div>
