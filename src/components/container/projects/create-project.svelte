<script lang="ts">
	import { buttonVariants } from '$components/ui/button'
	import * as Dialog from '$components/ui/dialog'
	import { Input } from '$components/ui/input'
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { createProjectSchema } from './create-project-schema'
	import * as Form from '$components/ui/form'
	import { page } from '$app/stores'
	import { toast } from 'svelte-sonner'
	import LanguageSelect from '../language/LanguageSelect.svelte'
	import SlugDisplay from './slug-display.svelte'
	import { debounce } from '$lib/utils/debounce'
	import type { ControlSlotProps } from 'formsnap'
	import Button from '$components/ui/button/button.svelte'

	interface Props {
		data: SuperValidated<Infer<typeof createProjectSchema>>
	}

	let { data }: Props = $props()

	let open = $state(false)

	const form = superForm(data, {
		validators: zodClient(createProjectSchema),
		validationMethod: 'oninput',
		async onUpdated({ form }) {
			if (form.message) {
				if ($page.status >= 400) {
					toast.error(form.message)
				} else {
					toast.success(form.message.message)
					open = false
				}
			}
		},
		async onChange(event) {
			// if name changed the server error is no longer relevant
			if (event.paths.includes('name')) {
				nameServerError = []
			}

			$errors.name = [...nameServerError, ...($errors.name || [])]
		}
	})

	const { form: formData, enhance, errors, allErrors } = form

	// name validation hidden form
	let nameServerError: string[] = []

	const { submit } = superForm(
		{ name: '' },
		{
			invalidateAll: false,
			applyAction: false,
			SPA: '?/check',
			onSubmit(event) {
				if (!$formData.name) {
					event.cancel()
				}

				event.formData.set('name', $formData.name)
			},
			onUpdated({ form }) {
				nameServerError = form.errors.name || []
				$errors.name = [...nameServerError, ...($errors.name || [])]
			}
		}
	)
	const checkProjectName = debounce(submit, 300)
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		data-testid="create-project-modal-trigger"
		class={buttonVariants({ variant: 'default' })}
	>
		+ Create Project
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<form method="POST" action="?/createProject" use:enhance>
			<Dialog.Header>
				<Dialog.Title>New Project</Dialog.Title>
				<Dialog.Description>
					Create a new project and start translating your application.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ attrs }: ControlSlotProps)}
							<Form.Label>Name</Form.Label>
							<Input
								{...attrs}
								data-testid="create-project-name-input"
								placeholder="Enter Name"
								onInput={checkProjectName}
								bind:value={$formData.name}
							/>
						{/snippet}
					</Form.Control>
					<SlugDisplay name={$formData.name} />
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="base_language">
					<Form.Control>
						{#snippet children({ attrs }: ControlSlotProps)}
							<Form.Label>Base Language</Form.Label>
							<LanguageSelect
								{...attrs}
								placeholder="Select Base Language"
								data-testid="create-project-base-language-select"
								bind:value={$formData.base_language}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Dialog.Footer>
				<Button
					type="submit"
					disabled={$allErrors.length !== 0}
					data-testid="create-project-submit-button"
				>
					Create Project
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
