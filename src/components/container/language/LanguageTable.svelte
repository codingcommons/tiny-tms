<script lang="ts">
	import * as Table from '$components/ui/table'
	import * as Form from '$components/ui/form'
	import type { SuperForm } from 'sveltekit-superforms'
	import { Input } from '$components/ui/input'
	import type { LanguagesSchema } from './schema'

	export let form: SuperForm<LanguagesSchema>

	const { form: formData } = form
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
		{#each $formData.languages as _, i}
			{#if $formData.languages[i]}
				<Table.Row>
					<Table.Cell class="font-medium">
						<Form.Field {form} name="languages">
							<Form.Control let:attrs>
								<Input
									{...attrs}
									data-testid="languages-code-input-{i}"
									placeholder="Enter Language Code"
									bind:value={$formData.languages[i].code}
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Table.Cell>
					<Table.Cell>
						<Form.Field {form} name="languages">
							<Form.Control let:attrs>
								<Input
									{...attrs}
									data-testid="languages-label-input-{i}"
									placeholder="Enter Language Label"
									bind:value={$formData.languages[i].label}
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Table.Cell>
					<Table.Cell>
						<Form.Field {form} name="languages">
							<Form.Control let:attrs>
								<Input
									{...attrs}
									data-testid="languages-fallback-input-{i}"
									placeholder="Enter Language Fallback"
									bind:value={$formData.languages[i].fallback}
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</Table.Cell>
					<Table.Cell class="text-right"></Table.Cell>
				</Table.Row>
			{/if}
		{/each}
	</Table.Body>
</Table.Root>
