<script lang="ts">
	import { cn } from '$lib/utils/shadcn'
	import type { HTMLAttributes } from 'svelte/elements'

	type $$Props = HTMLAttributes<HTMLDivElement>
	interface Props {
		class?: $$Props['class']
		children?: import('svelte').Snippet
		[key: string]: unknown
	}

	let { class: className = undefined, children, ...rest }: Props = $props()
</script>

<div class={cn('h-full w-full overflow-x-auto px-16 pt-8', className)} {...rest}>
	{@render children?.()}
</div>
