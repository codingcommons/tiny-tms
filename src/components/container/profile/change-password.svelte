<script lang="ts">
	import { buttonVariants } from '$components/ui/button'
	import Button from '$components/ui/button/button.svelte'
	import * as Dialog from '$components/ui/dialog'
	import { KeyRound } from 'lucide-svelte'
	import { page } from '$app/stores'
	import { toast } from 'svelte-sonner'
	import Label from '$components/ui/label/label.svelte'
	import Input from '$components/ui/input/input.svelte'

	let currentPassword: string
	let newPassword: string
	let confirmPassword: string
	let changePasswordDialogOpen: boolean
	// TODO: add further password strength validation
	$: showValidationError = Boolean(
		newPassword && confirmPassword && newPassword !== confirmPassword
	)
	const updatePassword = async () => {
		const response = await fetch($page.url, {
			method: 'PUT',
			body: JSON.stringify({ currentPassword, newPassword })
		})

		if (response.ok) {
			toast.success('Password successfully updated')
			resetChangePasswordInputs()
			changePasswordDialogOpen = false
		} else {
			toast.error('Ups, failed to update password')
			const errorResponse = (await response.json()) as { message: string }
			console.error(errorResponse.message)
		}
	}

	const resetChangePasswordInputs = () => {
		currentPassword = ''
		newPassword = ''
		confirmPassword = ''
	}
</script>

<div class="flex flex-col gap-1">
	<h3 class="text-xl font-medium">Credentials</h3>
	<p class="text-muted-foreground">Update your password</p>

	<div class="flex">
		<Dialog.Root bind:open={changePasswordDialogOpen}>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
				<KeyRound class="mr-2 h-5 w-5" />Edit password
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Edit password</Dialog.Title>
					<Dialog.Description>
						<div class="mt-3 flex flex-col gap-3">
							<div class="flex w-full max-w-sm flex-col gap-2">
								<Label for="password">Password</Label>
								<Input
									type="password"
									id="password"
									placeholder="password"
									bind:value={currentPassword}
								/>
							</div>

							<div class="flex w-full max-w-sm flex-col gap-2">
								<Label for="new-password">New Password</Label>
								<Input
									type="password"
									id="new-password"
									placeholder="new password"
									bind:value={newPassword}
								/>
							</div>

							<div class="flex w-full max-w-sm flex-col gap-2">
								<Label for="confirm-passowrd">Confirm Password</Label>
								<Input
									type="password"
									id="confirm-passowrd"
									placeholder="confirm password"
									bind:value={confirmPassword}
								/>
							</div>
							{#if showValidationError}
								<div class="text-sm font-medium text-destructive">
									New password does not match with confirm password!
								</div>
							{/if}
						</div>
					</Dialog.Description>
				</Dialog.Header>

				<Dialog.Footer>
					<Button
						variant="default"
						type="submit"
						disabled={showValidationError || !currentPassword || !newPassword || !confirmPassword}
						on:click={updatePassword}
					>
						Update Password
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>
