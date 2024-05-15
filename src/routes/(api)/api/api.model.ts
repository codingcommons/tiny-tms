import { z } from 'zod'

const translationKeySchema = z.string().brand('translation-key')
export type TranslationKey = z.infer<typeof translationKeySchema>

const translationLanguageSchema = z.string().brand('translation-language')
export type TranslationLanguage = z.infer<typeof translationLanguageSchema>

const translationValueSchema = z.string().brand('translation-value')
export type TranslationValue = z.infer<typeof translationValueSchema>

const addTranslationCommandSchema = z.object({
	key: translationKeySchema,
	lang: translationLanguageSchema,
	value: translationValueSchema
})
export type AddTranslationCommand = z.infer<typeof addTranslationCommandSchema>

export const translationPOSTRequestSchema = addTranslationCommandSchema.array()

export const translationsDELETERequestSchema = translationKeySchema.array()

const frontendAdapterSchema = z.enum(['typesafe-i18n', 'other'])

export const projectConfigPOSTRequestSchema = z.object({
	frontendAdapter: frontendAdapterSchema
})
