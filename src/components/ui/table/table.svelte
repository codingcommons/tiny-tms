<script lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils/shadcn'

	type $$Props = HTMLTableAttributes

	let { class: className = undefined, children, ...rest }: $$Props = $props()
</script>

<div class="relative w-full overflow-auto">
	<table class={cn('w-full caption-bottom text-sm', className)} {...rest}>
		{@render children?.()}
	</table>
</div>
