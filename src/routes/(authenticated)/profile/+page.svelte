<script lang="ts">
	import { goto } from '$app/navigation'
	import { pageTitle } from '$lib/utils/seo'
	import { page } from '$app/stores'
	import type { PageData } from './$types'
	import MaxWidthWrapper from '$components/width-wrapper/MaxWidthWrapper.svelte'
	import Separator from '$components/separator/Separator.svelte'
	import Button from '$components/ui/button/button.svelte'
	import * as Dialog from '$components/ui/dialog'
	import { buttonVariants } from '$components/ui/button'
	import { KeyRound, LogOut, Trash } from 'lucide-svelte'
	import { toast } from 'svelte-sonner'
	import Input from '$components/ui/input/input.svelte'
	import Label from '$components/ui/label/label.svelte'

	export let data: PageData

	const handleDeleteAccount = async () => {
		const response = await fetch($page.url, {
			method: 'DELETE',
			body: JSON.stringify({ userId: data.loggedInUser.id })
		})

		if (response.ok) {
			toast.success('Account successfully deleted')
			await goto('/logout')
		} else {
			toast.error('Ups, failed to delete account')
		}
	}

	let currentPassword: string
	let newPassword: string
	let confirmPassword: string
	let passwordValidationErrMessage: string = ''
	let changePasswordDialogOpen: boolean
	const handleUpdatePassword = async () => {
		if (newPassword !== confirmPassword) {
			passwordValidationErrMessage = 'New password does not match with confirm password!'
		} else passwordValidationErrMessage = ''

		const response = await fetch($page.url, {
			method: 'PUT',
			body: JSON.stringify({ currentPassword, newPassword })
		})

		if (response.ok) {
			toast.success('Password successfully updated')
			changePasswordDialogOpen = false
		} else {
			toast.error('Ups, failed to update password')
			const errorResponse = (await response.json()) as { message: string }
			console.error(errorResponse.message)
		}
	}
</script>

<svelte:head>
	<title>{pageTitle('Profile')}</title>
</svelte:head>

<MaxWidthWrapper class="pt-4">
	<div class="flex flex-col">
		<h3 class="text-2xl font-bold">Settings</h3>
		<p class="text-muted-foreground">Manage your account, settings and more.</p>
	</div>

	<div class="py-8 md:flex-row">
		<div class="space-y-3">
			<div class="flex flex-col gap-1">
				<h3 class="text-2xl font-medium">Profile</h3>
				<p class="text-muted-foreground">Update your account details here.</p>
			</div>

			<Separator />

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
										{#if passwordValidationErrMessage}
											<div class="text-sm font-medium text-destructive">
												{passwordValidationErrMessage}
											</div>
										{/if}
									</div>
								</Dialog.Description>
							</Dialog.Header>

							<Dialog.Footer>
								<Button variant="default" type="submit" on:click={handleUpdatePassword}>
									Update Password
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				</div>
			</div>

			<Separator />

			<div class="rounded border-2 border-dashed border-destructive">
				<div class="m-2 flex flex-col gap-1">
					<h3 class="text-xl font-medium text-destructive">Danger Zone</h3>
					<p class="text-muted-foreground">
						Deleting the profile would remove all your data and your current subscription.
					</p>

					<div class="flex gap-2">
						<Dialog.Root>
							<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
								<Trash class="mr-2 h-5 w-5" />Delete your account
							</Dialog.Trigger>
							<Dialog.Content class="sm:max-w-[425px]">
								<Dialog.Header>
									<Dialog.Title>Delete profile</Dialog.Title>
									<Dialog.Description>
										Are you sure you want to delete your profile? <br />
										This action is permanent and cannot be undone.
									</Dialog.Description>
								</Dialog.Header>

								<Dialog.Footer>
									<Button variant="destructive" type="submit" on:click={handleDeleteAccount}>
										Delete now <Trash class="ml-2 h-5 w-5" />
									</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
						<Button href="/logout" variant="outline"><LogOut class="mr-2 h-4 w-4" /> Logout</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</MaxWidthWrapper>
