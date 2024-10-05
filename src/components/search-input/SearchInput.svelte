<script lang="ts">
	import { Search } from 'lucide-svelte'
	import { Input } from '$components/ui/input'

	export let placeholder = 'Search...'
</script>

<div class="relative">
	<Search class="absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground" />
	<Input {placeholder} class="pl-8" />
</div>
