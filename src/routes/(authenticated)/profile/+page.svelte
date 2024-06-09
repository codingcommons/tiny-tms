<script lang="ts">
	import { pageTitle } from '$lib/utils/page-title'
	import type { PageData } from './$types'
	import { MainContent, MainContentHeader } from '$components/layout/main-content'
	import Separator from '$components/layout/separator/Separator.svelte'
	import DeleteProfile from '$components/container/profile/delete-profile.svelte'
	import ChangePassword from '$components/container/profile/change-password.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<svelte:head>
	<title>{pageTitle('Profile')}</title>
</svelte:head>

<MainContent>
	<MainContentHeader title="Projects" />

	<div class="space-y-3">
		<ChangePassword data={data.changePasswordForm} />

		<Separator />

		<DeleteProfile />
	</div>
</MainContent>
