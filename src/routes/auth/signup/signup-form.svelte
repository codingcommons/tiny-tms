<script lang="ts">
	import * as Form from '$components/ui/form'
	import { Input } from '$components/ui/input'
	import * as Card from '$components/ui/card'
	import { type SignupFormSchema, signupSchema } from './schema'
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { page } from '$app/stores'
	import { toast } from 'svelte-sonner'
	import { goto } from '$app/navigation'

	export let data: SuperValidated<Infer<SignupFormSchema>>

	const form = superForm(data, {
		validators: zodClient(signupSchema),
		async onUpdated({ form }) {
			if (form.message) {
				if ($page.status >= 400) {
					toast.error(form.message)
				} else {
					toast.success(form.message)
					await goto('/auth/login')
				}
			}
		}
	})

	const { form: formData, enhance } = form
	$formData.email = 'test@test.com'
	$formData.password = 'passwordAÖOGDÖADG'
	$formData.confirmPassword = 'passwordAÖOGDÖADG'
</script>

<form method="POST" use:enhance>
	<Card.Root class="m-auto w-[350px]">
		<Card.Header>
			<Card.Title>Sign Up to tiny-tms</Card.Title>
			<Card.Description>Register to tiny-tms and start doing you translations</Card.Description>
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
			<Form.Field {form} name="confirmPassword">
				<Form.Control let:attrs>
					<Form.Label>Confirm Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.confirmPassword} />
				</Form.Control>
				<Form.Description>This is your password</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer class="flex justify-end">
			<Form.Button>Sign Up</Form.Button>
		</Card.Footer>
	</Card.Root>
</form>
