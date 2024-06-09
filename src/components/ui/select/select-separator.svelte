<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils/shadcn'

	type $$Props = SelectPrimitive.SeparatorProps

	let { class: className = undefined, ...rest }: $$Props = $props()
</script>

<SelectPrimitive.Separator class={cn('-mx-1 my-1 h-px bg-muted', className)} {...rest} />
