import { z } from 'zod'
import { type LanguageCode, availableLanguages } from '../language/languages'

// TODO: move to a shared and merge with the one in services project.ts
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
