<!-- heavily inspired by https://svelte.dev/repl/407903af00114bd181f2bb314b46358d?version=3.44.1 -->
<script lang="ts">
	import { slide } from 'svelte/transition'
	import { page } from '$app/stores'
	import type { TreeNode } from './NavigationTree.svelte'

	export let root = false
	export let childVisible = true
	export let node: TreeNode
	export let visible = true
	export let level = 0

	let state: 'open' | 'closed' = 'open'
	function toggle() {
		state = state === 'open' ? 'closed' : 'open'
	}
</script>

{#if visible || childVisible || root}
	<li class="list-none" transition:slide|global>
		<div
			class="flex cursor-pointer select-none items-center gap-1 pb-1 pt-1 no-underline"
			on:click={toggle}
			on:keyup={toggle}
			role="menuitem"
			tabindex="0"
		>
			{#if node.children.length === 0}
				<a class="no-underline" href={node.href} class:active={$page.url.pathname === node.href}>
					{node.name}
				</a>
			{:else}
				<span>{node.name}</span>
			{/if}
		</div>

		<ul class="ps-4">
			{#if state === 'open' && node.children}
				{#each node.children as child}
					<svelte:self node={child} level={level + 1} bind:visible={childVisible} />
				{/each}
			{/if}
		</ul>
	</li>
{/if}
