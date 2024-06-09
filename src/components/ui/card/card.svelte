<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils/shadcn'

	type $$Props = HTMLAttributes<HTMLDivElement>

	let { class: className = undefined, children, ...rest }: $$Props = $props()
</script>

<div class={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...rest}>
	{@render children?.()}
</div>
