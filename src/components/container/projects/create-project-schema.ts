import { z } from 'zod'
import { type LanguageCode, availableLanguages } from '../language/languages'

export const createProjectSchema = z.object({
	name: z
		.string({ required_error: 'Project name is required' })
		.min(1, 'Project name must have at least one character'),
	base_language: z
		.enum(Object.keys(availableLanguages) as [LanguageCode, ...LanguageCode[]], {
			required_error: 'Base language is required'
		})
		.default('en'),
	base_language_label: z
		.enum(Object.values(availableLanguages) as [string, ...string[]], {
			required_error: 'Base language label is required'
		})
		.default('English')
})
