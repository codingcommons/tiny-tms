<script lang="ts">
	import { cn } from '$utils'
	import type { HTMLAttributes } from 'svelte/elements'
	type $$Props = HTMLAttributes<HTMLDivElement>
	let className: $$Props['class'] = undefined
	export { className as class }
</script>

<div class={cn('h-full w-full overflow-x-auto px-16 pt-8', className)} {...$$restProps}>
	<slot />
</div>
