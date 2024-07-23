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
	import SlugDisplay from './slug-display.svelte'
	import { debounce } from '$lib/utils/debounce'

	export let data: SuperValidated<Infer<typeof createProjectSchema>>

	let open = false

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
		<form method="POST" action="?/post" use:enhance>
			<Dialog.Header>
				<Dialog.Title>New Project</Dialog.Title>
				<Dialog.Description>
					Create a new project and start translating your application.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input
							{...attrs}
							data-testid="create-project-name-input"
							placeholder="Enter Name"
							bind:value={$formData.name}
							on:input={checkProjectName}
						/>
					</Form.Control>
					<SlugDisplay name={$formData.name} />
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="base_language_code">
					<Form.Control let:attrs>
						<Form.Label>Base Language</Form.Label>
						<Input
							{...attrs}
							data-testid="create-project-base-language-input"
							placeholder="Enter Base Language"
							bind:value={$formData.base_language_code}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Dialog.Footer>
				<Form.Button disabled={$allErrors.length !== 0} data-testid="create-project-submit-button">
					Create Project
				</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
