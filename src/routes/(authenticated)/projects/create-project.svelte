<script lang="ts">
	import { buttonVariants } from '$components/ui/button/index.js'
	import * as Dialog from '$components/ui/dialog/index.js'
	import { Input } from '$components/ui/input/index.js'
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { type CreateProjectFormSchema, createProjectSchema } from './create-project-schema'
	import * as Form from '$components/ui/form'
	import { page } from '$app/stores'
	import { toast } from 'svelte-sonner'

	export let data: SuperValidated<Infer<CreateProjectFormSchema>>

	const form = superForm(data, {
		validators: zodClient(createProjectSchema),
		async onUpdated({ form }) {
			if (form.message) {
				if ($page.status >= 400) {
					toast.error(form.message)
				} else {
					toast.success(form.message)
					// TODO navigate based on id
					// await goto('/projects/1/languages')
				}
			}
		}
	})

	const { form: formData, enhance } = form
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>+ Create Project</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<form method="POST" use:enhance>
			<Dialog.Header>
				<Dialog.Title>New Project</Dialog.Title>
				<!-- <Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description> -->
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} placeholder="Enter Name" bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="base_language">
					<Form.Control let:attrs>
						<Form.Label>Base Language</Form.Label>
						<Input
							{...attrs}
							placeholder="Enter Base Language"
							bind:value={$formData.base_language}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Dialog.Footer>
				<Form.Button>Create Project</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
