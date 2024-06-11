import { getUser } from 'services/user/user-service'
import type { LayoutServerLoad } from './$types'
import type { User } from 'services/user/user'

export const load: LayoutServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) {
		return {
			status: 401,
			error: new Error('Unauthorized')
		}
	}

	let loggedInUser: User
	try {
		loggedInUser = await getUser(user.id)
	} catch (error) {
		return {
			status: 500,
			error
		}
	}

	return {
		loggedInUser
	}
}
