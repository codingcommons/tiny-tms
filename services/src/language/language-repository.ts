import type { SelectableLanguage } from './language.model'
import { db } from '../db/database'
import type { LanguageSchema } from '$components/container/language/schema'
import type { LanguageCode } from '$components/container/language/languages'
import { getProjectBySlug } from 'services/project/project-repository'
import type { Transaction } from 'kysely'
import type { DB } from 'kysely-codegen'

async function getFallbackLanguageId(fallback: string | undefined, tx?: Transaction<DB>) {
	if (!fallback) return null

	return (
		await (tx ?? db)
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

export async function getBaseLanguageForProject(slug: string): Promise<SelectableLanguage> {
	const baseLanguage = await db
		.selectFrom('languages')
		.leftJoin('projects', 'languages.id', 'projects.base_language_id')
		.where('projects.slug', '=', slug)
		.select(['languages.id', 'languages.code', 'languages.label'])
		.executeTakeFirstOrThrow()

	return { ...baseLanguage, fallback_language: null }
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
	languages: LanguageSchema[],
	tx?: Transaction<DB>
): Promise<SelectableLanguage[]> {
	const project = await getProjectBySlug(projectSlug, tx)

	const languagesToUpsert = await Promise.all(
		languages.map(async (language) => ({
			id: language.id,
			project_id: project.id,
			code: language.code,
			label: language.label,
			fallback_language: await getFallbackLanguageId(language.fallback, tx)
		}))
	)

	const upsertedLanguages = await (tx ?? db)
		.insertInto('languages')
		.values(languagesToUpsert)
		.onConflict((oc) =>
			oc.column('id').doUpdateSet({
				code: (eb) => eb.ref('excluded.code'),
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

/**
 * @throws {Error} if language id does not exist or language could not be deleted
 */
export async function deleteLanguage(id: number): Promise<void> {
	// remove from fallback languages first
	await db
		.updateTable('languages')
		.set({ fallback_language: null })
		.where('languages.fallback_language', '=', id)
		.execute()

	const result = await db.deleteFrom('languages').where('id', '=', id).executeTakeFirstOrThrow()

	if (result.numDeletedRows === 0n) throw new Error(`Failed to delete language with id ${id}`)
}
