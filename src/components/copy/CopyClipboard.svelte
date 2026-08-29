<script lang="ts">
	import Button from '$components/ui/button/button.svelte'
	import { Check, Copy } from 'lucide-svelte'

	export let copied = false
	export let value: string

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(value)
		copied = true
		setTimeout(() => {
			copied = false
		}, 2000)
	}
</script>

<div>
	<Button variant="ghost" size="icon" class="bg-transparent" on:click={copyToClipboard}>
		{#if copied}
			<Check class="h-4 w-4" />
		{:else}
			<Copy class="h-4 w-4" />
		{/if}
	</Button>
</div>
