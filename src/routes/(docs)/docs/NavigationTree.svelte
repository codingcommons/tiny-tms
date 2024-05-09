<script lang="ts" context="module">
	export type TreeNode = {
		name: string
		children: TreeNode[]
		href: string
	}
</script>

<script lang="ts">
	import NavigationNode from './NavigationNode.svelte'

	export let data: TreeNode
</script>

<nav class="basis-1/6 overflow-y-auto bg-slate-300 p-4">
	<ul>
		<NavigationNode bind:node={data} root />
	</ul>
</nav>

<style>
	ul {
		list-style-type: none;
		padding-inline-start: 0;
	}
</style>
