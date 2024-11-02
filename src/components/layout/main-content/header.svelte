<script lang="ts">
	interface Props {
		title?: string
		actions?: import('svelte').Snippet
		children?: import('svelte').Snippet
	}

	let { title = 'Projects', actions, children }: Props = $props()
</script>

<div class="mb-28 flex items-center justify-between">
	<div class="flex w-full justify-between">
		<h2 class="border-b-2 text-3xl font-semibold">{title}</h2>
		{@render actions?.()}
	</div>
	{@render children?.()}
</div>
