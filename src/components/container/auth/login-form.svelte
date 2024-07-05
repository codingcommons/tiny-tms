<script lang="ts">
	import * as Form from '$components/ui/form'
	import { Input } from '$components/ui/input'
	import { Checkbox } from '$components/ui/checkbox'
	import { Label } from '$components/ui/label'
	import { type LoginFormSchema, loginSchema } from './schema'
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { page } from '$app/stores'
	import { toast } from 'svelte-sonner'
	import { goto } from '$app/navigation'

	export let data: SuperValidated<Infer<LoginFormSchema>>

	const form = superForm(data, {
		validators: zodClient(loginSchema),
		async onUpdate({ form }) {
			if (form.message) {
				if ($page.status >= 400) {
					toast.error(form.message)
				} else {
					toast.success(form.message)
					await goto('/projects')
				}
			}
		}
	})

	const { form: formData, enhance } = form
</script>

<div class="flex items-center justify-center">
	<div class="w-full max-w-2xl">
		<div class="text-center">
			<h2 class="mt-6 text-center text-3xl font-extrabold">Sign in to your account</h2>
			<p class="mt-2 text-center text-sm">
				Or <a href="/signup" class="font-medium underline">sign up for a new account</a>
			</p>
		</div>
		<form method="POST" use:enhance>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input
						{...attrs}
						placeholder="m@example.com"
						data-testid="login-email-input"
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
						type="password"
						placeholder="enter password"
						data-testid="login-password-input"
						bind:value={$formData.password}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="mb-5 mt-7 flex items-center justify-between">
				<div class="flex items-center">
					<Checkbox id="stay-logged-in" data-testid="stay-logged-in" />
					<Label for="stay-logged-in" class="ml-2 text-sm">Stay logged in</Label>
				</div>
				<div class="text-sm">
					<a href="/forgot-password" class="font-medium underline">Forgot your password?</a>
				</div>
			</div>
			<Form.Button data-testid="login-cta" class="w-full">Log In</Form.Button>
		</form>
		<div class="mt-5 text-sm">
			Check out our <a href="/code-of-conduct" class="font-medium underline">Code of Conduct</a>
			and
			<a href="privacy-policy" class="font-medium underline">Privacy Policy</a>
			page.
		</div>
	</div>
</div>
