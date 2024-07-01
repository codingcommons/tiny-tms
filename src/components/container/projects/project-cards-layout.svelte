<script lang="ts">
	import type { SelectableProject } from 'services/project/project'
	import ProjectCard from './project-card.svelte'

	export let projects: SelectableProject[] = []
</script>

<div class="grid grid-cols-1 gap-2 xl:grid-cols-2 2xl:grid-cols-3">
	{#each projects as project}
		<ProjectCard {project} />
	{/each}
</div>

{#if projects.length === 0}
	<div class="flex h-full w-full">
		<div class="mx-auto text-center">
			<h3 class="text-2xl font-bold tracking-tight">You have no projects</h3>
			<p class="text-sm text-muted-foreground">
				You can start translating as soon as you add a project
			</p>
		</div>
	</div>
{/if}
