import type { Insertable, Selectable } from 'kysely'
import type { Projects } from 'kysely-codegen'

export type ProjectCreationParams = {
	name: string
	slug: string
	base_language_code: string
}
export type Project = SelectableProject

export type SelectableProject = Selectable<Projects>
export type InsertableProject = Insertable<Projects>
