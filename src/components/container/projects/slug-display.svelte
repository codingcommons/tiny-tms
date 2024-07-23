<script lang="ts">
	import { createSlug } from 'shared/slug/slug-service'

	export let name: string
</script>

<div class="ml-3 flex text-xs">
	URL will be: /projects/
	<div class="font-bold">{createSlug(name)}</div>
</div>
