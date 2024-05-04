<script lang="ts">
	import * as Form from '$components/ui/form'
	import { Input } from '$components/ui/input'
	import * as Card from '$components/ui/card'
	import { loginSchema, type ĹoginFormSchema } from './schema'
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { page } from '$app/stores'
	import { toast } from 'svelte-sonner'
	import { goto } from '$app/navigation'

	export let data: SuperValidated<Infer<ĹoginFormSchema>>

	const form = superForm(data, {
		validators: zodClient(loginSchema),
		async onUpdated({ form }) {
			if (form.message) {
				if ($page.status >= 400) {
					toast.error(form.message)
				} else {
					toast.success(form.message)
					await goto('/guarded')
				}
			}
		}
	})

	const { form: formData, enhance } = form
	$formData.email = 'test@test.com'
	$formData.password = 'passwordAÖOGDÖADG'
</script>

<form method="POST" use:enhance>
	<Card.Root class="m-auto w-[350px]">
		<Card.Header>
			<Card.Title>Log In</Card.Title>
			<Card.Description>Log In to tiny-tms and start doing you translations</Card.Description>
		</Card.Header>
		<Card.Content>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>E-Mail</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.Description>This is your e-mail.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.Description>This is your password</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer class="flex justify-end">
			<Form.Button>Log In</Form.Button>
		</Card.Footer>
	</Card.Root>
</form>
