<script lang="ts">
	import { run } from 'svelte/legacy'

	import * as Select from '$components/ui/select'
	import type { Selected } from 'bits-ui'
	import { type LanguageCode, availableLanguages } from './languages'

	type LanguageOption = Selected<string>

	type Props = {
		name: string
		value: string | undefined
		languages?: LanguageOption[] | undefined
		placeholder?: string
		disabled?: boolean
		typeahead?: boolean
		'data-testid'?: string
	}

	let {
		name,
		value = $bindable(),
		languages = undefined,
		placeholder = 'Select Language',
		disabled = false,
		typeahead = true,
		...rest
	}: Props = $props()

	const items =
		languages ??
		Object.entries(availableLanguages).map(([value, label]) => ({
			value: value as LanguageCode,
			label
		}))

	let selected: Selected<string> | undefined = $state(items.find((item) => item.value === value))
	run(() => {
		value = selected?.value
	})
</script>

<Select.Root {disabled} {typeahead} {items} bind:selected>
	<Select.Input {name} />
	<Select.Trigger class="w-full" {...rest}>
		<Select.Value {placeholder} />
	</Select.Trigger>
	<Select.Content class="max-h-[400px] overflow-y-auto">
		{#each items as language}
			<Select.Item value={language.value} label="{language.value} - {language.label}" />
		{/each}
	</Select.Content>
</Select.Root>
