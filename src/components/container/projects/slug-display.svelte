<script lang="ts">
	import { createSlug } from 'services/util/slug/slug-service'

	interface Props {
		name: string
	}

	let { name }: Props = $props()
</script>

<div class="ml-3 flex text-xs">
	URL will be: /projects/
	<div class="font-bold">{createSlug(name)}</div>
</div>
