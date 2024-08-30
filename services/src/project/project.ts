import type { Insertable, Selectable } from 'kysely'
import type { Projects } from 'kysely-codegen'
import { z } from 'zod'

export type Project = SelectableProject

export type SelectableProject = Selectable<Projects>
export type InsertableProject = Insertable<Projects>

// TODO: add better slug validation
export const createProjectSchema = z.object({
	name: z
		.string({ required_error: 'Project name is required' })
		.min(1, 'Project name must have at least one character'),
	base_language: z
		.string({ required_error: 'Base language is required' })
		.min(1, 'Base language must have at least one character'),
	base_language_label: z
		.string({ required_error: 'Base language label is required' })
		.min(1, 'Base language label must have at least one character'),
	slug: z
		.string({ required_error: 'Slug is required' })
		.min(1, 'Slug must have at least 1 character')
})

export type CreateProjectFormSchema = z.infer<typeof createProjectSchema>
