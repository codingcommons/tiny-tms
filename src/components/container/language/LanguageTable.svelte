<script lang="ts">
	import * as Table from '$components/ui/table'
	import * as Form from '$components/ui/form'
	import { Input } from '$components/ui/input'
	import { Trash2 } from 'lucide-svelte'
	import type { LanguageSchema, LanguagesSchema } from './schema'
	import type { SuperForm } from 'sveltekit-superforms'
	import LanguageSelect from './LanguageSelect.svelte'
	import { createEventDispatcher } from 'svelte'
	import ConfirmationDialog, {
		type DialogCtaProps
	} from '$components/layout/dialog/ConfirmationDialog.svelte'
	import type { ControlSlotProps } from 'formsnap'

	interface Props {
		// https://superforms.rocks/concepts/nested-data
		form: SuperForm<LanguagesSchema>
		baseLanguage: LanguageSchema
	}

	let { form, baseLanguage }: Props = $props()

	let isDeleteModalOpen = $state(false)
	let deleteCtaProps: DialogCtaProps | undefined = $state()
	let deleteLanguage = $state('')

	const dispatch = createEventDispatcher<{ deleteLanguage: string | undefined }>()
	let { form: formData } = $derived(form)

	const getFallbackLanguages = (code: string) =>
		$formData.languages
			.filter((l) => l.code !== code)
			.map(({ code, label }) => ({ value: code, label }))

	const openDeleteModal = (language: LanguageSchema | undefined) => {
		if (!language) return

		const baseProps: Omit<DialogCtaProps, 'onClick' | 'formaction' | 'formId'> = {
			label: 'Delete',
			name: 'deleteLanguage',
			value: language.id,
			variant: 'destructive'
		}

		if (language.id) {
			deleteCtaProps = {
				...baseProps,
				formaction: '?/delete',
				formId: 'languagesForm',
				onClick: undefined
			}
		} else if (language.code) {
			deleteCtaProps = {
				...baseProps,
				onClick: () => dispatch('deleteLanguage', language.code),
				formaction: undefined,
				formId: undefined
			}
		}

		deleteLanguage = language.label
		isDeleteModalOpen = true
	}
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
							<Form.Control>
								{#snippet children({ attrs }: ControlSlotProps)}
									{#if $formData.languages[i]}
										<Input
											{...attrs}
											data-testid="languages-code-input-{i}"
											placeholder="Enter Language Code"
											bind:value={$formData.languages[i].code}
										/>
									{/if}
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Table.Cell>
					<Table.Cell>
						<Form.Field {form} name={`languages[${i}].label`}>
							<Form.Control>
								{#snippet children({ attrs }: ControlSlotProps)}
									{#if $formData.languages[i]}
										<Input
											{...attrs}
											data-testid="languages-label-input-{i}"
											placeholder="Enter Language Label"
											bind:value={$formData.languages[i].label}
										/>
									{/if}
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Table.Cell>
					<Table.Cell>
						{#if $formData.languages[i].code !== baseLanguage.code}
							<Form.Field {form} name={`languages[${i}].fallback`}>
								<Form.Control>
									{#snippet children({ attrs }: ControlSlotProps)}
										{#if $formData.languages[i]}
											{#key $formData.languages.length}
												<LanguageSelect
													{...attrs}
													placeholder="Select Base Language"
													data-testid="languages-fallback-select-{i}"
													languages={getFallbackLanguages($formData.languages[i].code)}
													bind:value={$formData.languages[i].fallback}
												/>
											{/key}
										{/if}
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						{/if}
					</Table.Cell>
					<Table.Cell>
						{#if $formData.languages[i].code !== baseLanguage.code}
							<button
								type="button"
								class="icon-button"
								data-testid="delete-language-button-{i}"
								onclick={() => openDeleteModal($formData.languages[i])}
							>
								<Trash2 size={20} />
							</button>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/if}
		{/each}
	</Table.Body>
</Table.Root>

{#if deleteCtaProps}
	<ConfirmationDialog
		title="Delete Language"
		description="Do you really want to delete language {deleteLanguage}?"
		cta={deleteCtaProps}
		bind:open={isDeleteModalOpen}
	/>
{/if}

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
