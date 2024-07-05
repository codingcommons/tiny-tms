<script lang="ts">
	import type { PageData } from './$types.js'
	import LoginForm from '$components/container/auth/login-form.svelte'
	export let data: PageData
</script>

<LoginForm data={data.form} />
