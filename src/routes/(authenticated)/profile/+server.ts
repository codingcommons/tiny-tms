import { changeUserPassword, deleteUser } from 'services/user/user-service'
import type { RequestHandler } from './$types'
import { ZodError } from 'zod'
import {
	type ChangePasswordPayload,
	changePasswordSchema,
	deleteUserSchema
} from '$components/container/profile/schema'

export const DELETE: RequestHandler = async ({ request, locals: { user, logger } }) => {
	let userId: number
	try {
		userId = deleteUserSchema.parse(await request.json()).userId

		if (user?.id !== userId) {
			return new Response(
				JSON.stringify({ message: 'payload user id does not match with locals user id' }),
				{ status: 403 }
			)
		}
	} catch (e: unknown) {
		if (e instanceof ZodError) {
			logger.error(e.message)
		} else if (e instanceof Error) {
			logger.error('Could not parse delete user payload')
		}

		return new Response(null, {
			status: 400
		})
	}

	try {
		await deleteUser(userId)
	} catch (e: unknown) {
		if (e instanceof Error) logger.error(e.message)

		return new Response(null, {
			status: 500
		})
	}

	return new Response()
}

export const PUT: RequestHandler = async ({ request, locals: { user, logger } }) => {
	if (!user?.id)
		return new Response(JSON.stringify({ message: 'missing user id' }), { status: 400 })

	let changePasswordPayload: ChangePasswordPayload
	try {
		changePasswordPayload = changePasswordSchema.parse(await request.json())
	} catch (e: unknown) {
		if (e instanceof ZodError) {
			logger.error(e.message)

			return new Response(JSON.stringify({ message: e.message }))
		}

		logger.error('Could not parse change password payload')

		return new Response(JSON.stringify({ message: 'Could not parse change password payload' }), {
			status: 400
		})
	}

	let errorMessage: string
	try {
		await changeUserPassword(user.id, changePasswordPayload)
	} catch (e: unknown) {
		errorMessage = 'Cloud not update the password'
		if (e instanceof Error) {
			logger.error(e.message)
			errorMessage = e.message
		}

		return new Response(JSON.stringify({ message: errorMessage }), {
			status: 500
		})
	}

	return new Response()
}
