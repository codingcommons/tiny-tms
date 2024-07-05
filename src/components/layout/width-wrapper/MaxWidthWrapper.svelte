<script lang="ts">
	import { cn } from '$lib/utils/shadcn'
	import type { HTMLAttributes } from 'svelte/elements'

	type $$Props = HTMLAttributes<HTMLDivElement>
	let className: $$Props['class'] = undefined
	export { className as class }
</script>

<div class={cn('mx-auto w-full max-w-screen-2xl px-2.5 md:px-20', className)} {...$$restProps}>
	<slot />
</div>
