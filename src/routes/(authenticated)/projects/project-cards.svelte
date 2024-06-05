<script lang="ts">
	import * as Card from '$components/ui/card'

	const projects = [
		{
			name: 'Project 1',
			lastUpdated: '2 Hours ago'
		},
		{
			name: 'Project 2',
			lastUpdated: '3 Hours ago'
		},
		{
			name: 'Project 3',
			lastUpdated: '4 Hours ago'
		},
		{
			name: 'Project 4',
			lastUpdated: '5 Hours ago'
		},
		{
			name: 'Project 1',
			lastUpdated: '2 Hours ago'
		},
		{
			name: 'Project 2',
			lastUpdated: '3 Hours ago'
		},
		{
			name: 'Project 3',
			lastUpdated: '4 Hours ago'
		}
	]
</script>

<div class="grid grid-cols-1 gap-2 xl:grid-cols-2 2xl:grid-cols-3">
	{#each projects as project}
		<Card.Root class="min-w-80 hover:bg-primary-foreground">
			<Card.Header class="h-20">
				<Card.Title class="text-2xl font-semibold">{project.name}</Card.Title>
			</Card.Header>
			<Card.Content class="flex h-28 items-end -space-x-2 pb-2">
				<div class="h-10 w-10 rounded-full bg-yellow-400"></div>
				<div class="h-10 w-10 rounded-full bg-red-400"></div>
				<div class="h-10 w-10 rounded-full bg-blue-400"></div>
				<div class="h-10 w-10 rounded-full bg-green-400"></div>
			</Card.Content>
			<Card.CardFooter class="h-14 pb-1 text-sm text-muted-foreground">
				Last updated: {project.lastUpdated}
			</Card.CardFooter>
		</Card.Root>
	{/each}
</div>
