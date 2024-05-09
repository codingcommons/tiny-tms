<script lang="ts">
	import { showDetails } from './InfoPanel.svelte'

	export let component: string
	export let props: Record<string, unknown> | undefined = undefined
	export let events: Record<string, unknown> | undefined = undefined

	const show = () => showDetails({ component, props, events })
</script>

<div class="story" role="button" tabindex="0" on:click={show} on:keyup={show}>
	<span class="wrapper">
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<span class="click-stopper" on:click|stopPropagation on:keyup|stopPropagation>
			<slot />
		</span>
	</span>
</div>
