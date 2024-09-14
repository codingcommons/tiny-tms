import type { LanguageCode } from '$components/container/language/languages'
import type { LanguageId, LanguageSchema } from '$components/container/language/schema'
import type { Logger } from 'pino'
import * as repository from './language-repository'
import type { SelectableLanguage } from './language.model'

function mapToLanguage(language: SelectableLanguage): LanguageSchema {
	return {
		id: language.id as LanguageId,
		code: language.code as LanguageCode,
		label: language.label,
		fallback: language.fallback_language ? (language.fallback_language as LanguageCode) : undefined
	}
}

export async function getLanguagesForProject(slug: string): Promise<LanguageSchema[]> {
	const languages = await repository.getLanguagesForProject(slug)

	return languages.map(mapToLanguage)
}

export async function getBaseLanguageForProject(slug: string): Promise<LanguageSchema> {
	const baseLanguage = await repository.getBaseLanguageForProject(slug)
	if (!baseLanguage) throw new Error('No base language found for project')

	return mapToLanguage(baseLanguage)
}

export async function updateLanguage(language: LanguageSchema): Promise<LanguageSchema> {
	if (!language.id) {
		throw new Error('Language ID is required for updating')
	}

	const updatedLanguage = await repository.updateLanguage(language)

	return mapToLanguage(updatedLanguage)
}

export async function upsertLanguagesForProject(
	projectSlug: string,
	languages: LanguageSchema[]
): Promise<LanguageSchema[]> {
	const upsertedLanguages = await repository.upsertLanguages(projectSlug, languages)

	return upsertedLanguages.map(mapToLanguage)
}

export async function deleteLanguage(projectSlug: string, languageId: number, logger: Logger) {
	try {
		await repository.deleteLanguage(languageId)
	} catch (err: unknown) {
		let message = 'Failed to delete language.'
		if (err instanceof Error) message = err.message

		logger.info(message)
	}

	return getLanguagesForProject(projectSlug)
}
