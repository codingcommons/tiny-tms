<script lang="ts">
	import type { PageData } from './$types.js'
	import SignUpForm from '$components/container/auth/signup-form.svelte'
	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<SignUpForm data={data.form} />
