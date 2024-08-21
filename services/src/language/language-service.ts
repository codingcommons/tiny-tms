import type { LanguageCode } from '$components/container/language/languages'
import type { LanguagesSchema } from '$components/container/language/schema'
import * as repository from './language-repository'

export async function getLanguagesForProject(id: number): Promise<LanguagesSchema> {
	console.warn(id)
	const languages = await repository.getLanguagesForProject(id)

	console.warn(languages)

	return {
		languages: languages.map(({ code, label, fallback_language }) => ({
			code: code as LanguageCode,
			label,
			fallback: fallback_language as LanguageCode
		}))
	}
}
