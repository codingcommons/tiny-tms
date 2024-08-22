import { z } from 'zod'
import { type LanguageCode, availableLanguages } from './languages'

export const languageSchema = z.object({
	id: z.number().optional(),
	code: z.enum(Object.keys(availableLanguages) as [LanguageCode, ...LanguageCode[]], {
		required_error: 'Language code is required'
	}),
	label: z
		.string({
			required_error: 'Language label is required'
		})
		.min(1, 'Language label must at least consist of a single character'),
	fallback: z.enum(Object.keys(availableLanguages) as [LanguageCode, ...LanguageCode[]]).optional()
})

export type LanguageSchema = z.infer<typeof languageSchema>
