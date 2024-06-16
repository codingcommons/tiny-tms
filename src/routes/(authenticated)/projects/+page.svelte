<script lang="ts">
	import { MainContent, MainContentHeader } from '$components/layout/main-content'
	import ProjectCards from '$components/container/projects/project-cards.svelte'
	import CreateProject from '$components/container/projects/create-project.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<MainContent>
	<MainContentHeader title="Projects">
		<CreateProject data={data.form} />
	</MainContentHeader>
	<ProjectCards projects={data.projects} />
</MainContent>
