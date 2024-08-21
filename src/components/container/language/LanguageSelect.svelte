<script lang="ts">
	import * as Select from '$components/ui/select'
	import { type LanguageCode, availableLanguages } from './languages'

	export let name: string
	export let value: LanguageCode
	export let placeholder = 'Select Language'
	export let disabled = false
	export let typeahead = true

	const items = Object.entries(availableLanguages).map(([value, label]) => ({
		value: value as LanguageCode,
		label
	}))
</script>

<Select.Root
	{disabled}
	{typeahead}
	{items}
	onSelectedChange={(s) => {
		s && (value = s.value)
	}}
>
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
