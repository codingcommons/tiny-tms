<script lang="ts">
	import * as Card from '$components/ui/card/index.js'

	export let project: { id: number; name: string; fallback_language?: number }
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{project.name}</Card.Title>
		<Card.Description>Add a new payment method to your account.</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-6">Content</Card.Content>
</Card.Root>
