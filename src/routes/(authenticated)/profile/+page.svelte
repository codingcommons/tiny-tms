<script lang="ts">
	import { pageTitle } from '$lib/utils/page-title'
	import type { PageData } from './$types'
	import MaxWidthWrapper from '$components/layout/width-wrapper/MaxWidthWrapper.svelte'
	import Separator from '$components/layout/separator/Separator.svelte'
	import DeleteProfile from '$components/container/profile/delete-profile.svelte'
	import ChangePassword from '$components/container/profile/change-password.svelte'

	export let data: PageData
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

			<ChangePassword />

			<Separator />

			<DeleteProfile userId={data.loggedInUser.id} />
		</div>
	</div>
</MaxWidthWrapper>
