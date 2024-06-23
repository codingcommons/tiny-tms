import { deleteUser } from 'services/user/user-service'
import type { RequestHandler } from './$types'
import { ZodError, z } from 'zod'

const deleteUserSchema = z.object({
	userId: z.number().nonnegative()
})

export const DELETE: RequestHandler = async ({ request, locals: { user, logger } }) => {
	let userId: number
	try {
		userId = deleteUserSchema.parse(await request.json()).userId

		if (user?.id !== userId) throw Error('payload user id does not match with locals user id')
	} catch (e: unknown) {
		if (e instanceof ZodError) {
			logger.error(e.message)
		} else if (e instanceof Error) {
			logger.error('Could not parse delete user payload')
		}

		return new Response(null, {
			status: 500
		})
	}

	try {
		const result = await deleteUser(userId)

		if (!result) throw new Error(`Did not delete the user, does the user ${userId} exist?`)
	} catch (e: unknown) {
		if (e instanceof Error) logger.error(e.message)

		return new Response(null, {
			status: 500
		})
	}

	return new Response()
}
