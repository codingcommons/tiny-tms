<script>
	import '../app.pcss'
	import { Toaster } from '$components/ui/sonner'
</script>

<main class="h-screen w-screen">
	<slot />

	<Toaster />
</main>
