<script lang="ts">
	import { MainContent, MainContentHeader } from '$components/layout/main-content'
	import Button from '$components/ui/button/button.svelte'
	import ProjectCards from './project-cards.svelte'
</script>

<MainContent>
	<MainContentHeader title="Projects">
		<Button>+ New Project</Button>
	</MainContentHeader>
	<ProjectCards />
</MainContent>
