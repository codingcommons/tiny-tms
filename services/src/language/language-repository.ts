import type { SelectableLanguage } from './language.model'
import { db } from '../db/database'
import type { LanguageSchema } from '$components/container/language/schema'
import type { LanguageCode } from '$components/container/language/languages'
import { getProjectBySlug } from 'services/project/project-repository'

async function getFallbackLanguageId(fallback: LanguageCode | undefined) {
	if (!fallback) return null

	return (
		await db
			.selectFrom('languages')
			.where('code', '=', fallback)
			.select('id')
			.executeTakeFirstOrThrow()
	).id
}

export function getLanguagesForProject(slug: string): Promise<SelectableLanguage[]> {
	return db
		.selectFrom('languages as l1')
		.leftJoin('languages as l2', 'l1.fallback_language', 'l2.id')
		.leftJoin('projects', 'projects.id', 'l1.project_id')
		.where('projects.slug', '=', slug)
		.select(['l1.id', 'l1.code', 'l1.label', 'l2.code as fallback_language'])
		.execute()
}

export async function updateLanguage(language: LanguageSchema): Promise<SelectableLanguage> {
	const updatedLanguages = await db
		.updateTable('languages')
		.set({
			code: language.code,
			label: language.label,
			fallback_language: await getFallbackLanguageId(language.fallback)
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

export async function upsertLanguages(
	projectSlug: string,
	languages: LanguageSchema[]
): Promise<SelectableLanguage[]> {
	const project = await getProjectBySlug(projectSlug)

	const languagesToUpsert = await Promise.all(
		languages.map(async (language) => ({
			project_id: project.id,
			code: language.code,
			label: language.label,
			fallback_language: await getFallbackLanguageId(language.fallback)
		}))
	)

	const upsertedLanguages = await db
		.insertInto('languages')
		.values(languagesToUpsert)
		.onConflict((oc) =>
			oc.columns(['project_id', 'code']).doUpdateSet({
				label: (eb) => eb.ref('excluded.label'),
				fallback_language: (eb) => eb.ref('excluded.fallback_language')
			})
		)
		.returning(['id', 'code', 'label', 'fallback_language'])
		.execute()

	return upsertedLanguages.map((upsertedLanguage) => ({
		...upsertedLanguage,
		fallback_language:
			languages.find(({ code }) => upsertedLanguage.code === code)?.fallback ?? null
	}))
}

export async function deleteLanguage(id: number): Promise<void> {
	const result = await db.deleteFrom('languages').where('id', '=', id).execute()

	if (result[0]?.numDeletedRows === 0n) throw new Error(`Failed to delete language with id ${id}`)
}
