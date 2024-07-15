import { createSlug } from 'services/util/slug/slug-service'
import { z } from 'zod'

export const baseCreateProjectSchema = z.object({
	name: z
		.string({ required_error: 'Project name is required' })
		.min(1, 'Project name must have at least one character'),
	base_language_code: z
		.string({ required_error: 'Base language is required' })
		.min(1, 'Base language must have at least one character')
})

export const createProjectSchema = baseCreateProjectSchema.refine(
	(data) => createSlug(data.name).length > 0,
	{
		message: 'URL must have at least one character',
		path: ['name']
	}
)

export type CreateProjectFormSchema = z.infer<typeof createProjectSchema>
