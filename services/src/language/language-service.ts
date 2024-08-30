import type { LanguageCode } from '$components/container/language/languages'
import type { LanguageId, LanguageSchema } from '$components/container/language/schema'
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

export async function getLanguagesForProject(id: number): Promise<LanguageSchema[]> {
	const languages = await repository.getLanguagesForProject(id)

	return languages.map(mapToLanguage)
}

export async function updateLanguage(language: LanguageSchema): Promise<LanguageSchema> {
	if (!language.id) {
		throw new Error('Language ID is required for updating')
	}

	const updatedLanguage = await repository.updateLanguage(language)

	return mapToLanguage(updatedLanguage)
}

export async function upsertLanguagesForProject(
	projectId: number,
	languages: LanguageSchema[]
): Promise<LanguageSchema[]> {
	const upsertedLanguages = await repository.upsertLanguages(projectId, languages)

	return upsertedLanguages.map(mapToLanguage)
}

export async function deleteLanguage(projectId: number, languageId: number) {
	await repository.deleteLanguage(languageId)

	return getLanguagesForProject(projectId)
}
