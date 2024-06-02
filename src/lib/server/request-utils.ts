import { error } from '@sveltejs/kit'
import type { z } from 'zod'

export const validateRequestBody = async <T>(req: Request, schema: z.ZodSchema<T>): Promise<T> => {
	const body = await req.json()
	const validationResult = schema.safeParse(body)
	if (!validationResult.success) {
		error(400, 'Invalid request')
	}

	return validationResult.data
}
