<script lang="ts">
	import * as Form from '$components/ui/form'
	import { Input } from '$components/ui/input'
	import { Checkbox } from '$components/ui/checkbox'
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
					await goto('/login')
				}
			}
		}
	})

	const { form: formData, enhance } = form
</script>

<div class="flex items-center justify-center">
	<div class="w-full max-w-2xl">
		<div class="text-center">
			<h2 class="mt-6 text-center text-3xl font-extrabold">Register</h2>
			<p class="mt-2 text-center text-sm">
				Enter you information to create an user account for this Tiny-TMS instance
			</p>
			<p class="text-center text-sm">
				or <a href="/login" class="font-medium underline">sign in to an existing account</a>
			</p>
		</div>
		<form method="POST" use:enhance>
			<Form.Field {form} name="first_name">
				<Form.Control let:attrs>
					<Form.Label>First Name</Form.Label>
					<Input
						{...attrs}
						placeholder="Tiny"
						data-testid="signup-firstname-input"
						bind:value={$formData.first_name}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="last_name">
				<Form.Control let:attrs>
					<Form.Label>Last Name</Form.Label>
					<Input
						{...attrs}
						placeholder="Translator"
						data-testid="signup-lastname-input"
						bind:value={$formData.last_name}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input
						{...attrs}
						placeholder="m@example.com"
						data-testid="signup-email-input"
						bind:value={$formData.email}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input
						{...attrs}
						placeholder="enter password"
						type="password"
						data-testid="signup-password-input"
						bind:value={$formData.password}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="confirmPassword">
				<Form.Control let:attrs>
					<Form.Label>Confirm Password</Form.Label>
					<Input
						{...attrs}
						placeholder="enter password again"
						type="password"
						data-testid="signup-password-confirm-input"
						bind:value={$formData.confirmPassword}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="termsOfService">
				<Form.Control let:attrs>
					<div class="mb-5 mt-7 flex items-center justify-between">
						<div class="flex items-center">
							<Checkbox
								{...attrs}
								data-testid="signup-terms-checkbox"
								bind:checked={$formData.termsOfService}
							/>
							<Form.Label class="ml-2 text-sm">
								I agree with the <a href="/terms-of-service" class="font-medium underline">
									Terms of Service
								</a>
							</Form.Label>
							<input name={attrs.name} value={$formData.termsOfService} hidden />
						</div>
					</div>
				</Form.Control>
			</Form.Field>

			<Form.Button class="w-full" data-testid="signup-cta">Sign Up</Form.Button>
		</form>
	</div>
</div>
