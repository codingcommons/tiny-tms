import { z } from 'zod'

export const languageSchema = z.object({
	id: z.number().optional(),
	code: z.string().min(1, { message: 'Language code is required' }),
	label: z
		.string({
			required_error: 'Language label is required'
		})
		.min(1, 'Language label must at least consist of a single character'),
	fallback: z.string().optional()
})

export const languagesSchema = z.object({
	languages: z.array(languageSchema).superRefine((languages, ctx) => {
		const seenCodes = new Set<string>()

		languages.forEach((language, index) => {
			if (seenCodes.has(language.code)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Language codes must be unique',
					path: [`${index}`, 'code']
				})
			} else {
				seenCodes.add(language.code)
			}
		})
	})
})

export type LanguageSchema = z.infer<typeof languageSchema>
export type LanguagesSchema = z.infer<typeof languagesSchema>

declare const actionPlanningId: unique symbol
export type LanguageId = number & { readonly [actionPlanningId]: never }
