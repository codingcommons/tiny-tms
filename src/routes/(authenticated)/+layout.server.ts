import { getUser } from 'services/user/user-service'
import type { LayoutServerLoad } from './$types'
import type { User } from 'services/user/user'
import { error } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ locals: { user, logger } }) => {
	if (!user) return error(403)

	let loggedInUser: User
	try {
		loggedInUser = await getUser(user.id)
	} catch (e: unknown) {
		logger.error(`failed to get user ${user.id} from the db`)

		return error(500)
	}

	return {
		loggedInUser
	}
}
