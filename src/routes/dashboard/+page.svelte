<script lang="ts">
	import ProjectCard from './(components)/ProjectCard.svelte'
	const projects = [
		{ id: 0, name: 'Tiny-TMS', fallback_language: 1 },
		{ id: 1, name: 'Super Cool Project 2', fallback_language: 1 },
		{ id: 2, name: 'Google', fallback_language: 0 },
		{ id: 3, name: 'i18n', fallback_language: 0 },
		{ id: 4, name: 'Other Stuff Project', fallback_language: 0 }
	]
</script>

<div
	class="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3"
>
	{#each projects as project}
		<ProjectCard {project} />
	{/each}
</div>
