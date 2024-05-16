import type { Insertable, Selectable } from 'kysely'
import type { Apikeys } from 'kysely-codegen'

export type ApiKeyCreationParams = Insertable<Omit<Apikeys, 'id' | 'created_at'>>
export type SelectableApiKey = Selectable<Apikeys>
