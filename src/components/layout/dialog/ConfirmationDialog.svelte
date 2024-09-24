<script lang="ts" context="module">
	export type DialogCtaProps = {
		formaction: string | undefined
		formId: string | undefined
		onClick: (() => void) | undefined
		name: string
		value: number | undefined
		label: string
		variant: ButtonVariants
	}
</script>

<script lang="ts">
	import * as Dialog from '$components/ui/dialog'
	import { Button, type ButtonVariants } from '$components/ui/button'

	export let open = false
	export let title: string
	export let description: string
	export let cta: DialogCtaProps

	const confirmTestId = 'confirm-dialog-cta'
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>
				{description}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => (open = false)}>Cancel</Button>

			<Button
				type="submit"
				form={cta.formId}
				variant={cta.variant}
				name={cta.name}
				data-testid={confirmTestId}
				formaction={cta.formaction}
				value={cta.value}
				on:click={() => {
					cta.onClick && cta.onClick()
					open = false
				}}
			>
				{cta.label}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
