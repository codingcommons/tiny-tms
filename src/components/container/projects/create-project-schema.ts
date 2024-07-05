import { z } from 'zod'

export const createProjectSchema = z.object({
	name: z
		.string({ required_error: 'Project name is required' })
		.min(1, 'Project name must have at least one character'),
	base_language: z
		.string({ required_error: 'Base language is required' })
		.min(1, 'Base language must have at least one character')
})
