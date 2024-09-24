<script lang="ts">
	import * as Select from '$components/ui/select'
	import type { Selected } from 'bits-ui'
	import { type LanguageCode, availableLanguages } from './languages'

	type LanguageOption = Selected<string>

	export let name: string
	export let value: string | undefined
	export let languages: LanguageOption[] | undefined = undefined
	export let placeholder = 'Select Language'
	export let disabled = false
	export let typeahead = true

	const items =
		languages ??
		Object.entries(availableLanguages).map(([value, label]) => ({
			value: value as LanguageCode,
			label
		}))

	let selected: Selected<string> | undefined = items.find((item) => item.value === value)
	$: value = selected?.value
</script>

<Select.Root {disabled} {typeahead} {items} bind:selected>
	<Select.Input {name} />
	<Select.Trigger class="w-full" {...$$restProps}>
		<Select.Value {placeholder} />
	</Select.Trigger>
	<Select.Content class="max-h-[400px] overflow-y-auto">
		{#each items as language}
			<Select.Item value={language.value} label="{language.value} - {language.label}" />
		{/each}
	</Select.Content>
</Select.Root>
