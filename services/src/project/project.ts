import type { Insertable, Selectable } from 'kysely'
import type { Projects } from 'kysely-codegen'
import { z } from 'zod'

export type ProjectCreationParams = Insertable<Omit<Projects, 'id' | 'created_at' | 'updated_at'>>
export type Project = SelectableProject

export type SelectableProject = Selectable<Projects>
export type InsertableProject = Insertable<Projects>

export const createProjectSchema = z.object({
	name: z
		.string({ required_error: 'Project name is required' })
		.min(1, 'Project name must have at least one character'),
	base_language: z
		.string({ required_error: 'Base language is required' })
		.min(1, 'Base language must have at least one character')
})

export type CreateProjectFormSchema = z.infer<typeof createProjectSchema>
