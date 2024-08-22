<script lang="ts">
	import * as Table from '$components/ui/table'
	import * as Form from '$components/ui/form'
	import type { SuperForm } from 'sveltekit-superforms'
	import { Input } from '$components/ui/input'
	import type { LanguageSchema } from './schema'
	import { Button } from '$components/ui/button'
	import { superForm } from 'sveltekit-superforms/client'

	export let languages: LanguageSchema[]

	function createLanguageForm(language: LanguageSchema) {
		return superForm<LanguageSchema>(language, {
			id: `language-${language.id}`,
			taintedMessage: null
		})
	}

	$: languageForms = languages.map(createLanguageForm)
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Code</Table.Head>
			<Table.Head>Label</Table.Head>
			<Table.Head>Fallback</Table.Head>
			<Table.Head class="w-[100px]">Action</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each languageForms as languageForm, i}
			{@const { form, enhance } = languageForm}
			<Table.Row>
				<Table.Cell class="font-medium">
					<Form.Field {form} name="code">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								data-testid="languages-code-input-{i}"
								placeholder="Enter Language Code"
								bind:value={$form.code}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Table.Cell>
				<Table.Cell>
					<Form.Field {form} name="label">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								data-testid="languages-label-input-{i}"
								placeholder="Enter Language Label"
								bind:value={$form.label}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Table.Cell>
				<Table.Cell>
					<Form.Field {form} name="fallback">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								data-testid="languages-fallback-input-{i}"
								placeholder="Enter Language Fallback"
								bind:value={$form.fallback}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Table.Cell>
				<Table.Cell class="text-right">
					<form method="POST" use:enhance>
						<input type="hidden" name="id" value={$form.id} />
						<Button type="submit">Update</Button>
					</form>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
