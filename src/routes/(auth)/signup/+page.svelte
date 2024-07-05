<script lang="ts">
	import type { PageData } from './$types.js'
	import SignUpForm from '$components/container/auth/signup-form.svelte'
	export let data: PageData
</script>

<SignUpForm data={data.form} />
