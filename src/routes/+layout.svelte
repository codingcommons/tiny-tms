<script>
	import '../app.pcss'
	import { Toaster } from '$components/ui/sonner'
	import { browser } from '$app/environment'

	let { children } = $props()
</script>

<main class:hydrated={browser} class="h-screen w-screen overflow-clip">
	{@render children?.()}

	<Toaster />
</main>
