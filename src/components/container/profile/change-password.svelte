<script lang="ts">
	import { buttonVariants } from '$components/ui/button'
	import * as Dialog from '$components/ui/dialog'
	import * as Form from '$components/ui/form'
	import { KeyRound } from 'lucide-svelte'
	import { page } from '$app/stores'
	import { toast } from 'svelte-sonner'
	import Input from '$components/ui/input/input.svelte'
	import { changePasswordSchema } from './schema'
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { type ControlAttrs } from 'formsnap'

	interface Props {
		data: SuperValidated<Infer<typeof changePasswordSchema>>
	}

	let { data }: Props = $props()

	const form = superForm(data, {
		validators: zodClient(changePasswordSchema),
		async onUpdated({ form }) {
			if (form.message) {
				if ($page.status >= 400) {
					toast.error(form.message)
				} else {
					toast.success(form.message)
					open = false
				}
			}
		}
	})

	const { form: formData, enhance } = form

	let open: boolean = $state(false)
</script>

<div class="flex flex-col gap-1">
	<h3 class="text-xl font-medium">Credentials</h3>
	<p class="text-muted-foreground">Update your password</p>

	<div class="flex">
		<Dialog.Root bind:open>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
				<KeyRound class="mr-2 h-5 w-5" />Edit password
			</Dialog.Trigger>

			<Dialog.Content class="sm:max-w-[425px]">
				<form method="POST" action="?/changePassword" use:enhance>
					<Dialog.Header>
						<Dialog.Title>Edit password</Dialog.Title>
						<!-- <Dialog.Description></Dialog.Description> -->
					</Dialog.Header>

					<div class="my-3 flex flex-col gap-3">
						<Form.Field {form} name="currentPassword">
							<Form.Control>
								{#snippet children({ attrs }: { attrs: ControlAttrs })}
									<Form.Label>Current Password</Form.Label>
									<Input
										type="password"
										data-testid="current-password"
										placeholder="Enter current password"
										{...attrs}
										bind:value={$formData.currentPassword}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="newPassword">
							<Form.Control>
								{#snippet children({ attrs }: { attrs: object })}
									<Form.Label>New Password</Form.Label>
									<Input
										type="password"
										data-testid="new-password"
										placeholder="Enter new password"
										{...attrs}
										bind:value={$formData.newPassword}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="confirmPassword">
							<Form.Control>
								{#snippet children({ attrs }: { attrs: object })}
									<Form.Label>Confirm Password</Form.Label>
									<Input
										type="password"
										data-testid="confirm-password"
										placeholder="Confirm password"
										{...attrs}
										bind:value={$formData.confirmPassword}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<Dialog.Footer>
						<Form.Button variant="default">Update Password</Form.Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>
