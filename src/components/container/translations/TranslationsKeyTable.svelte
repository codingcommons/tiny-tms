<script lang="ts" context="module">
	export type TranslationData = {
		key: string
		translations: { langCode: LanguageCode; langLabel: string; text: string; isDefault?: boolean }[]
	}
</script>

<script lang="ts">
	import * as Table from '$components/ui/table'
	import CopyClipboard from '$components/copy/CopyClipboard.svelte'
	import Input from '$components/ui/input/input.svelte'
	import Badge from '$components/ui/badge/badge.svelte'
	import Button from '$components/ui/button/button.svelte'
	import { Languages } from 'lucide-svelte'
	import { type LanguageCode } from '$components/container/language/languages'

	export let translationData: TranslationData[] = [
		{
			key: 'survey.question.title',
			translations: [
				{
					langCode: 'en',
					langLabel: 'English',
					text: 'Have you already eaten something today?',
					isDefault: true
				},
				{ langCode: 'es', langLabel: 'Spanish', text: '' },
				{ langCode: 'zh', langLabel: 'Chinese', text: '你今天已经吃东西了吗？' }
			]
		},
		{
			key: 'survey.question.description',
			translations: [
				{
					langCode: 'en',
					langLabel: 'English',
					text: 'It is important for us to know that you follow a daily diet.',
					isDefault: true
				},
				{
					langCode: 'es',
					langLabel: 'Spanish',
					text: 'Es importante para nosotros saber que usted sigue una dieta diaria.'
				},
				{ langCode: 'zh', langLabel: 'Chinese', text: '' }
			]
		},
		{
			key: 'user.greeting',
			translations: [
				{ langCode: 'en', langLabel: 'English', text: 'Hello my dear friend.', isDefault: true },
				{ langCode: 'es', langLabel: 'Spanish', text: '' },
				{ langCode: 'zh', langLabel: 'Chinese', text: '你好我亲爱的朋友。' }
			]
		}
	]
</script>

<Table.Root class="w-full">
	{#each translationData as keyValue}
		<Table.Row>
			<Table.Cell colspan={3} class="p-0">
				<div
					class="flex w-full items-center justify-between bg-primary p-2 text-base text-primary-foreground"
				>
					<span>{keyValue.key}</span>
					<CopyClipboard value={keyValue.key} />
				</div>
			</Table.Cell>
		</Table.Row>

		{#each keyValue.translations as translation}
			<Table.Row>
				<Table.Cell class="w-5 font-bold">{translation.langCode}</Table.Cell>
				<Table.Cell>
					<div class="flex items-center gap-2">
						<Input placeholder="Add translation" bind:value={translation.text} />
						{#if translation.isDefault}
							<Badge>Default</Badge>
						{/if}
						{#if !translation.text}
							<Button size="icon" on:click={() => {}}>
								<Languages />
							</Button>
						{/if}
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	{/each}
</Table.Root>
