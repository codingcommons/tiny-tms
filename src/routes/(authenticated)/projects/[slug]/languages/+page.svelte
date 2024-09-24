<script lang="ts">
	import { type LanguageCode, availableLanguages } from '$components/container/language/languages'
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
	import { Button } from '$components/ui/button'
	import { Check, Plus } from 'lucide-svelte'

	export let data: PageData

	let selectedLanguage: LanguageCode | undefined = undefined

	const form = superForm(data.form, {
		validators: zodClient(languagesSchema),
		dataType: 'json',
		resetForm: false,
		async onUpdated({ form }) {
			if (form.valid) {
				toast.success('Languages updated successfully')
			} else {
				if ($page.status >= 400) {
					toast.error(form.message ?? 'Failed to update languages')
				}
			}
		}
	})

	const { enhance, form: formData, tainted, isTainted } = form

	function addLanguage() {
		if (selectedLanguage && availableLanguages[selectedLanguage]) {
			$formData.languages = [
				...$formData.languages,
				{
					code: selectedLanguage,
					label: availableLanguages[selectedLanguage],
					fallback: undefined
				}
			]

			selectedLanguage = undefined
		} else {
			toast.error('Please select a valid language')
		}
	}

	// TODO: modal if we delete language that is used as fallback
	function deleteUnpersistedLanguage(e: CustomEvent<string | undefined>) {
		const code = e.detail
		if (code) $formData.languages = $formData.languages.filter((language) => language.code !== code)
	}
</script>

<MainContent>
	<form id="languagesForm" method="POST" use:enhance>
		<MainContentHeader title="{data.project.name} - Languages">
			<div slot="actions">
				<Form.Button type="submit" formaction="?/upsert" disabled={!isTainted($tainted)}>
					<Check size="16" class="mr-2" />
					Save
				</Form.Button>
			</div>
		</MainContentHeader>

		<div class="flex items-center gap-4">
			<div class="w-[30vw]">
				<LanguageSelect name="language-select" bind:value={selectedLanguage} />
			</div>
			<Button size="default" on:click={addLanguage}>
				<Plus size="16" class="mr-2" />
				Add
			</Button>
		</div>

		<LanguageTable
			{form}
			baseLanguage={data.baseLanguage}
			on:deleteLanguage={deleteUnpersistedLanguage}
		/>
	</form>
</MainContent>
