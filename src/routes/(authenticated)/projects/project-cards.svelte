<script lang="ts">
	import * as Card from '$components/ui/card'

	import Ellipsis from 'lucide-svelte/icons/ellipsis'
	import * as Popover from '$components/ui/popover'
	import type { SelectableProject } from 'services/project/project'
	import { formatDistanceToNow } from 'date-fns'

	export let projects: SelectableProject[] = []
</script>

<div class="grid grid-cols-1 gap-2 xl:grid-cols-2 2xl:grid-cols-3">
	{#each projects as project, index}
		<a href={`/projects/${index}/translations`}>
			<Card.Root class="min-w-80 cursor-pointer hover:bg-primary-foreground">
				<Card.Header class="h-20">
					<div class="flex">
						<Card.Title class="text-2xl font-semibold">{project.name}</Card.Title>
						<button class="ml-auto" on:click|preventDefault>
							<Popover.Root>
								<Popover.Trigger class="px-2">
									<Ellipsis />
								</Popover.Trigger>
								<Popover.Content>Place content for the popover here.</Popover.Content>
							</Popover.Root>
						</button>
					</div>
				</Card.Header>
				<Card.Content class="flex h-28 items-end -space-x-2 pb-2">
					<div class="h-10 w-10 rounded-full bg-yellow-400"></div>
					<div class="h-10 w-10 rounded-full bg-red-400"></div>
					<div class="h-10 w-10 rounded-full bg-blue-400"></div>
					<div class="h-10 w-10 rounded-full bg-green-400"></div>
				</Card.Content>
				<Card.CardFooter class="h-14 pb-1 text-sm text-muted-foreground">
					Last updated: {formatDistanceToNow(project.updated_at)} ago
				</Card.CardFooter>
			</Card.Root>
		</a>
	{/each}
</div>
