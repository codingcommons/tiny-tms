import { getUser } from 'services/user/user-service'
import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ locals: { user, logger } }) => {
	if (!user) return error(403)

	const loggedInUser = await getUser(user.id)
	if (!loggedInUser) {
		logger.error(`Failed to get user ${user.id} from the db`)

		return error(500)
	}

	return {
		loggedInUser
	}
}
