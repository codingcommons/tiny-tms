<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils/shadcn'

	type $$Props = HTMLAttributes<HTMLTableSectionElement>

	let { class: className = undefined, children, ...rest }: $$Props = $props()
</script>

<tbody class={cn('[&_tr:last-child]:border-0', className)} {...rest}>
	{@render children?.()}
</tbody>
