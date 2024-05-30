<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun'
	import Moon from 'lucide-svelte/icons/moon'
	import Computer from 'lucide-svelte/icons/computer'

	import { ModeWatcher, mode, setMode } from 'mode-watcher'
	let currentMode: 'dark' | 'light' | 'system' = $mode || 'system'

	$: {
		setMode(currentMode)
	}
</script>

<ModeWatcher />

<div class="inline-flex w-auto items-center rounded-full border border-primary">
	<input
		type="radio"
		id="system"
		name="mode"
		class="hidden"
		value={'system'}
		bind:group={currentMode}
	/>
	<label
		for="system"
		class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full {currentMode ===
		'system'
			? 'selected'
			: ''}"
	>
		<Computer class="h-[1.2rem] w-[1.2rem]" />
	</label>

	<input
		type="radio"
		id="light"
		name="mode"
		class="hidden"
		value={'light'}
		bind:group={currentMode}
	/>
	<label
		for="light"
		class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full {currentMode ===
		'light'
			? 'selected'
			: ''}"
	>
		<Sun class="h-[1.2rem] w-[1.2rem]" />
	</label>

	<input
		type="radio"
		id="dark"
		name="mode"
		class="hidden"
		value={'dark'}
		bind:group={currentMode}
	/>
	<label
		for="dark"
		class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full {currentMode ===
		'dark'
			? 'selected'
			: ''}"
	>
		<Moon class="h-[1.2rem] w-[1.2rem]" />
	</label>
</div>

<!--
    This is obviously not a sound implementation of the selected attribute, but I do not get it to work so this is fine until I get it to work.
-->
<style lang="css">
	.selected {
		@apply border border-primary;
	}
</style>
