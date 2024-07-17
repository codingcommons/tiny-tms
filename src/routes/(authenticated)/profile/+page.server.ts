import { changePasswordSchema } from '$components/container/profile/schema'
import { fail } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad } from './$types'
import { changeUserPassword, deleteUser } from 'services/user/user-service'

export const load: PageServerLoad = async () => {
	return { changePasswordForm: await superValidate(zod(changePasswordSchema)) }
}

export const actions: Actions = {
	changePassword: async ({ request, locals: { user, logger } }) => {
		const changePasswordForm = await superValidate(request, zod(changePasswordSchema))

		if (!changePasswordForm.valid) return fail(400, { form: changePasswordForm })

		if (!user) return fail(403)

		let errorMessage: string
		try {
			await changeUserPassword(user.id, changePasswordForm.data)
		} catch (e: unknown) {
			errorMessage = 'Failed to update the password'
			if (e instanceof Error) {
				logger.error(e.message)
				errorMessage = e.message
			}

			return message(changePasswordForm, errorMessage, {
				status: 500
			})
		}

		return message(changePasswordForm, 'Password successfully updated')
	},

	deleteProfile: async ({ locals: { user, logger } }) => {
		if (!user) {
			logger.error('unauthenticated user trying to delete profile')

			return fail(403)
		}

		try {
			await deleteUser(user.id)
		} catch (e: unknown) {
			if (e instanceof Error) logger.error(e.message)

			return new Response(null, {
				status: 500
			})
		}

		return { success: true }
	}
}
