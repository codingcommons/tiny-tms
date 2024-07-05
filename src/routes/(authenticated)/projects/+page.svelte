<script lang="ts">
	import { MainContent, MainContentHeader } from '$components/layout/main-content'
	import CreateProject from '$components/container/projects/create-project.svelte'
	import type { PageData } from './$types'
	import ProjectCardsLayout from '$components/container/projects/project-cards-layout.svelte'

	export let data: PageData
</script>

<MainContent>
	<MainContentHeader title="Projects">
		<CreateProject data={data.form} />
	</MainContentHeader>
	<ProjectCardsLayout projects={data.projects} />
</MainContent>
