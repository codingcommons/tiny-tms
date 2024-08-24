<script lang="ts">
	import type { LanguageCode } from '$components/container/language/languages'
	import LanguageSelect from '$components/container/language/LanguageSelect.svelte'
	import { MainContent, MainContentHeader } from '$components/layout/main-content'
	import type { PageData } from './$types'
	import * as Form from '$components/ui/form'
	import { page } from '$app/stores'
	import { toast } from 'svelte-sonner'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { languagesSchema } from '$components/container/language/schema'
	import LanguageTable from '$components/container/language/LanguageTable.svelte'

	export let data: PageData

	let selectedLanguage: LanguageCode

	const form = superForm(data.form, {
		validators: zodClient(languagesSchema),
		dataType: 'json',
		async onUpdated({ form }) {
			if (form.message) {
				if ($page.status >= 400) {
					toast.error(form.message)
				} else {
					toast.success(form.message.message)
				}
			}
		}
	})

	const { enhance } = form
</script>

<MainContent>
	<form method="POST" use:enhance>
		<MainContentHeader title="{data.project.name} - Languages">
			<div slot="actions">
				<Form.Button>Save</Form.Button>
			</div>
		</MainContentHeader>

		<div class="w-[30vw]">
			<LanguageSelect name="language-select" bind:value={selectedLanguage} />
		</div>

		<LanguageTable {form} />
	</form>
</MainContent>
