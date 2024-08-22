import type { SelectableLanguage } from './language.model'
import { db } from '../db/database'
import type { LanguageSchema } from '$components/container/language/schema'

export function getLanguagesForProject(id: number): Promise<SelectableLanguage[]> {
	return db
		.selectFrom('languages as l1')
		.leftJoin('languages as l2', 'l1.fallback_language', 'l2.id')
		.where('l1.project_id', '=', id)
		.select(['l1.id', 'l1.code', 'l1.label', 'l2.code as fallback_language'])
		.execute()

export function updateLanguage(language: LanguageSchema): Promise<void> {
	return db
		.updateTable('languages')
		.set({
			code: language.code,
			label: language.label,
			fallback_language: language.fallback || null
		})
		.where('id', '=', language.id!)
		.execute()
}
}
