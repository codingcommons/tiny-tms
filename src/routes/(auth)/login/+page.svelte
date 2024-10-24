<script lang="ts">
	import type { PageData } from './$types.js'
	import LoginForm from '$components/container/auth/login-form.svelte'
	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<LoginForm data={data.form} />
