<script lang="ts">
	import type { Project } from 'services/project/project'
	import ProjectCard from './project-card.svelte'

	interface Props {
		projects?: Project[]
	}

	let { projects = [] }: Props = $props()
</script>

<div class="gridlayout grid gap-2">
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

<style class="pcss">
	.gridlayout {
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	}
</style>
