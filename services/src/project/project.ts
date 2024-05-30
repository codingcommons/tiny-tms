import type { Insertable, Selectable } from 'kysely'
import type { Projects } from 'kysely-codegen'

export type PojectCreationParams = Insertable<
  Omit<Projects, 'id' | 'created_at' | 'updated_at' | 'base_language'>
>
export type SelectableProject = Selectable<Projects>
