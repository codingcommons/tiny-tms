<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils/shadcn.js'

	type $$Props = DialogPrimitive.DescriptionProps

	let { class: className = undefined, children, ...rest }: $$Props = $props()
</script>

<DialogPrimitive.Description class={cn('text-sm text-muted-foreground', className)} {...rest}>
	{@render children?.()}
</DialogPrimitive.Description>
