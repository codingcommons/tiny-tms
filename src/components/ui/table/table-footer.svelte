<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils/shadcn'

	type $$Props = HTMLAttributes<HTMLTableSectionElement>

	type Props = {
		class?: $$Props['class']
		children?: import('svelte').Snippet
	} & $$Props

	let { class: className = undefined, children, ...rest }: Props = $props()
</script>

<tfoot class={cn('bg-primary font-medium text-primary-foreground', className)} {...rest}>
	{@render children?.()}
</tfoot>
