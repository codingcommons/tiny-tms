<script lang="ts">
	import { Popover as PopoverPrimitive } from 'bits-ui'
	import { cn, flyAndScale } from '$lib/utils/shadcn'

	type $$Props = PopoverPrimitive.ContentProps & {
		class?: PopoverPrimitive.ContentProps['class']
		transition?: NonNullable<PopoverPrimitive.ContentProps['transition']>
		transitionConfig?: PopoverPrimitive.ContentProps['transitionConfig']
		children?: import('svelte').Snippet
	}

	let {
		class: className = undefined,
		transition = flyAndScale,
		transitionConfig = undefined,
		children,
		...rest
	}: $$Props = $props()
</script>

<PopoverPrimitive.Content
	{transition}
	{transitionConfig}
	class={cn(
		'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
		className
	)}
	{...rest}
>
	{@render children?.()}
</PopoverPrimitive.Content>
