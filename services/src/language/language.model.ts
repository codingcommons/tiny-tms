import type { Selectable } from 'kysely'
import type { Languages } from 'kysely-codegen'

export type SelectableLanguage = Selectable<
	Pick<Languages, 'id' | 'code' | 'label'> & { fallback_language: string }
>
