<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils/shadcn'

	type $$Props = HTMLAttributes<HTMLTableCaptionElement>

	type Props = {
		class?: $$Props['class'] | undefined
		children?: import('svelte').Snippet
	}

	let { class: className = undefined, children, ...rest }: Props = $props()
</script>

<caption class={cn('mt-4 text-sm text-muted-foreground', className)} {...rest}>
	{@render children?.()}
</caption>
