import { z } from 'zod'
import { type LanguageCode, availableLanguages } from '../languages/languages'

export const createProjectSchema = z.object({
	name: z
		.string({ required_error: 'Project name is required' })
		.min(1, 'Project name must have at least one character'),
	base_language: z
		.enum(Object.keys(availableLanguages) as [LanguageCode, ...LanguageCode[]], {
			required_error: 'Base language is required'
		})
		.default('en')
})
