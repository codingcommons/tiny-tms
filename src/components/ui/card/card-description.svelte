<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils/shadcn'

	type $$Props = HTMLAttributes<HTMLParagraphElement>

	let { class: className = undefined, children, ...rest }: $$Props = $props()
</script>

<p class={cn('text-sm text-muted-foreground', className)} {...rest}>
	{@render children?.()}
</p>
