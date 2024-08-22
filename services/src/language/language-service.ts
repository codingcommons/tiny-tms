import type { LanguageCode } from '$components/container/language/languages'
import type { LanguageSchema } from '$components/container/language/schema'
import * as repository from './language-repository'

export async function getLanguagesForProject(id: number): Promise<LanguageSchema[]> {
	const languages = await repository.getLanguagesForProject(id)

	return languages.map(({ id, code, label, fallback_language }) => ({
		id,
		code: code as LanguageCode,
		label,
		fallback: fallback_language as LanguageCode
	}))
}
