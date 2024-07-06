<script lang="ts">
	import { buttonVariants } from '$components/ui/button'
	import Button from '$components/ui/button/button.svelte'
	import * as Dialog from '$components/ui/dialog'
	import { LogOut, Trash } from 'lucide-svelte'
	import { page } from '$app/stores'
	import { toast } from 'svelte-sonner'
	import { goto } from '$app/navigation'

	export let userId: number

	const handleDeleteAccount = async () => {
		const response = await fetch($page.url, {
			method: 'DELETE',
			body: JSON.stringify({ userId })
		})

		if (response.ok) {
			toast.success('Account successfully deleted')
			await goto('/logout')
		} else {
			toast.error('Ups, failed to delete account')
		}
	}
</script>

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
