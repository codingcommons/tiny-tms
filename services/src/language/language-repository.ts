import type { SelectableLanguage } from './language.model'
import { db } from '../db/database'
import type { LanguageSchema } from '$components/container/language/schema'
import type { LanguageCode } from '$components/container/language/languages'

export function getLanguagesForProject(id: number): Promise<SelectableLanguage[]> {
	return db
		.selectFrom('languages as l1')
		.leftJoin('languages as l2', 'l1.fallback_language', 'l2.id')
		.where('l1.project_id', '=', id)
		.select(['l1.id', 'l1.code', 'l1.label', 'l2.code as fallback_language'])
		.execute()
}

export async function updateLanguage(language: LanguageSchema): Promise<SelectableLanguage> {
	let fallbackId: number | null = null

	if (language.fallback)
		fallbackId = (
			await db
				.selectFrom('languages')
				.where('code', '=', language.fallback)
				.select('id')
				.executeTakeFirstOrThrow()
		).id

	const updatedLanguages = await db
		.updateTable('languages')
		.set({
			code: language.code,
			label: language.label,
			fallback_language: fallbackId
		})
		.where('id', '=', language.id!)
		.returning(['id', 'code', 'label', 'fallback_language'])
		.execute()

	const updatedLanguage = updatedLanguages[0]

	if (!updatedLanguage) throw new Error(`Failed to update language "${language.code}"`)

	return {
		...updatedLanguage,
		fallback_language: language.fallback ? (language.fallback as LanguageCode) : null
	}
}
