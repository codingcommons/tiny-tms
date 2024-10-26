<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun'
	import Moon from 'lucide-svelte/icons/moon'
	import Computer from 'lucide-svelte/icons/computer'
	import { ModeWatcher, mode, setMode } from 'mode-watcher'

	let currentMode: 'dark' | 'light' | 'system' = $state($mode || 'system')

	$effect(() => {
		setMode(currentMode)
	})
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
	<label for="system" class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full">
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
	<label for="light" class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full">
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
	<label for="dark" class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full">
		<Moon class="h-[1.2rem] w-[1.2rem]" />
	</label>
</div>

<style lang="postcss">
	input[type='radio']:checked + label {
		@apply border border-primary;
	}
</style>
