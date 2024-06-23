<script lang="ts">
	import { goto } from '$app/navigation'
	import { pageTitle } from '$lib/utils/seo'
	import { page } from '$app/stores'
	import type { PageData } from './$types'
	import MaxWidthWrapper from '$components/width-wrapper/MaxWidthWrapper.svelte'
	import Separator from '$components/separator/Separator.svelte'
	import SecondarySideBar from '$components/secondary-side-bar/SecondarySideBar.svelte'
	import Button from '$components/ui/button/button.svelte'
	import * as Dialog from '$components/ui/dialog'
	import { buttonVariants } from '$components/ui/button'
	import { LogOut, Trash } from 'lucide-svelte'
	import { toast } from 'svelte-sonner'

	export let data: PageData

	const sidebarNavItems = [
		{
			title: 'Profile',
			href: '/profile'
		}
	]

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
</script>

<svelte:head>
	<!-- TODO: Should derive from active tab -->
	<title>{pageTitle('Profile')}</title>
</svelte:head>

<MaxWidthWrapper>
	<div class="flex flex-col pt-5">
		<h3 class="text-2xl font-bold">Settings</h3>
		<p class="text-muted-foreground">Manage your account, settings and more.</p>
	</div>

	<div dir="ltr" class="flex flex-col gap-10 py-8 md:flex-row">
		<aside>
			<h3 class="pb-4 text-xl font-medium">
				Hi {data.loggedInUser.first_name}
				{data.loggedInUser.last_name} 👋
			</h3>

			<SecondarySideBar items={sidebarNavItems} />
		</aside>

		<div class="space-y-6">
			<h3 class="text-2xl font-medium">Account</h3>

			<Separator />

			<p class="text-muted-foreground">
				Deleting the account would remove all your data and your current subscription.
			</p>

			<div class="flex gap-2">
				<Dialog.Root>
					<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
						<Trash class="mr-2 h-5 w-5" />Delete your account
					</Dialog.Trigger>
					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>Delete account</Dialog.Title>
							<Dialog.Description>
								Are you sure you want to delete your account? <br />
								This action cannot be undone.
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
</MaxWidthWrapper>
