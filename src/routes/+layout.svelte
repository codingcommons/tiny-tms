<script>
	import '../app.pcss'
	import { Toaster } from '$components/ui/sonner'
	import { browser } from '$app/environment'
</script>

<main class:hydrated={browser} class="h-screen w-screen">
	<slot />

	<Toaster />
</main>
