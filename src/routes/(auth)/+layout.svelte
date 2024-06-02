<script lang="ts">
	import Check from 'lucide-svelte/icons/check'
	import { ThemeSelector } from '$components/ui/theme-selector'
</script>

<div class="flex h-screen">
	<div class="flex w-1/2 flex-col bg-secondary text-secondary-foreground">
		<!-- Top Section -->
		<div class="flex-none p-6">
			<div class="text-2xl">
				<span>⌘ Tiny-TMS</span>
			</div>
		</div>

		<!-- Middle Section -->
		<div
			class="flex flex-grow flex-col items-start justify-center space-y-4 p-6 text-2xl font-semibold"
		>
			<div class="flex items-center">
				<span class="mr-2.5 rounded-full bg-primary p-1.5">
					<Check strokeWidth={1} class="stroke-primary-foreground" />
				</span>
				<span>Efficiently translate your content</span>
			</div>
			<div class="flex items-center">
				<span class="mr-2.5 rounded-full bg-primary p-1.5">
					<Check strokeWidth={1} class="stroke-primary-foreground" />
				</span>
				<span>Open source and self hosting</span>
			</div>
			<div class="flex items-center">
				<span class="mr-2.5 rounded-full bg-primary p-1.5">
					<Check strokeWidth={1} class="stroke-primary-foreground" />
				</span>
				<span>Seamless AI-Autocompletion integrations</span>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="flex-none p-6">
			<div>
				<p>A Translation Management System to cover the needs of most people.</p>
				<p>Not for everyone, but for most.</p>
			</div>
		</div>
		<div class="p-6">
			<ThemeSelector />
		</div>
	</div>

	<div class="my-auto w-1/2"><slot></slot></div>
</div>
