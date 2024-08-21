<script lang="ts">
	export let title = 'Projects'
</script>

<div class="mb-28 flex items-center justify-between">
	<div class="flex w-full justify-between">
		<h2 class="border-b-2 text-3xl font-semibold">{title}</h2>
		<slot name="actions" />
	</div>
	<slot />
</div>
