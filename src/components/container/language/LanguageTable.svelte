<script lang="ts">
	import * as Table from '$components/ui/table'
	import * as Form from '$components/ui/form'
	import { Input } from '$components/ui/input'
	import { Trash2 } from 'lucide-svelte'
	import type { LanguageSchema, LanguagesSchema } from './schema'
	import type { SuperForm } from 'sveltekit-superforms'
	import LanguageSelect from './LanguageSelect.svelte'
	import { createEventDispatcher } from 'svelte'

	// https://superforms.rocks/concepts/nested-data
	export let form: SuperForm<LanguagesSchema>
	export let baseLanguage: LanguageSchema

	const dispatch = createEventDispatcher<{ deleteLanguage: string | undefined }>()
	$: ({ form: formData } = form)

	$: fallbackLanguages = $formData.languages.map(({ code, label }) => ({ value: code, label }))
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Code</Table.Head>
			<Table.Head>Label</Table.Head>
			<Table.Head>Fallback</Table.Head>
			<Table.Head class="w-[100px]">Action</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each $formData.languages as language, i (language.id)}
			{#if $formData.languages[i]}
				<Table.Row>
					<Table.Cell class="font-medium">
						<Form.Field {form} name={`languages[${i}].code`}>
							<Form.Control let:attrs>
								{#if $formData.languages[i]}
									<Input
										{...attrs}
										data-testid="languages-code-input-{i}"
										placeholder="Enter Language Code"
										bind:value={$formData.languages[i].code}
									/>
								{/if}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Table.Cell>
					<Table.Cell>
						<Form.Field {form} name={`languages[${i}].label`}>
							<Form.Control let:attrs>
								{#if $formData.languages[i]}
									<Input
										{...attrs}
										data-testid="languages-label-input-{i}"
										placeholder="Enter Language Label"
										bind:value={$formData.languages[i].label}
									/>
								{/if}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Table.Cell>
					<Table.Cell>
						{#if $formData.languages[i].code !== baseLanguage.code}
							<Form.Field {form} name={`languages[${i}].fallback`}>
								<Form.Control let:attrs>
									{#if $formData.languages[i]}
										<LanguageSelect
											{...attrs}
											placeholder="Select Base Language"
											data-testid="languages-fallback-select-{i}"
											bind:languages={fallbackLanguages}
											bind:value={$formData.languages[i].fallback}
										/>
									{/if}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						{/if}
					</Table.Cell>
					<Table.Cell>
						{#if $formData.languages[i].code !== baseLanguage.code}
							{#if $formData.languages[i].id}
								<button
									type="submit"
									class="icon-button"
									name="deleteLanguage"
									data-testid="delete-language-button-{i}"
									formaction="?/delete"
									value={$formData.languages[i].id}
								>
									<Trash2 size={20} />
								</button>
							{:else}
								<button
									type="button"
									class="icon-button"
									data-testid="delete-language-button-{i}"
									on:click={() => dispatch('deleteLanguage', $formData.languages[i]?.code)}
								>
									<Trash2 size={20} />
								</button>
							{/if}
						{/if}
					</Table.Cell>
				</Table.Row>
			{/if}
		{/each}
	</Table.Body>
</Table.Root>

<style lang="postcss">
	.icon-button {
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		color: var(--color-text-primary);
		transition: color 0.2s ease-in-out;
	}

	.icon-button:hover {
		color: var(--color-error);
	}
</style>
