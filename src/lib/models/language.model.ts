// TODO pull into models
import type { LanguageCode } from '$components/container/language/languages'

export type Language = {
	code: LanguageCode
	label: string
	fallback?: LanguageCode
}
