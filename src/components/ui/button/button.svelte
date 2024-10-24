<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui'
	import { type ButtonProps, buttonVariants } from './index.js'
	import { cn } from '$lib/utils/shadcn'

	let {
		class: className = undefined,
		variant = 'default',
		size = 'default',
		builders = [],
		children,
		...rest
	}: ButtonProps = $props()
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	{...rest}
	on:click
	on:keydown
>
	{@render children?.()}
</ButtonPrimitive.Root>
